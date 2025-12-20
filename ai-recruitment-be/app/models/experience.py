from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_title = Column(String(100))
    company_name = Column(String(120))
    start_date = Column(Date)
    end_date = Column(Date)
    description = Column(Text)

    user = relationship("User", back_populates="experiences")
