from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session, joinedload
from app.models.job_posting import JobPosting

# model = SentenceTransformer("intfloat/multilingual-e5-small")

_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(
            "intfloat/multilingual-e5-small",
            device="cpu"
        )
    return _model

def build_job_description_text(job_description: dict) -> str:
    """
    Mengubah job profile dict menjadi teks deskripsi pekerjaan
    yang terstruktur dan kaya konteks untuk AI matching.
    """

    requirements = job_description.get("requirements", {})
    additional = job_description.get("additional_info", {})

    skills = requirements.get("skills", [])
    certifications = requirements.get("certifications", [])

    skills_text = ", ".join(skills) if skills else "Tidak ditentukan"
    certs_text = ", ".join(certifications) if certifications else "Tidak ada"

    closing_date = additional.get("closing_date") or "Tidak ditentukan"

    text = f"""
        LOWONGAN PEKERJAAN
        Posisi:
        {job_description.get("title")}
        Departemen:
        {job_description.get("department")}
        Jenis Pekerjaan:
        {job_description.get("employment_type")}
        Lokasi:
        {job_description.get("location")}
        DESKRIPSI PEKERJAAN:
        {job_description.get("description")}
        PERSYARATAN WAJIB:
        - Pendidikan minimal: {requirements.get("min_education")}
        - Pengalaman kerja minimal: {requirements.get("min_experience_years")} tahun
        - Keahlian wajib: {skills_text}
        PERSYARATAN TAMBAHAN (NILAI PLUS):
        - Sertifikasi: {certs_text}
        INFORMASI TAMBAHAN:
        - Jumlah kandidat dibutuhkan: {additional.get("required_candidates")}
        - Batas akhir lamaran: {closing_date}
        - Status lowongan: {additional.get("status")}
        """.strip()

    return text

def build_candidate_text(candidate: dict) -> str:
    """
    Mengubah data kandidat menjadi teks profil kandidat
    yang terstruktur dan kaya konteks untuk AI matching.
    """

    user = candidate.get("user", {})
    salary = candidate.get("salaryExpectation", {})

    # ===== Skills =====
    skills_list = [
        f"{s.get('name')}" for s in candidate.get("skills", [])
    ]
    skills_text = ", ".join(skills_list) if skills_list else "Tidak disebutkan"

    # ===== Work Experience =====
    experience_blocks = []
    for exp in candidate.get("workExperience", []):
        exp_text = f"- {exp.get('jobTitle')}"
        if exp.get("companyName"):
            exp_text += f" di {exp.get('companyName')}"
        if exp.get("description"):
            exp_text += f" ({exp.get('description')})"
        experience_blocks.append(exp_text)

    experience_text = (
        "\n".join(experience_blocks)
        if experience_blocks
        else "Tidak memiliki pengalaman kerja"
    )

    # ===== Education =====
    education_blocks = []
    for edu in candidate.get("education", []):
        edu_text = f"- {edu.get('degree')}"
        if edu.get("fieldOfStudy"):
            edu_text += f" {edu.get('fieldOfStudy')}"
        if edu.get("institution"):
            edu_text += f" dari {edu.get('institution')}"
        education_blocks.append(edu_text)

    education_text = (
        "\n".join(education_blocks)
        if education_blocks
        else "Tidak disebutkan"
    )

    # ===== Certifications =====
    certifications = candidate.get("certifications", [])
    cert_text = (
        ", ".join(certifications)
        if certifications
        else "Tidak ada"
    )

    # ===== Salary =====
    salary_text = "Tidak disebutkan"
    if salary.get("min") or salary.get("max"):
        salary_text = f"IDR {salary.get('min', 0):,} - {salary.get('max', 0):,}"

    text = f"""
        PROFIL KANDIDAT
        Nama:
        {user.get("name")}
        Posisi / Role:
        {candidate.get("positionApplied", "Tidak disebutkan")}
        Lokasi:
        {user.get("location", "Tidak disebutkan")}
        KEAHLIAN UTAMA:
        {skills_text}
        PENGALAMAN KERJA:
        {experience_text}
        PENDIDIKAN:
        {education_text}
        SERTIFIKASI:
        {cert_text}
        EKSPEKTASI GAJI:
        {salary_text}
        """.strip()

    return text

def build_job_profile_dict(db: Session, job_id: int) -> dict:
    """
    Mengambil JobPosting dari database dan
    mengubahnya menjadi job profile dict terstruktur untuk AI.
    """

    job = (
        db.query(JobPosting)
        .options(
            joinedload(JobPosting.skills),
            joinedload(JobPosting.certifications),
        )
        .filter(JobPosting.id == job_id)
        .first()
    )

    if not job:
        raise ValueError(f"JobPosting dengan id={job_id} tidak ditemukan")

    return {
        "id": job.id,
        "title": job.title,
        "department": job.department,
        "employment_type": job.employment_type,
        "location": job.location,
        "description": job.description,

        "requirements": {
            "min_education": job.min_education,
            "min_experience_years": job.min_experience_years,
            "skills": [s.skill_name for s in job.skills],
            "certifications": [
                c.certification_name for c in job.certifications
            ],
        },

        "additional_info": {
            "required_candidates": job.required_candidates,
            "closing_date": (
                job.closing_date.isoformat()
                if job.closing_date else None
            ),
            "status": job.status,
        },
    }


from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict

# Load model sekali saja (global)
model = SentenceTransformer("intfloat/multilingual-e5-small")


def match_candidates(
    job_text: str,
    candidates: List[Dict],
) -> List[Dict]:
    # Encode job sekali saja
    model = get_model()
    job_embedding = model.encode(
        job_text,
        normalize_embeddings=True
    )

    results = []

    for c in candidates:
        candidate_embedding = model.encode(
            c["text"],
            normalize_embeddings=True
        )

        similarity = cosine_similarity(
            [job_embedding],
            [candidate_embedding]
        )[0][0]

        results.append({
            "id": c["id"],
            "name": c.get("name"),
            "semantic_score": round(similarity * 100, 2),
            "text": c["text"],  # optional, untuk debug / LLM
        })

    return sorted(
        results,
        key=lambda x: x["semantic_score"],
        reverse=True
    )
