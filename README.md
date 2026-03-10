# GroupThink Event Registration System

A full-cycle event registration and check-in portal for Tech Summit 2026.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** FastAPI (Python)
- **Database:** MySQL (laptop) / SQLite (phone)
- **Hosting:** Android phone via Termux

## Phase Progress
- [x] Phase 1 — Project setup + Registration form
- [ ] Phase 2 — QR code + Email confirmation
- [ ] Phase 3 — Check-in screen
- [ ] Phase 4 — CSS polish
- [ ] Phase 5 — Admin login + Dashboard + PDF export

## How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
# Fill in your .env file
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open browser → `http://localhost:5173`
