from sqlalchemy import Column, Integer, String, Enum,Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(Enum("resume", "certificate"))
    file_name = Column(String(255))
    file_url = Column(String(255))
    uploaded_at = Column(Date)
    description = Column(Text, nullable=True)

    user = relationship("User", back_populates="documents")
