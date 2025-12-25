from sqlalchemy import Column, Integer, Float, Text, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class AIScreeningResult(Base):
    __tablename__ = "ai_screening_results"

    id = Column(Integer, primary_key=True, index=True)

    application_id = Column(
        Integer,
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    fit_score = Column(Float, nullable=False)
    summary = Column(Text, nullable=False)

    recommendation_status = Column(
        Enum("PASS", "REVIEW", "REJECT", name="ai_recommendation_enum"),
        nullable=False,
    )

    confidence = Column(Float)
    reason = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="ai_result")
