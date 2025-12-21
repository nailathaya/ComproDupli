# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List

# from app.core.database import get_db
# from app.models.job_posting import JobPosting
# from app.schemas.request import JobPostingCreateRequest
# from app.schemas.response import JobPostingResponse
# from app.api.deps import get_current_user
# from app.models.user import User

# router = APIRouter(
#     prefix="/job-postings",
#     tags=["Job Postings"]
# )

# # =========================
# # CREATE JOB (HRD)
# # =========================
# @router.post("/", response_model=JobPostingResponse)
# def create_job(
#     payload: JobPostingCreateRequest,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     if current_user.role != "hrd":
#         raise HTTPException(status_code=403, detail="Only HRD can create jobs")

#     job = JobPosting(
#         hrd_id=current_user.id,
#         **payload.dict(),
#         status="published"
#     )

#     db.add(job)
#     db.commit()
#     db.refresh(job)
#     return job


# # =========================
# # LIST ALL JOBS (HRD)
# # =========================
# @router.get("/", response_model=List[JobPostingResponse])
# def list_jobs(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     if current_user.role != "hrd":
#         raise HTTPException(status_code=403, detail="Only HRD")

#     return db.query(JobPosting).filter(
#         JobPosting.hrd_id == current_user.id
#     ).all()
