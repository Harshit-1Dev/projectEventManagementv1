from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import init_db
from routes.attendees import router as attendees_router
from routes.admin import router as admin_router, seed_admin

load_dotenv()

app = FastAPI(title="GroupThink Events API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(attendees_router)
app.include_router(admin_router)


@app.on_event("startup")
def on_startup():
    init_db()
    seed_admin()
    print("🚀 GroupThink API is running!")


@app.get("/api/health")
def health():
    return {"status": "ok"}
