from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class ApplicationStage(Base):
    __tablename__ = "application_stages"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    stage_name = Column(String(50))
    stage_status = Column(String(50))

    application = relationship("Application", back_populates="stages")