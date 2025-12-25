# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session, joinedload

# from app.core.database import get_db
# from app.api.deps import get_current_user
# from app.models.user import User
# from app.models.application import Application
# from app.schemas.request import AIMatchRequest

# from app.services.embedding import process_candidates_to_documents,generate_vector_store,update_candidate_embedding
# from app.services.query import find_best_candidates_raw, score_candidates_with_llm
# from langchain_chroma import Chroma
# from langchain_huggingface import HuggingFaceEmbeddings
# import os
# import shutil

# router = APIRouter(prefix="/ai", tags=["AI Matching"])

# CHROMA_PATH = "./chroma_db"
# MODEL_NAME = "intfloat/multilingual-e5-small"


# @router.post("/match")
# def ai_match(
#     payload: AIMatchRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user),
# ):
#     if current_user.role != "hrd":
#         raise HTTPException(status_code=403, detail="Forbidden")

#     # 1️⃣ Ambil SEMUA kandidat yang apply ke job ini
#     applications = (
#         db.query(Application)
#         .options(
#             joinedload(Application.user)
#                 .joinedload(User.skills),
#             joinedload(Application.user)
#                 .joinedload(User.experiences),
#             joinedload(Application.user)
#                 .joinedload(User.educations),
#             joinedload(Application.user)
#                 .joinedload(User.salary),
#         )
#         .filter(Application.job_id == payload.job_id)
#         .all()
#     )

#     if not applications:
#         return []
    
#     job = applications[0].job
#     job_description = job.description if job and job.description else ""

#     # 2️⃣ Bangun payload kandidat (FORMAT SAMA SEPERTI candidates_dummy)
#     candidates_payload = []
#     for app in applications:
#         user = app.user
#         candidates_payload.append({
#             "id": user.id,
#             "positionApplied": app.job.title if app.job else "",
#             "user": {
#                 "name": user.full_name,
#                 "email": user.email,
#                 "location": user.location,
#             },
#             "skills": [{"name": s.name, "level": s.level} for s in user.skills],
#             "workExperience": [
#                 {
#                     "jobTitle": e.job_title,
#                     "companyName": e.company_name,
#                     "description": e.description,
#                 } for e in user.experiences
#             ],
#             "education": [
#                 {
#                     "degree": edu.degree,
#                     "fieldOfStudy": edu.field_of_study,
#                     "institution": edu.institution,
#                 } for edu in user.educations
#             ],
#             "salaryExpectation": {
#                 "min": user.salary.min_salary if user.salary else 0,
#                 "max": user.salary.max_salary if user.salary else 0,
#             }
#         })
#     # --- OPSIONAL: REBUILD VECTOR STORE DARI AWAL ️---
#     docs = process_candidates_to_documents(candidates_payload)
#     # generate_vector_store(docs, reset=True)

#     # 4️⃣ Semantic Search
#     # job_description = applications[0].job.description or ""
#     top_candidates = find_best_candidates_raw(
#         # position="job",
#         description=job_description,
#         top_k=5
#     )

#     if not top_candidates:
#         return []

#     # 5️⃣ LLM Scoring
#     ai_results = score_candidates_with_llm(job_description=job_description, candidates_data=top_candidates)
#     # 6️⃣ Response ke frontend
#     response = []
#     for r in ai_results:
#         response.append({
#             "candidate": {
#                 "id": r["id"],
#                 "user": {
#                     "name": r["nama"],
#                     "email": "",
#                     "avatarUrl": ""
#                 }
#             },
#             "fitScore": r["skor"],
#             "summary": r["analisis_singkat"],
#         })

#     return response

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.application import Application
from app.schemas.request import AIMatchRequest
from app.models.ai_screening_result import AIScreeningResult

from app.services.embedding import process_candidates_to_documents,generate_vector_store,update_candidate_embedding
from app.services.query import find_best_candidates_raw, score_candidates_with_llm
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import os
import shutil

router = APIRouter(prefix="/ai", tags=["AI Matching"])

# CHROMA_PATH = "./chroma_db"
MODEL_NAME = "intfloat/multilingual-e5-small"


from app.services.matching import match_candidates
from app.services.query import score_candidates_with_llm

def map_llm_recommendation(rec: str):
    rec = rec.lower().strip()

    if "lolos" == rec:
        return "PASS"
    elif "pertimbangkan" == rec or "review" == rec:
        return "REVIEW"
    else:
        return "REJECT"
    
@router.post("/match")
def ai_match(
    payload: AIMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "hrd":
        raise HTTPException(status_code=403, detail="Forbidden")

    applications = (
        db.query(Application)
        .options(
            joinedload(Application.user).joinedload(User.skills),
            joinedload(Application.user).joinedload(User.experiences),
            joinedload(Application.user).joinedload(User.educations),
            joinedload(Application.user).joinedload(User.salary),
            joinedload(Application.user).joinedload(User.documents),
        )
        .filter(Application.job_id == payload.job_id)
        .all()
    )

    if not applications:
        # print("no applications")
        return []

    job = applications[0].job
    job_description = job.description or ""

    # ✅ HANYA kandidat yang apply ke job ini
    candidates_payload = []
    for app in applications:
        user = app.user
        certificates = [
            d for d in user.documents
            if d.type == "certificate"
        ]
        candidates_payload.append({
            "id": user.id,
            "user": {
                "name": user.full_name,
                "email": user.email,
            },
            "skills": [{"name": s.name, "level": s.level} for s in user.skills],
            "workExperience": [
                {
                    "jobTitle": e.job_title,
                    "description": e.description,
                } for e in user.experiences
            ],
            "education": [
                {
                    "degree": edu.degree,
                    "fieldOfStudy": edu.field_of_study,
                } for edu in user.educations
            ],
            "certifications": [
                {
                    "name": cert.file_name,
                    "description": cert.description or ""
                }
                for cert in certificates
            ]
        })
    
    print(candidates_payload)

    # 🔥 SEMANTIC MATCHING TANPA CHROMA
    ranked_candidates = match_candidates(job_description, candidates_payload)

    top_candidates = ranked_candidates[:5]

    # 🤖 (OPSIONAL) LLM reasoning
    ai_results = score_candidates_with_llm(
        job_description=job_description,
        candidates_data=top_candidates
    )
    # sort berdasarkan skor (descending)
    sorted_results = sorted(
        ai_results,
        key=lambda x: x["skor"],
        reverse=True
    )

    for r in sorted_results:
        # print("R",r["id"], type(r["id"]))
        # print([app.user.id for app in applications], type(applications[0].user.id))
        application = next(
            (app for app in applications if app.user.id == int(r["id"])),
            None
        )

        if not application:
            # print("application not foundAAAAAAAAAAAAAAAAA")
            continue

        existing = (
            db.query(AIScreeningResult)
            .filter(AIScreeningResult.application_id == application.id)
            .first()
        )

        if existing:
            # print("existing")
            existing.fit_score = r["skor"]
            existing.summary = r["analisis_singkat"]
            existing.recommendation_status = map_llm_recommendation(r["rekomendasi"])
            existing.confidence = r["skor"] / 100
            existing.reason = r["rekomendasi"]

        else:
            # print("else")
            db.add(
                AIScreeningResult(
                    application_id=application.id,
                    fit_score=r["skor"],
                    summary=r["analisis_singkat"],
                    recommendation_status=map_llm_recommendation(r["rekomendasi"]),
                    confidence=r["skor"] / 100,
                    reason=r["rekomendasi"],
                )
            )

    db.commit()

    return [
    {
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
        "screeningRecommendation": {
            "status": map_llm_recommendation(r["rekomendasi"]),
            "confidence": r["skor"] / 100,  # optional, untuk UI
            "reason": r["rekomendasi"]
        }
    }
    for r in sorted_results
    ]

