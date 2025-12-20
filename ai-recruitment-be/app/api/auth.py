from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.request import RegisterRequest
from app.schemas.response import UserResponse
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=UserResponse)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email sudah teregistrasi")

    hashed_password = pwd_context.hash(payload.password)

    user = User(
        full_name=payload.name,
        email=payload.email,
        password=hashed_password,
        role="candidate",
        location="",
        online_status="offline",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
