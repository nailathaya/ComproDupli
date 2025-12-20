from pydantic import BaseModel, EmailStr
from typing import Optional


class CandidateDetailRequest(BaseModel):
    candidate_id: str


class CandidateSearchRequest(BaseModel):
    position: Optional[str] = None
    skill: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None


class LLMQueryRequest(BaseModel):
    question: str

from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
