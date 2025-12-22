from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session,joinedload
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.application import Application
from app.models.application_stage import ApplicationStage
from app.schemas.request import ApplyJobRequest
from app.models.user import User

router = APIRouter(prefix="/applications", tags=["Applications"])

DEFAULT_STAGES = [
    "Screening",
    "Psikotest",
    "Interview HR",
    "Interview User",
    "Penawaran",
]

@router.post("", status_code=201)
def apply_job(
    payload: ApplyJobRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidate can apply job")

    exists = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.job_id == payload.job_id
    ).first()

    if exists:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    application = Application(
        user_id=current_user.id,
        job_id=payload.job_id,
        status="Pending"
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    DEFAULT_STAGES = [
        "Screening",
        "Psikotest",
        "Interview HR",
        "Interview User",
        "Penawaran",
    ]

    stages = [
        ApplicationStage(
            application_id=application.id,
            name=stage,
            status="Pending" 
        )
        for stage in DEFAULT_STAGES
    ]

    db.add_all(stages)
    db.commit()

    return {
        "message": "Job applied successfully",
        "application_id": application.id
    }


# ================================
# APPLICATION HISTORY (CANDIDATE)
# ================================
@router.get("/history")
def get_application_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidate")

    applications = (
        db.query(Application)
        .options(
            joinedload(Application.stages),
            joinedload(Application.job),
        )
        .filter(Application.user_id == current_user.id)
        .order_by(Application.applied_at.desc())
        .all()
    )

    result = []
    for app in applications:
        result.append({
            "id": app.id,
            "position": app.position,
            "company": app.job.department if app.job else "",
            "applied_at": app.applied_at,
            "status": app.status,
            "stages": [
                {
                    "name": stage.name,
                    "status": stage.stage_status,
                }
                for stage in app.stages
            ],
        })

    return result

@router.get("/me")
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    apps = (
        db.query(Application)
        .filter(Application.user_id == current_user.id)
        .order_by(Application.applied_at.desc())
        .all()
    )

    result = []
    for app in apps:
        result.append({
            "id": app.id,
            "position": app.job.title if app.job else "",
            # "company": app.job.company_name if app.job else "",
            "applied_at": app.applied_at,
            "status": app.status,
            "stages": [
                {
                    "name": s.name,
                    "status": s.status
                }
                for s in app.stages
            ]
        })

    return result

@router.put("/{application_id}/stage")
def update_stage(
    application_id: int,
    name: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "hrd":
        raise HTTPException(status_code=403)

    stage = db.query(ApplicationStage).filter(
        ApplicationStage.application_id == application_id,
        ApplicationStage.name == name
    ).first()

    if not stage:
        raise HTTPException(status_code=404, detail="Stage not found")

    stage.stage_status = status
    db.commit()

    return {"message": "Stage updated"}
