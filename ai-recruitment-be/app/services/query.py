import os
import json
from typing import List, Dict

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv
from data import CANDIDATE_DATA as DATA_PELAMAR

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_db")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def get_candidate_by_id(candidate_id: str) -> Dict:
    """
    Fungsi ini mensimulasikan query ke SQL/NoSQL Database
    SELECT * FROM candidates WHERE id = 'candidate_id'
    """
    for person in DATA_PELAMAR:
        if person['id'] == candidate_id:
            return person
    return None

def to_toon_format(data: Dict) -> str:
    """
    Mengubah Dictionary menjadi string JSON yang sangat padat (Minified).
    Menghapus spasi yang tidak perlu untuk menghemat Token OpenAI.
    """
    return json.dumps(data, separators=(',', ':'), ensure_ascii=False)

def find_best_candidates_raw(position: str, description: str, top_k: int = 5):
    embedding_model = HuggingFaceEmbeddings(
        model_name="intfloat/multilingual-e5-small",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )
    
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_model)

    print(f"🔍 [Phase 1] Semantic Search untuk: '{position}'")
    
    results = db.similarity_search_with_score(
        query=description,
        k=top_k,
        filter={"position_applied": position}
    )

    if not results:
        return []

    candidates_payload = []
    
    print(f"   -> Ditemukan {len(results)} kandidat potensial. Mengambil data asli...")

    for doc, score in results:
        c_id = doc.metadata.get('candidate_id')
        original_data = get_candidate_by_id(c_id)
        
        if original_data:
            original_data['vector_score'] = round(score, 4)
            candidates_payload.append(original_data)

    return candidates_payload

def score_candidates_with_llm(job_description: str, candidates_data: List[Dict]):
    if not candidates_data:
        print("❌ Tidak ada data kandidat untuk dinilai.")
        return

    print(f"\n🤖 [Phase 2] Mengirim {len(candidates_data)} kandidat ke AI untuk Scoring...")
    
    # Mengonversi data kandidat menjadi string JSON yang padat
    candidates_str = ""
    for cand in candidates_data:
        compact_json = to_toon_format(cand) 
        candidates_str += f"- {compact_json}\n"

    # Inisialisasi ChatOpenAI
    # Menggunakan model 'gpt-4o' atau 'gpt-3.5-turbo' yang stabil
    chat = ChatOpenAI(
        model="gpt-4o", 
        temperature=0.2, 
        openai_api_key=OPENAI_API_KEY,
        model_kwargs={"response_format": {"type": "json_object"}}
    )

    system_prompt = """
    Anda adalah Senior HR Specialist Expert. Tugas Anda:
    1. Analisis JSON data kandidat yang diberikan.
    2. Bandingkan skill, pengalaman, dan pendidikan dengan Deskripsi Pekerjaan.
    3. Berikan Skor (0-100) seobjektif mungkin.
    4. Berikan output dalam format JSON dengan key "results" yang berisi array of objects.
    """

    user_prompt = f"""
    JOB DESCRIPTION:
    {job_description}

    CANDIDATES DATA:
    {candidates_str}

    RETURN JSON FORMAT:
    {{
        "results": [
            {{
                "nama": "Nama Kandidat",
                "skor": 85,
                "analisis_singkat": "Analisis relevansi skill...",
                "rekomendasi": "Interview Segera/Pertimbangkan/Tolak"
            }}
        ]
    }}
    """

    try:
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ]

        response = chat.invoke(messages)
        
        # Karena kita menggunakan response_format json_object, 
        # kita bisa langsung load content-nya
        data_output = json.loads(response.content)
        final_scores = data_output.get("results", [])
        
        print("\n🏆 HASIL AKHIR PENILAIAN AI:")
        print("=" * 60)
        # Urutkan berdasarkan skor tertinggi
        sorted_scores = sorted(final_scores, key=lambda x: x['skor'], reverse=True)
        
        for res in sorted_scores:
            print(f"Nama       : {res.get('nama')}")
            print(f"Skor       : {res.get('skor')} / 100")
            print(f"Analisis   : {res.get('analisis_singkat')}")
            print(f"Keputusan  : {res.get('rekomendasi')}")
            print("-" * 60)
            
    except Exception as e:
        print(f"❌ Terjadi kesalahan saat memproses scoring: {e}")

if __name__ == "__main__":
    
    POSISI = "Frontend Developer"
    REQ_HRD = "Dicari Frontend Developer yang jago ReactJS dan Next.js. Pengalaman minimal 3 tahun menangani high traffic. Paham TypeScript adalah nilai plus."

    top_candidates_json = find_best_candidates_raw(
        position=POSISI,
        description=REQ_HRD,
        top_k=3
    )

    print("\n🎯 Kandidat Teratas (Raw Data):")
    for idx, cand in enumerate(top_candidates_json, start=1):
        print(f"{idx}. {cand['name']} - Score Vektor: {cand['vector_score']}")


    candidates_str = ""
    for cand in top_candidates_json:
        compact_json = to_toon_format(cand) 
        candidates_str += f"- {compact_json}\n"

    if top_candidates_json:
        score_candidates_with_llm(REQ_HRD, top_candidates_json)