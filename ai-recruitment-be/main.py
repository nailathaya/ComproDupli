from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import job_postings
from app.api import auth, candidates,job_postings,deps,applications,ai

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
        "https://kyrie-semisacred-laverna.ngrok-free.dev",
        'http://127.0.0.1:4040',
        'https://compro-dupli.vercel.app'
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
app.include_router(job_postings.router)
# app.include_router(deps.router)
app.include_router(applications.router)
app.include_router(ai.router)

# =========================
# ROOT CHECK
# =========================
@app.get("/")
def root():
    return {"status": "running"}
