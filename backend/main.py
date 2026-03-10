from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from database import init_db
from routes.attendees import router as attendees_router

load_dotenv()

app = FastAPI(
    title="GroupThink Events API",
    description="Backend for Tech Summit 2026 registration & check-in",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=[
    #     os.getenv("FRONTEND_URL", "http://localhost:5174"),
    #     "http://localhost:8000",
    # ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],
)


app.include_router(attendees_router)

@app.on_event("startup")
def on_startup():
    init_db()
    print("GroupThink API is running!")
    print("Swagger docs → http://localhost:8000/docs")


@app.get("/api/health")
def health():
    return {"status": "ok"}
