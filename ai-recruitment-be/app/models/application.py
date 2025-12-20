from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    position = Column(String(150))
    applied_date = Column(Date)
    status = Column(String(50))

    user = relationship("User", back_populates="applications")
    stages = relationship("ApplicationStage", back_populates="application")



