# GroupThink Events — Tech Summit Event

Registration and check-in system built as a coding assignment for GroupThink.

The requirement was a kiosk-style flow: attendees register, get a QR code, and check in at the venue either by scanning the QR or having staff search their name/phone. I built that, then added an admin dashboard on top (more on that below).

React frontend · FastAPI backend · MySQL

---

## What it does

**Registration** — 5-field form (name, email, phone, company, city). Submitting generates a unique ID in the format `GT4821XKP`, shows a QR code, and fires a confirmation email with the QR embedded.

**Check-in** — two paths on the same screen. Staff can type in a Registration ID (what the QR encodes) or search by name/phone and check someone in from the results. Results show up as you type — no search button.

**On-spot registration** — walk-ins who didn't pre-register get a button on the check-in screen. Fills the same form but marks them as checked in immediately on submit.

**Admin dashboard** — login-protected view showing all registrations, checked-in count, and a filter. Export button opens a print-ready attendee sheet. *This wasn't in the original requirement — I added it. More detail at the bottom.*

---

## Features
- Event registration with 5 fields
- Auto-generated registration ID
- QR code generation
- Email confirmation
- QR-based check-in
- Manual search check-in
- On-spot registration
- Admin dashboard
----


## Stack

| Layer | What | Why |
|---|---|---|
| Frontend | React + Vite | My primary strength. Vite's HMR makes iterating fast. |
| Backend | FastAPI (Python) | Auto-validates request bodies via Pydantic. Async-native. Maps well to how I think about ASP.NET controllers. |
| Database | MySQL | Straightforward relational fit. Two tables, no joins needed. |
| Email | fastapi-mail + Gmail SMTP | Simple, free, no third-party service. Attendees receive real emails. |
| QR code | api.qrserver.com | Free public API — the QR is just an `<img>` tag with the reg ID in the URL. No library installed. |

---

## Things that were actually tricky

**Email blocking the response** — first version used `asyncio.create_task()` to send email in the background. Threw `RuntimeError: no running event loop` because FastAPI's event loop doesn't work that way outside of async context. Switched to FastAPI's built-in `BackgroundTasks` — email schedules after the response is sent, registration feels instant.

**Input losing focus on every keystroke** — had the `Field` component defined inside `Register`. React treats inline component definitions as new types on every render, so it was unmounting and remounting the input on each character typed. Moved `Field` outside the component and it works fine. Obvious in hindsight but took a bit to track down.

**CORS** — Vite picked port 5174 instead of 5173 on my machine (5173 was taken). Had `allow_origins=["http://localhost:5173"]` set explicitly. Every API call was silently blocked. Changed to `allow_origins=["*"]` for local dev and moved on.

---

## How to run

**Prerequisites:** Python 3.10+, Node 18+, MySQL running locally

```bash
# Clone
git clone https://github.com/Harshit-1Dev/projectEventManagementv1.git
cd projectEventManagementv1
```

**Backend**
```bash
cd backend
pip install -r requirements.txt
```

Create `backend/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=groupthink_events

MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_FROM=your@gmail.com
MAIL_FROM_NAME=GroupThink Events
```

> Gmail needs an App Password, not your regular password.  
> myaccount.google.com → Security → 2-Step Verification → App Passwords

```bash
uvicorn main:app --reload --port 8000
# Tables create automatically on first start
# Default admin account: admin / admin123
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173 (or 5174 if 5173 is taken)
```

---

## Screenshots

**Home**
<img width="1923" height="943" alt="image" src="https://github.com/user-attachments/assets/7f8ce8b1-3d6b-4b6b-a0aa-9174b9131a59" />

**Registration form**
<img width="1923" height="944" alt="image" src="https://github.com/user-attachments/assets/d9d0f4eb-2d99-4378-bce6-404a20e5fab6" />
<img width="1923" height="927" alt="image" src="https://github.com/user-attachments/assets/fe3b8973-9860-466c-b413-2d24cc826b67" />

**Successful registration — Reg ID + QR code**
<img width="1923" height="940" alt="image" src="https://github.com/user-attachments/assets/3d3502ea-050e-40f4-808e-d45353e0e88e" />

**Check-in with QR code**
<img width="1920" height="943" alt="image" src="https://github.com/user-attachments/assets/26d47d7d-675e-4c41-b97a-cdeddefd6e2a" />
<img width="1918" height="938" alt="image" src="https://github.com/user-attachments/assets/0f1fe8c3-6e03-4413-a114-46caf0a21134" />

**Check-in without QR — search by name or phone**
<img width="1921" height="930" alt="image" src="https://github.com/user-attachments/assets/967f12a3-a2ee-4d0e-a25b-9242e12b3d72" />
<img width="1917" height="931" alt="image" src="https://github.com/user-attachments/assets/9eaf1d5a-0235-4eae-9227-9b9b5356a080" />

**Search results**
<img width="1921" height="942" alt="image" src="https://github.com/user-attachments/assets/733e16b8-befb-4cf3-94bc-d0c28972a384" />
<img width="1911" height="933" alt="image" src="https://github.com/user-attachments/assets/49facf57-ee39-44e9-8e76-e72208febd6e" />

**Admin login + dashboard**
<img width="1918" height="936" alt="image" src="https://github.com/user-attachments/assets/e9e5ddf2-33a0-4d32-8181-e1ff202e36d6" />
<img width="1918" height="936" alt="image" src="https://github.com/user-attachments/assets/e07d71d2-37ec-4d54-ac76-ea779d1a2629" />

---

## About the admin section

The original requirement covered registration and check-in. That's Phases 1–3 in the commit history — working and committed before I touched anything admin-related.

The dashboard (Phase 5) was my addition. A real event management platform needs some way for organizers to see who showed up, filter by check-in status, and get a list out of the system. It felt incomplete without it. The core flows work entirely without it — admin is just a layer on top of the same database.

---

## Commit history

Built in phases so each commit is a usable state:

```
1a0fa20  basic structe working                          ← registration form + MySQL
388d4bc  feature: QR code generation and email         ← QR on success + Gmail SMTP  
7efab97  feature: check-in screen with QR, search...   ← full check-in flow
6bc3069  Style: Improved colour scheme with onlline palette  ← CSS overhaul
694812d  feat: admin login, dashboard and PDF export   ← admin layer
678f7b3  Fix: Issues related to the typing in text filed    ← Field component bug
```
