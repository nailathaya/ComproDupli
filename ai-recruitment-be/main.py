from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, candidates,job_postings


# =========================
# APP INIT
# =========================
app = FastAPI(title="AI Recruitment API")

# =========================
# CORS (HARUS SEBELUM ROUTER)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROUTERS
# =========================
app.include_router(auth.router)
app.include_router(candidates.router)
# app.include_router(job_postings.router)

# =========================
# ROOT CHECK
# =========================
@app.get("/")
def root():
    return {"status": "running"}
