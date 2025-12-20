from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.utils.converter import user_to_candidate_json

router = APIRouter(prefix="/candidates", tags=["Candidates"])


@router.get("/{user_id}")
def get_candidate(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    # 🔴 WAJIB ADA: cegah 500 error
    if user is None:
        raise HTTPException(
            status_code=404,
            detail=f"Candidate with id {user_id} not found"
        )

    return user_to_candidate_json(user)
