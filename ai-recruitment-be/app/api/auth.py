from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.core.database import get_db
from app.models.user import User
from app.schemas.request import RegisterRequest, LoginRequest
from app.core.security import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
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
        avatar_url="https://i.pravatar.cc/150",
        online_status="offline",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
    }


@router.post("/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    # =========================
    # HARDCODE HRD LOGIN
    # =========================
    if payload.email == "hrd@test.com" and payload.password == "password123":
        user = db.query(User).filter(User.email == payload.email).first()

        # kalau belum ada di DB, buat otomatis
        if not user:
            user = User(
                full_name="HRD Admin",
                email="hrd@test.com",
                role="recruiter",
                online_status="online",
                password=pwd_context.hash("password123"),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.online_status = "online"
            db.commit()

        access_token = create_access_token(
            data={"sub": str(user.id), "role": "recruiter"}
        )

        return {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
                "role": user.role,
                "onlineStatus": "online",
            }
        }

    # =========================
    # LOGIN NORMAL (CANDIDATE)
    # =========================
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Email atau password salah")

    if not pwd_context.verify(payload.password, user.password):
        raise HTTPException(status_code=400, detail="Email atau password salah")

    user.online_status = "online"
    db.commit()

    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role}
    )

    return {
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "location": user.location,
            "role": user.role,
            "onlineStatus": user.online_status,
            "avatarUrl": user.avatar_url,
        }
    }

