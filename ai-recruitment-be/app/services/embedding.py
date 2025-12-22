import os
import shutil
from typing import List, Dict
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from data import candidates_dummy

# Load environment variables
load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_db")
MODEL_NAME = "intfloat/multilingual-e5-small"

def pretty_print_documents(docs: List[Document]):
    print(f"\n{'='*50}")
    print(f"📄 Memproses {len(docs)} Dokumen ke Vector Store")
    print(f"{'='*50}\n")

    for i, doc in enumerate(docs, 1):
        print(f"--- [DOKUMEN {i}: {doc.metadata['name']}] ---")
        print(f"ID: {doc.metadata['candidate_id']}")
        print(f"Content Preview: {doc.page_content[:150]}...\n")

def process_candidates_to_documents(candidates: List[Dict]) -> List[Document]:
    documents = []
    
    for candidate in candidates:
        user_info = candidate.get('user', {})
        name = user_info.get('name', 'N/A')
        
        # Format Work Experience
        exp_list = []
        for exp in candidate.get('workExperience', []):
            exp_list.append(f"- {exp.get('jobTitle')} di {exp.get('companyName')} ({exp.get('description')})")
        formatted_experience = "\n".join(exp_list) if exp_list else "Tidak ada."

        # Format Education
        edu_list = []
        for edu in candidate.get('education', []):
            edu_list.append(f"- {edu.get('degree')} {edu.get('fieldOfStudy')} dari {edu.get('institution')}")
        formatted_education = "\n".join(edu_list) if edu_list else "Tidak ada."

        # Format Skills
        skills_list = [f"{s.get('name')} ({s.get('level')})" for s in candidate.get('skills', [])]
        formatted_skills = ", ".join(skills_list)

        salary = candidate.get('salaryExpectation', {"min": 0, "max": 0})

        # Struktur konten teks agar kaya akan kata kunci (Semantic Search friendly)
        text_content = f"""
Kandidat: {name}
Posisi: {candidate.get('positionApplied')}
Lokasi: {user_info.get('location')}
Keahlian: {formatted_skills}

Pengalaman Kerja:
{formatted_experience}

Pendidikan:
{formatted_education}

Ekspektasi Gaji: IDR {salary.get('min'):,} - {salary.get('max'):,}
        """.strip()
        
        # Metadata untuk filter ChromaDB
        metadata = {
            "candidate_id": candidate.get("id"),
            "name": name,
            "location": user_info.get('location'),
            "email": user_info.get("email"),
            "salary_min": salary.get("min"),
            "salary_max": salary.get("max")
        }
        
        documents.append(Document(page_content=text_content, metadata=metadata))
    
    return documents

# --- FUNGSI UTAMA ---

def generate_vector_store():
    # 1. Bersihkan database lama jika ada
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        print(f"🗑️  Database lama di '{CHROMA_PATH}' telah dihapus.")

    # 2. Konversi JSON ke Langchain Documents
    print("⚙️  Mengonversi data kandidat...")
    documents = process_candidates_to_documents(candidates_dummy)
    pretty_print_documents(documents)
    
    # 3. Inisialisasi Model Embedding
    print(f"🧠 Memuat Embedding Model: {MODEL_NAME}...")
    embedding_model = HuggingFaceEmbeddings(
        model_name=MODEL_NAME,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )

    # 4. Simpan ke ChromaDB
    print(f"💾 Menyimpan {len(documents)} vektor ke ChromaDB...")
    try:
        Chroma.from_documents(
            documents=documents,
            embedding=embedding_model,
            persist_directory=CHROMA_PATH
        )
        print(f"✅ Berhasil! Database tersimpan di: {CHROMA_PATH}")
    except Exception as e:
        print(f"❌ Terjadi kesalahan: {e}")

if __name__ == "__main__":
    generate_vector_store()