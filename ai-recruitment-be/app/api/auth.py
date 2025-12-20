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
        avatar_url="https://i.pravatar.cc/150?u=ahmad.p@example.com",
        online_status="offline",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
            "id": str(user.id),
            "name": user.full_name,
            "email": user.email,
            "location": user.location,
            "role": user.role,
            "onlineStatus": user.online_status,
            "avatarUrl": user.avatar_url,
            "password": user.password
        }

from app.schemas.request import LoginRequest

@router.post("/login", response_model=UserResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    # 1. Cari user berdasarkan email
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Email atau password salah")

    # 2. Verifikasi password
    if not pwd_context.verify(payload.password, user.password):
        raise HTTPException(status_code=400, detail="Email atau password salah")

    # 3. Update status online (opsional)
    user.online_status = "online"
    db.commit()
    db.refresh(user)

    # 4. Return response (SESUIAI response_model)
    return {
        "id": str(user.id),
        "name": user.full_name,
        "email": user.email,
        "location": user.location,
        "role": user.role,
        "onlineStatus": user.online_status,
        "avatarUrl": user.avatar_url,
    }
