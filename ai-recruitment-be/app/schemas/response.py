from pydantic import BaseModel
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


class ApplicationHistoryResponse(BaseModel):
    id: str
    position: str
    applied_date: str
    status: str
    stages: List[ApplicationStageResponse]


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
    status: str

    closing_date: Optional[date]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

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