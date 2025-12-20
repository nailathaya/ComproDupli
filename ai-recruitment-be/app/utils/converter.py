from typing import List, Optional
from datetime import date

from app.models.user import User
from app.models.experience import Experience
from app.models.education import Education
from app.models.skill import Skill
from app.models.document import Document
from app.models.activity import Activity
from app.models.application import Application
from app.models.application_stage import ApplicationStage


# =========================
# Helper
# =========================
def _date_to_str(value: Optional[date]) -> Optional[str]:
    return value.isoformat() if value else None


# =========================
# MAIN CONVERTER
# =========================
def user_to_candidate_json(user: User) -> dict:
    """
    Convert ORM User (+ relations) -> frontend Candidate JSON
    """

    # --- Salary ---
    salary = None
    if user.salary:
        salary = {
            "min": user.salary.min_salary,
            "max": user.salary.max_salary
        }

    # --- Work Experience ---
    work_experience = [
        {
            "id": f"we{exp.id}",
            "jobTitle": exp.job_title,
            "companyName": exp.company_name,
            "startDate": _date_to_str(exp.start_date),
            "endDate": _date_to_str(exp.end_date),
            "description": exp.description
        }
        for exp in user.experiences
    ]

    # --- Education ---
    education = [
        {
            "id": f"edu{edu.id}",
            "institution": edu.institution,
            "degree": edu.degree,
            "fieldOfStudy": edu.field_of_study,
            "startDate": _date_to_str(edu.start_date),
            "endDate": _date_to_str(edu.end_date)
        }
        for edu in user.educations
    ]

    # --- Skills ---
    skills = [
        {
            "id": f"s{skill.id}",
            "name": skill.name,
            "level": skill.level
        }
        for skill in user.skills
    ]

    # --- Documents ---
    documents = [
        {
            "id": f"doc{doc.id}",
            "type": doc.type,
            "name": doc.file_name,
            "url": doc.file_url,
            "uploadedAt": _date_to_str(doc.uploaded_at)
        }
        for doc in user.documents
    ]

    # --- Activity ---
    activity = [
        {
            "time": _date_to_str(act.event_time),
            "event": act.event
        }
        for act in user.activities
    ]

    # --- Application History ---
    application_history = []
    for app in user.applications:
        application_history.append({
            "id": f"app{app.id}",
            "position": app.position,
            "applied_date": _date_to_str(app.applied_date),
            "status": app.status,
            "stages": [
                {
                    "name": stage.stage_name,
                    "status": stage.stage_status
                }
                for stage in app.stages
            ]
        })

    # --- FINAL JSON ---
    return {
        "id": f"cand{user.id}",
        "user": {
            "id": str(user.id),
            "name": user.full_name,
            "email": user.email,
            "location": user.location,
            "role": user.role,
            "onlineStatus": user.online_status,
            "avatarUrl": user.avatar_url
        },
        "positionApplied": (
            user.applications[0].position
            if user.applications else None
        ),
        "salaryExpectation": salary,
        "workExperience": work_experience,
        "education": education,
        "skills": skills,
        "documents": documents,
        "activity": activity,
        "applicationHistory": application_history
    }
