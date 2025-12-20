from pydantic import BaseModel
from typing import List, Optional


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    location: str
    role: str
    onlineStatus: str
    avatarUrl: str


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


class CandidateListResponse(BaseModel):
    candidates: List[CandidateResponse]


class LLMQueryResponse(BaseModel):
    answer: str
