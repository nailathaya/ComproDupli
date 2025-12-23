from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.application import Application
from app.schemas.request import AIMatchRequest

from app.services.embedding import process_candidates_to_documents,generate_vector_store
from app.services.query import find_best_candidates_raw, score_candidates_with_llm
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import os
import shutil

router = APIRouter(prefix="/ai", tags=["AI Matching"])

CHROMA_PATH = "./chroma_db"
MODEL_NAME = "intfloat/multilingual-e5-small"


@router.post("/match")
def ai_match(
    payload: AIMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "hrd":
        raise HTTPException(status_code=403, detail="Forbidden")

    # 1️⃣ Ambil SEMUA kandidat yang apply ke job ini
    applications = (
        db.query(Application)
        .options(
            joinedload(Application.user)
                .joinedload(User.skills),
            joinedload(Application.user)
                .joinedload(User.experiences),
            joinedload(Application.user)
                .joinedload(User.educations),
            joinedload(Application.user)
                .joinedload(User.salary),
        )
        .filter(Application.job_id == payload.job_id)
        .all()
    )

    if not applications:
        return []
    
    job = applications[0].job
    job_description = job.description if job and job.description else ""

    # 2️⃣ Bangun payload kandidat (FORMAT SAMA SEPERTI candidates_dummy)
    candidates_payload = []
    for app in applications:
        user = app.user
        candidates_payload.append({
            "id": user.id,
            "positionApplied": app.job.title if app.job else "",
            "user": {
                "name": user.full_name,
                "email": user.email,
                "location": user.location,
            },
            "skills": [{"name": s.name, "level": s.level} for s in user.skills],
            "workExperience": [
                {
                    "jobTitle": e.job_title,
                    "companyName": e.company_name,
                    "description": e.description,
                } for e in user.experiences
            ],
            "education": [
                {
                    "degree": edu.degree,
                    "fieldOfStudy": edu.field_of_study,
                    "institution": edu.institution,
                } for edu in user.educations
            ],
            "salaryExpectation": {
                "min": user.salary.min_salary if user.salary else 0,
                "max": user.salary.max_salary if user.salary else 0,
            }
        })
    # --- OPSIONAL: REBUILD VECTOR STORE DARI AWAL ️---
    docs = process_candidates_to_documents(candidates_payload)
    generate_vector_store(docs)

    # 4️⃣ Semantic Search
    # job_description = applications[0].job.description or ""
    top_candidates = find_best_candidates_raw(
        # position="job",
        description=job_description,
        top_k=5
    )

    if not top_candidates:
        return []

    # 5️⃣ LLM Scoring
    ai_results = score_candidates_with_llm(job_description=job_description, candidates_data=top_candidates)

    # 6️⃣ Response ke frontend
    response = []
    for r in ai_results:
        response.append({
            "candidate": {
                "id": r["id"],
                "user": {
                    "name": r["nama"],
                    "email": "",
                    "avatarUrl": ""
                }
            },
            "fitScore": r["skor"],
            "summary": r["analisis_singkat"],
        })

    return response
