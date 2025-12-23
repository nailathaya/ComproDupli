# import os
# import json
# from typing import List, Dict

# from langchain_chroma import Chroma
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_openai import ChatOpenAI
# from langchain.schema import HumanMessage, SystemMessage
# from dotenv import load_dotenv
# # from data import candidates_dummy as DATA_PELAMAR

# load_dotenv()

# CHROMA_PATH = "./chroma_db"
# MODEL_NAME = "intfloat/multilingual-e5-small"
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# # def get_candidate_by_id(candidate_id: str) -> Dict:
# #     """Mencari data lengkap kandidat berdasarkan ID."""
# #     for person in DATA_PELAMAR:
# #         if str(person.get('id')) == str(candidate_id):
# #             return person
# #     return None

# def to_compact_json(data: Dict) -> str:
#     """Mengonversi dict ke JSON string untuk efisiensi token LLM."""
#     filtered_data = {k: v for k, v in data.items() if k not in ['avatarUrl', 'documents', 'activity']}
#     return json.dumps(filtered_data, separators=(',', ':'), ensure_ascii=False)

# def find_best_candidates_raw(position: str, description: str, top_k: int = 5):
#     embedding_model = HuggingFaceEmbeddings(
#         model_name=MODEL_NAME,
#         model_kwargs={"device": "cpu"},
#         encode_kwargs={"normalize_embeddings": True}
#     )
    
#     if not os.path.exists(CHROMA_PATH):
#         print(f"❌ Database tidak ditemukan di {CHROMA_PATH}. Jalankan embedding.py dulu!")
#         return []

#     db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_model)

#     print(f"🔍 [Phase 1] Semantic Search untuk: '{position}'")
    
#     optimized_query = f"query: {description}"
    
#     results = db.similarity_search_with_score(
#         query=optimized_query,
#         k=top_k
#     )

#     if not results:
#         print("⚠️ Tidak ditemukan kandidat yang cocok di database.")
#         return []

#     candidates_payload = []
#     print(f"   -> Ditemukan {len(results)} kandidat potensial. Mengambil data asli...")

#     for doc, score in results:
#         c_id = doc.metadata.get('candidate_id') 
#         original_data = get_candidate_by_id(c_id)
        
#         if original_data:
#             original_data['vector_distance_score'] = round(float(score), 4)
#             candidates_payload.append(original_data)

#     return candidates_payload

# def score_candidates_with_llm(job_description: str, candidates_data: List[Dict]):
#     if not candidates_data:
#         print("❌ Tidak ada data kandidat untuk dinilai oleh LLM.")
#         return

#     print(f"\n🤖 [Phase 2] Mengirim {len(candidates_data)} kandidat ke GPT-4o untuk Scoring...")
    
#     candidates_str = ""
#     for cand in candidates_data:
#         candidates_str += f"- {to_compact_json(cand)}\n"

#     chat = ChatOpenAI(
#         model="gpt-4o", 
#         temperature=0,
#         openai_api_key=OPENAI_API_KEY,
#         model_kwargs={"response_format": {"type": "json_object"}}
#     )

#     system_prompt = """
#     Anda adalah Senior HR Specialist. 
#     Tugas Anda adalah menilai kecocokan kandidat dengan Deskripsi Pekerjaan secara objektif.
    
#     Kriteria Penilaian:
#     1. Kecocokan Skill yang Dibutuhkan.
#     2. Kesesuaian Pengalaman Kerja.
#     3. Ekspektasi Gaji vs Kualifikasi.

#     Output WAJIB format JSON:
#     {
#         "results": [
#             {
#                 "id": "ID_KANDIDAT",
#                 "nama": "Nama Lengkap",
#                 "skor": 0-100,
#                 "analisis_singkat": "Alasan skor tersebut diberikan",
#                 "rekomendasi": "Interview / Cadangan / Tolak"
#             }
#         ]
#     }
#     """

#     user_prompt = f"JOB DESCRIPTION:\n{job_description}\n\nDATA KANDIDAT:\n{candidates_str}"

#     try:
#         messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_prompt)]
#         response = chat.invoke(messages)
#         data_output = json.loads(response.content)
        
#         print("\n🏆 HASIL AKHIR PENILAIAN AI:")
#         print("=" * 75)
#         sorted_results = sorted(data_output.get("results", []), key=lambda x: x['skor'], reverse=True)
        
#         for res in sorted_results:
#             emoji = "✅" if res.get('skor') >= 80 else "⚠️" if res.get('skor') >= 60 else "❌"
#             print(f"{emoji} [{res.get('skor')}/100] {res.get('nama')} -> {res.get('rekomendasi')}")
#             print(f"   Analisis: {res.get('analisis_singkat')}")
#             print("-" * 75)
            
#     except Exception as e:
#         print(f"❌ Terjadi kesalahan saat scoring LLM: {e}")

# # if __name__ == "__main__":
# #     DESKRIPSI_KERJA = "Mencari Backend Engineer senior yang ahli Golang, Microservices, dan Redis. Lebih disukai yang berpengalaman di Fintech."
    
# #     top_candidates = find_best_candidates_raw(
# #         position="Backend Developer",
# #         description=DESKRIPSI_KERJA,
# #         top_k=3
# #     )

# #     if top_candidates:
# #         score_candidates_with_llm(DESKRIPSI_KERJA, top_candidates)

import os
import json
from typing import List, Dict

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

CHROMA_PATH = "./chroma_db"
MODEL_NAME = "intfloat/multilingual-e5-small"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def to_compact_json(data: Dict) -> str:
    """Konversi dict ke JSON ringkas untuk prompt LLM."""
    return json.dumps(data, separators=(',', ':'), ensure_ascii=False)


def find_best_candidates_raw(description: str, top_k: int = 5) -> List[Dict]:
    """
    Phase 1: Semantic Search
    Ambil kandidat dari ChromaDB (metadata + score)
    """
    embedding_model = HuggingFaceEmbeddings(
        model_name=MODEL_NAME,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )

    if not os.path.exists(CHROMA_PATH):
        print(f"❌ Vector DB tidak ditemukan di {CHROMA_PATH}")
        return []

    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embedding_model
    )

    print("🔍 [Phase 1] Semantic Search")

    results = db.similarity_search_with_score(
        query=description,
        k=top_k
    )

    if not results:
        return []

    candidates = []
    for doc, score in results:
        payload = {
            "id": doc.metadata.get("candidate_id"),
            "nama": doc.metadata.get("name"),
            "email": doc.metadata.get("email"),
            "location": doc.metadata.get("location"),
            "salary_min": doc.metadata.get("salary_min"),
            "salary_max": doc.metadata.get("salary_max"),
            "vector_score": round(float(score), 4),
            "profile_text": doc.page_content
        }
        candidates.append(payload)

    return candidates


def score_candidates_with_llm(job_description: str, candidates_data: List[Dict]) -> List[Dict]:
    """
    Phase 2: LLM Scoring
    """
    if not candidates_data:
        return []

    print(f"🤖 [Phase 2] Scoring {len(candidates_data)} kandidat")

    candidates_str = "\n".join(
        f"- {to_compact_json(c)}" for c in candidates_data
    )

    chat = ChatOpenAI(
        model="gpt-4o",
        temperature=0,
        openai_api_key=OPENAI_API_KEY,
        model_kwargs={"response_format": {"type": "json_object"}}
    )

    system_prompt = """
    Anda adalah Senior HR Specialist. 
    Tugas Anda adalah menilai kecocokan kandidat dengan Deskripsi Pekerjaan secara objektif.
    
    Kriteria Penilaian:
    1. Kecocokan Skill yang Dibutuhkan.
    2. Kesesuaian Pengalaman Kerja.
    3. Ekspektasi Gaji vs Kualifikasi.

    Output WAJIB format JSON:
    {
        "results": [
            {
                "id": "ID_KANDIDAT",
                "nama": "Nama Lengkap",
                "skor": 0-100,
                "analisis_singkat": "Alasan skor tersebut diberikan",
                "rekomendasi": "Interview / Cadangan / Tolak"
            }
        ]
    }
    """

    user_prompt = f"""
        JOB DESCRIPTION:
        {job_description}

        DATA KANDIDAT:
        {candidates_str}
        """
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ]

    try:
        response = chat.invoke(messages)
        parsed = json.loads(response.content)
        
        return parsed.get("results", [])
    except Exception as e:
        print(f"❌ LLM Error: {e}")
        return []
