// services/api.ts
import { WorkExperience, Education, Skill, Document } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// "https://kyrie-semisacred-laverna.ngrok-free.dev";

/* =====================
   AUTH HEADER
===================== */

// function authHeader() {
//   const token = localStorage.getItem("token"); // ✅ SAMA
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "ngrok-skip-browser-warning": "true",
  };
}


/* =====================
   AUTH
===================== */

export async function loginCandidate(credentials: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();

  localStorage.setItem("token", data.access_token);

  return data;
}


export async function registerCandidate(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registrasi gagal");
  return res.json();
}

/* =====================
   CANDIDATE
===================== */
export async function getCandidates() {
  const res = await fetch(`${API_BASE_URL}/candidates/management`, {
    headers: authHeader(),
  });

  if (!res.ok) throw new Error("Failed to fetch candidates");
  return res.json();
}

export async function getCandidateById(id: number | string) {
  const res = await fetch(`${API_BASE_URL}/candidates/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to fetch candidate");
  }

  return res.json();
}

export async function updateCandidate(
  candidateId: number,
  data: {
    name: string;
    location: string;
    phoneNumber: string;
  }
) {
  const res = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Update profile failed");
  return res.json();
}

/* =====================
   SALARY
===================== */
export async function updateSalary(
  userId: number,
  salary: { min: number; max: number }
) {
  const res = await fetch(
    `${API_BASE_URL}/candidates/${userId}/salary`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(salary),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed update salary");
  }

  return res.json();
}


/* =====================
   WORK EXPERIENCE
===================== */
export async function saveExperiences(
  candidateId: number,
  experiences: WorkExperience[]
) {
  const res = await fetch(
    `${API_BASE_URL}/candidates/${candidateId}/experiences`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(experiences),
    }
  );

  if (!res.ok) throw new Error("Failed update experiences");
  return res.json();
}

/* =====================
   EDUCATION
===================== */
export async function saveEducations(
  candidateId: number,
  educations: Education[]
) {
  const res = await fetch(
    `${API_BASE_URL}/candidates/${candidateId}/educations`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(educations),
    }
  );

  if (!res.ok) throw new Error("Failed update educations");
  return res.json();
}

/* =====================
   SKILLS
===================== */
export async function saveSkills(
  candidateId: number,
  skills: Skill[]
) {
  const res = await fetch(
    `${API_BASE_URL}/candidates/${candidateId}/skills`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(skills),
    }
  );

  if (!res.ok) throw new Error("Failed update skills");
  return res.json();
}

/* =====================
   DOCUMENT METADATA
===================== */
export async function saveDocuments(
  candidateId: number,
  documents: Document[]
) {
  const payload = documents.map((d) => ({
    type: d.type,
    file_name: d.file_name,
    file_url: d.file_url,
    description: d.description ?? null,
    fileSize: d.fileSize ?? null,
  }));
  const res = await fetch(
    `${API_BASE_URL}/candidates/${candidateId}/documents`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error("Failed update documents");
  return res.json();
}

/* =====================
   JOB POSTINGS (HRD)
===================== */
export async function createJobPosting(data: {
  title: string;
  department: string;
  employment_type: string;
  location: string;
  description: string;
  min_education: string;
  min_experience_years: number;
  closing_date?: string;
  required_candidates: number;
  skills: string[];
  certifications: string[];
}) {
  
  const res = await fetch(`${API_BASE_URL}/job-postings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to create job posting");
  }

  return res.json();
}

export async function getJobPostings() {
  const res = await fetch(`${API_BASE_URL}/job-postings/public`, {
    headers: {
      ...authHeader(),
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to fetch job postings');
  }

  return res.json();
}

export async function getPublicJobs() {
  const res = await fetch(`${API_BASE_URL}/job-postings/public`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch public jobs");
  }

  return res.json();
}

export async function getMyApplications() {
  const res = await fetch(`${API_BASE_URL}/applications/me`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch application history");
  return res.json();
}

export async function applyJob(jobId: number | string) {
  const res = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(), // ✅ PAKAI SATU SUMBER
    },
    body: JSON.stringify({ job_id: jobId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Not authenticated");
  }

  return res.json();
}

export async function updateJobPosting(id: string, payload: any) {
  const res = await fetch(`${API_BASE_URL}/job-postings/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to update job');
  return res.json();
}

export async function getJobDetail(jobId: string | number) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/job-postings/${jobId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch job detail');
  }

  return res.json();
}




