from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class Education(Base):
    __tablename__ = "educations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    institution = Column(String(150))
    degree = Column(String(50))
    field_of_study = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)

    user = relationship("User", back_populates="educations")
