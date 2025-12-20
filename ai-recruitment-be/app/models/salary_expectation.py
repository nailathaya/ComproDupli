from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class SalaryExpectation(Base):
    __tablename__ = "salary_expectations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    min_salary = Column(Integer)
    max_salary = Column(Integer)
    currency = Column(String(10))

