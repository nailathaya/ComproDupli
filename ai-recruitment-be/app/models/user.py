from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from pydantic import BaseModel

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    location = Column(String(100))
    phone_number = Column(String(20) )

    role = Column(Enum("candidate", "hrd", "admin"))
    online_status = Column(Enum("online", "offline"))
    avatar_url = Column(String(255))

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    experiences = relationship("Experience", back_populates="user")
    educations = relationship("Education", back_populates="user")
    skills = relationship("Skill", back_populates="user")
    salary = relationship("SalaryExpectation", uselist=False)
    documents = relationship("Document", back_populates="user")
    applications = relationship("Application", back_populates="user")
    activities = relationship("Activity", back_populates="user")

class UserResponse(BaseModel):
    id: str
    name: str
    onlineStatus: bool
    avatarUrl: str | None

    class Config:
        from_attributes = True

