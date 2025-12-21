from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date


class CandidateDetailRequest(BaseModel):
    candidate_id: str

class CandidateSearchRequest(BaseModel):
    position: Optional[str] = None
    skill: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None


class LLMQueryRequest(BaseModel):
    question: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class CandidateUpdateRequest(BaseModel):
    name: str
    location: str
    phoneNumber: str

# =====================
# PROFILE
# =====================
class CandidateUpdateRequest(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    phoneNumber: Optional[str] = None


# =====================
# EXPERIENCE
# =====================
class ExperienceRequest(BaseModel):
    jobTitle: str
    companyName: str
    startDate: str
    endDate: Optional[str] = None
    description: Optional[str] = None


# =====================
# EDUCATION
# =====================
class EducationRequest(BaseModel):
    institution: str
    degree: str
    fieldOfStudy: Optional[str] = None
    startDate: str
    endDate: Optional[str] = None


# =====================
# SKILL
# =====================
class SkillRequest(BaseModel):
    name: str
    level: str  # Basic | Intermediate | Advanced | Expert


# =====================
# SALARY
# =====================
class SalaryRequest(BaseModel):
    min: int
    max: int


# =====================
# DOCUMENT
# =====================
class DocumentRequest(BaseModel):
    type: str   # resume | certificate
    name: str
    url: Optional[str] = None
    fileSize: Optional[int] = None


# class JobPostingCreateRequest(BaseModel):
#     title: str
#     department: str
#     employment_type: str
#     location: str
#     description: str

#     min_education: str
#     min_experience_years: int = 0

#     closing_date: Optional[date]
#     required_candidates: int = 1
