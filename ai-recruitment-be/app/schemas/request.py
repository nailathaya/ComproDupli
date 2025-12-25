from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from pydantic import BaseModel, ConfigDict


class CandidateDetailRequest(BaseModel):
    candidate_id: int

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
    name: Optional[str] = None
    location: Optional[str] = None
    phoneNumber: Optional[str] = None

class ExperienceRequest(BaseModel):
    jobTitle: str
    companyName: str
    startDate: str
    endDate: Optional[str] = None
    description: Optional[str] = None

class EducationRequest(BaseModel):
    institution: str
    degree: str
    fieldOfStudy: Optional[str] = None
    startDate: str
    endDate: Optional[str] = None

class SkillRequest(BaseModel):
    name: str
    level: str

class SalaryRequest(BaseModel):
    min: int
    max: int

# class DocumentRequest(BaseModel):
#     type: str
#     name: str
#     url: Optional[str] = None
#     description: Optional[str] = None
#     class Config:
#         extra = "ignore"

class DocumentRequest(BaseModel):
    type: str
    file_name: str
    file_url: str

    fileSize: Optional[int] = None
    description: Optional[str] = None

    # dikirim frontend tapi tidak disimpan
    id: Optional[str] = None
    uploadedAt: Optional[str] = None

    model_config = ConfigDict(extra="ignore")

class JobPostingCreateRequest(BaseModel):
    title: str
    department: str
    employment_type: str
    location: str
    description: str
    min_education: str
    min_experience_years: int
    closing_date: Optional[date] = None
    required_candidates: int
    skills: List[str]
    certifications: List[str]

class ApplyJobRequest(BaseModel):
    job_id: int

class AIMatchRequest(BaseModel):
    job_id: int