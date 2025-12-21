# from sqlalchemy import Column, Integer, String, Enum, Date, DateTime, ForeignKey, Text
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from app.core.database import Base


# class JobPosting(Base):
#     __tablename__ = "job_postings"

#     id = Column(Integer, primary_key=True, index=True)

#     # Relasi ke HRD (User dengan role recruiter/hrd)
#     hrd_id = Column(Integer, ForeignKey("users.id"), nullable=False)

#     # Informasi Dasar
#     title = Column(String(150), nullable=False)
#     department = Column(String(100), nullable=False)
#     employment_type = Column(
#         Enum(
#             "Full Time",
#             "Part Time",
#             "Contractual",
#             "Freelance",
#             "Internship",
#             name="employment_type_enum",
#         ),
#         nullable=False,
#     )
#     location = Column(String(150), nullable=False)
#     description = Column(Text, nullable=False)

#     # Persyaratan
#     min_education = Column(
#         Enum(
#             "SMA/SMK",
#             "Diploma",
#             "Sarjana (S1)",
#             "Magister (S2)",
#             "Doktor (S3)",
#             name="min_education_enum",
#         ),
#         nullable=False,
#     )
#     min_experience_years = Column(Integer, default=0)

#     # Informasi Tambahan
#     closing_date = Column(Date)
#     required_candidates = Column(Integer, default=1)

#     status = Column(
#         Enum("draft", "published", "closed", name="job_status_enum"),
#         default="draft",
#     )

#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # Relationships
#     hrd = relationship("User", backref="job_postings")
#     skills = relationship(
#         "JobSkill",
#         back_populates="job",
#         cascade="all, delete-orphan",
#     )
#     certifications = relationship(
#         "JobCertification",
#         back_populates="job",
#         cascade="all, delete-orphan",
#     )
