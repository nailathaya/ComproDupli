from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session,joinedload
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.models.experience import Experience
from app.models.education import Education
from app.models.skill import Skill
from app.models.salary_expectation import SalaryExpectation
from app.models.document import Document
from app.schemas.request import (
    CandidateUpdateRequest,
    ExperienceRequest,
    EducationRequest,
    SkillRequest,
    SalaryRequest,
    DocumentRequest,
)
from app.models.application import Application
from app.schemas.response import CandidateListItemResponse
from app.core.database import get_db
from app.api.deps import get_current_user


router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.get("/{candidate_id}")
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == candidate_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "location": user.location or "",
        "phone_number": user.phone_number or "",
        "role": user.role,
        "online_status": user.online_status,

        "salary_expectation": {
            "min": user.salary.min_salary,
            "max": user.salary.max_salary,
        } if user.salary else {
            "min": 0,
            "max": 0,
        },
        "work_experience": user.experiences or [],
        "education": user.educations or [],
        "skills": user.skills or [],
        "documents": user.documents or [],
    }


@router.put("/{candidate_id}")
def update_candidate(
    candidate_id: str,
    payload: CandidateUpdateRequest,
    db: Session = Depends(get_db),
):
    user_id = int(candidate_id.replace("cand", ""))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.name is not None:
        user.full_name = payload.name

    if payload.location is not None:
        user.location = payload.location

    if payload.phoneNumber is not None:
        user.phone_number = payload.phoneNumber

    db.commit()
    db.refresh(user)

    return {"message": "Profil berhasil diperbarui"}

# ======================
# EXPERIENCE
# ======================
@router.put("/{candidate_id}/experiences")
def save_experiences(candidate_id: int, data: list[ExperienceRequest], db: Session = Depends(get_db)):
    db.query(Experience).filter(Experience.user_id == candidate_id).delete()
    for d in data:
        db.add(Experience(
            user_id=candidate_id,
            job_title=d.jobTitle,
            company_name=d.companyName,
            start_date=d.startDate,
            end_date=d.endDate,
            description=d.description
        ))
    db.commit()
    return {"message": "Experiences saved"}


# ======================
# EDUCATION
# ======================
@router.put("/{candidate_id}/educations")
def save_educations(candidate_id: int, data: list[EducationRequest], db: Session = Depends(get_db)):
    db.query(Education).filter(Education.user_id == candidate_id).delete()
    for d in data:
        db.add(Education(
            user_id=candidate_id,
            institution=d.institution,
            degree=d.degree,
            field_of_study=d.fieldOfStudy,
            start_date=d.startDate,
            end_date=d.endDate
        ))
    db.commit()
    return {"message": "Educations saved"}


# ======================
# SKILL
# ======================
@router.put("/{candidate_id}/skills")
def save_skills(candidate_id: int, data: list[SkillRequest], db: Session = Depends(get_db)):
    db.query(Skill).filter(Skill.user_id == candidate_id).delete()
    for d in data:
        db.add(Skill(user_id=candidate_id, name=d.name, level=d.level))
    db.commit()
    return {"message": "Skills saved"}


# ======================
# SALARY
# ======================
@router.put("/{candidate_id}/salary")
def save_salary(
    candidate_id: int,
    payload: SalaryRequest,
    db: Session = Depends(get_db),
):
    salary = (
        db.query(SalaryExpectation)
        .filter(SalaryExpectation.user_id == candidate_id)
        .first()
    )

    if not salary:
        salary = SalaryExpectation(
            user_id=candidate_id,
            min_salary=payload.min,
            max_salary=payload.max,
        )
        db.add(salary)
    else:
        salary.min_salary = payload.min
        salary.max_salary = payload.max

    db.commit()
    return {"message": "Salary updated"}


# ======================
# DOCUMENT
# ======================
@router.put("/{candidate_id}/documents")
def save_documents(candidate_id: int, data: list[DocumentRequest], db: Session = Depends(get_db)):
    db.query(Document).filter(Document.user_id == candidate_id).delete()
    for d in data:
        db.add(Document(
            user_id=candidate_id,
            type=d.type,
            name=d.name,
            url=d.url,
            file_size=d.fileSize
        ))
    db.commit()
    return {"message": "Documents saved"}

@router.get("/")
def get_all_candidates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "hrd":
        raise HTTPException(status_code=403, detail="Forbidden")

    users = (
        db.query(User)
        .options(
            joinedload(User.applications)
            .joinedload(Application.stages),
            joinedload(User.applications)
            .joinedload(Application.job),
        )
        .filter(User.role == "candidate")
        .all()
    )

    result = []

    for user in users:
        applications = []
        for app in user.applications:
            applications.append({
                "id": app.id,
                "job_id": app.job_id,
                "position": app.job.title if app.job else "",
                "applied_date": app.applied_at,
                "status": app.status,
                "stages": [
                    {
                        "name": s.name,
                        "status": s.status
                    }
                    for s in app.stages
                ]
            })

        result.append({
            "id": user.id,
            "positionApplied": applications[0]["position"] if applications else None,
            "user": {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
                "location": user.location,
                "role": user.role,
                "onlineStatus": user.online_status,
                "avatarUrl": user.avatar_url,
            },
            "applicationHistory": applications
        })

    return result
