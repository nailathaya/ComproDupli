from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.models.job_posting import JobPosting
from app.schemas.request import JobPostingCreateRequest
from app.schemas.response import JobPostingResponse
from app.api.deps import get_current_user
from app.models.user import User
from app.models.job_skill import JobSkill
from app.models.job_certification import JobCertification

router = APIRouter(
    prefix="/job-postings",
    tags=["Job Postings"]
)

# =========================
# GET JOB DETAIL (PUBLIC)
# =========================

@router.get("/public", response_model=List[JobPostingResponse])
def get_public_jobs(db: Session = Depends(get_db)):
    jobs = (
        db.query(JobPosting)
        .options(
            joinedload(JobPosting.skills),
            joinedload(JobPosting.certifications),
        )
        .filter(JobPosting.status == "published")
        .order_by(JobPosting.created_at.desc())
        .all()
    )
    return jobs

@router.get("/{job_id}")
def get_job_detail(job_id: int, db: Session = Depends(get_db)):
    job = (
        db.query(JobPosting)
        .options(
            joinedload(JobPosting.skills),
            joinedload(JobPosting.certifications),
        )
        .filter(JobPosting.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "description": job.description,
        "min_education": job.min_education,
        "min_experience_years": job.min_experience_years,
        "department": job.department,
        "location": job.location,
        "required_candidates": job.required_candidates,
        "closing_date": job.closing_date,

        "skills": [
            s.skill_name
            for s in job.skills
        ],

        "certifications": [
            c.certification_name
            for c in job.certifications
        ],
    }

@router.get("/public/{job_id}", response_model=JobPostingResponse)
def get_public_job_by_id(
    job_id: int,
    db: Session = Depends(get_db),
):
    job = (
        db.query(JobPosting)
        .options(
            joinedload(JobPosting.skills),
            joinedload(JobPosting.certifications),
        )
        .filter(
            JobPosting.id == job_id,
            JobPosting.status == "published",
        )
        .first()
    )

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return job

# =========================
# CREATE JOB (HRD)
# =========================

@router.post("/", response_model=JobPostingResponse)
def create_job(
    payload: JobPostingCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "hrd":
        raise HTTPException(status_code=403)

    payload_data = payload.dict(exclude={"skills", "certifications"})

    job = JobPosting(
        hrd_id=current_user.id,
        **payload_data,
        status="published"
    )

    for skill in payload.skills:
        job.skills.append(JobSkill(skill_name=skill))

    for cert in payload.certifications:
        job.certifications.append(JobCertification(certification_name=cert))

    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.put("/{job_id}", response_model=JobPostingResponse)
def update_job(
    job_id: int,
    payload: JobPostingCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "hrd":
        raise HTTPException(status_code=403)

    job = db.query(JobPosting).filter(
        JobPosting.id == job_id,
        JobPosting.hrd_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # update basic fields
    for key, value in payload.dict(exclude={"skills", "certifications"}).items():
        setattr(job, key, value)

    # reset skills & certs
    job.skills.clear()
    job.certifications.clear()

    for skill in payload.skills:
        job.skills.append(JobSkill(skill_name=skill))

    for cert in payload.certifications:
        job.certifications.append(JobCertification(certification_name=cert))

    db.commit()
    db.refresh(job)
    return job

# =========================
# LIST ALL JOBS (HRD)
# =========================
@router.get("/", response_model=List[JobPostingResponse])
def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "hrd":
        raise HTTPException(status_code=403, detail="Only HRD")

    return db.query(JobPosting).filter(
        JobPosting.hrd_id == current_user.id
    ).all()

# =========================
# GET JOB DETAIL (HRD)
# =========================
@router.get("/{job_id}", response_model=JobPostingResponse)
def get_job_by_id(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "hrd":
        raise HTTPException(status_code=403, detail="Only HRD")

    job = (
        db.query(JobPosting)
        .options(
            joinedload(JobPosting.skills),
            joinedload(JobPosting.certifications),
        )
        .filter(
            JobPosting.id == job_id,
            JobPosting.hrd_id == current_user.id,
        )
        .first()
    )

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return job
