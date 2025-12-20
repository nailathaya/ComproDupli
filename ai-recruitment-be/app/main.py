# app/main.py
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from app.api import candidates, auth

app = FastAPI(title="AI Recruitment API")

app.include_router(candidates.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"status": "running"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)

@app.get("/")
def root():
    return {"status": "running"}