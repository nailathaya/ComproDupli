from sqlalchemy import Column, Integer, String, Enum, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100))
    level = Column(Enum("Basic", "Intermediate", "Advanced", "Expert"))

    user = relationship("User", back_populates="skills")
