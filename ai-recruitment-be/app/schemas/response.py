from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime, date


class UserResponse(BaseModel):
    id: int                     
    name: str
    email: str
    location: Optional[str]
    role: str
    onlineStatus: Optional[str]
    avatarUrl: Optional[str]

class SalaryExpectationResponse(BaseModel):
    min: int
    max: int


class WorkExperienceResponse(BaseModel):
    id: str
    jobTitle: str
    companyName: str
    startDate: str
    endDate: Optional[str]
    description: str


class EducationResponse(BaseModel):
    id: str
    institution: str
    degree: str
    fieldOfStudy: str
    startDate: str
    endDate: str


class SkillResponse(BaseModel):
    id: str
    name: str
    level: str


class DocumentResponse(BaseModel):
    id: str
    type: str
    name: str
    url: str
    uploadedAt: str


class ActivityResponse(BaseModel):
    time: str
    event: str


class ApplicationStageResponse(BaseModel):
    name: str
    status: str

class AIScreeningResponse(BaseModel):
    status: str
    confidence: Optional[float]
    reason: Optional[str]

class ApplicationHistoryResponse(BaseModel):
    id: int
    job_id: int
    position: str
    stages: List[ApplicationStageResponse]
    aiScreening: Optional[AIScreeningResponse]



class CandidateResponse(BaseModel):
    id: str
    user: UserResponse
    positionApplied: Optional[str]
    salaryExpectation: Optional[SalaryExpectationResponse]
    workExperience: List[WorkExperienceResponse]
    education: List[EducationResponse]
    skills: List[SkillResponse]
    documents: List[DocumentResponse]
    activity: List[ActivityResponse]
    applicationHistory: List[ApplicationHistoryResponse]

class LLMQueryResponse(BaseModel):
    answer: str

class JobPostingResponse(BaseModel):
    id: int
    title: str
    department: str
    employment_type: str
    location: str
    description: str
    min_education: str
    min_experience_years: int
    closing_date: Optional[date]
    required_candidates: int
    status: str

    skills: List[str]
    certifications: List[str]

    @validator("skills", pre=True)
    def map_skills(cls, v):
        """
        Convert:
        [JobSkill(skill_name="Python"), JobSkill(skill_name="FastAPI")]
        → ["Python", "FastAPI"]
        """
        if not v:
            return []
        return [s.skill_name for s in v]

    @validator("certifications", pre=True)
    def map_certs(cls, v):
        """
        Convert:
        [JobCertification(certification_name="AWS")]
        → ["AWS"]
        """
        if not v:
            return []
        return [c.certification_name for c in v]

    class Config:
        orm_mode = True

class CandidateListItemResponse(BaseModel):
    id: int
    job_id: Optional[int]
    positionApplied: Optional[str]
    user: UserResponse

class AIMatchCandidateUser(BaseModel):
    id: int
    name: str
    email: str
    avatarUrl: Optional[str]

class AIMatchCandidate(BaseModel):
    id: int
    user: AIMatchCandidateUser

class AIMatchResponse(BaseModel):
    candidate: AIMatchCandidate
    fitScore: int
    summary: str
    matchingAspects: List[str]
    aiReason: str

class CandidateUserResponse(BaseModel):
    name: str
    email: str

class CandidateManagementResponse(BaseModel):
    id: int
    user: CandidateUserResponse
    positionApplied: Optional[str]
    applicationHistory: List[ApplicationHistoryResponse]
