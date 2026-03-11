import random
from fastapi import APIRouter, HTTPException, BackgroundTasks
from database import get_conn
from models import AttendeeCreate
from utils.email import send_confirmation_email

router = APIRouter(prefix="/api", tags=["attendees"])


def gen_reg_id() -> str:
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    num = str(random.randint(1000, 9999))
    suffix = "".join(random.choice(chars) for _ in range(3))
    return f"GT{num}{suffix}"


def row_to_attendee(row: tuple, cursor) -> dict:
    cols = [d[0] for d in cursor.description]
    raw = dict(zip(cols, row))
    return {
        "regId":        raw["reg_id"],
        "name":         raw["name"],
        "email":        raw["email"],
        "phone":        raw["phone"],
        "company":      raw["company"],
        "city":         raw["city"],
        "checkedIn":    bool(raw["checked_in"]),
        "registeredAt": str(raw["registered_at"]),
    }

@router.post("/onspot", status_code=201)
async def onspot_register(body: AttendeeCreate, background_tasks: BackgroundTasks):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM attendees WHERE email = %s", (body.email,))
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="This email is already registered!")

        reg_id = gen_reg_id()
        while True:
            cur.execute("SELECT id FROM attendees WHERE reg_id = %s", (reg_id,))
            if not cur.fetchone():
                break
            reg_id = gen_reg_id()

        cur.execute("""
            INSERT INTO attendees (reg_id, name, email, phone, company, city, checked_in)
            VALUES (%s, %s, %s, %s, %s, %s, TRUE)
        """, (reg_id, body.name, body.email, body.phone, body.company, body.city))
        conn.commit()

        cur.execute("""
            SELECT reg_id, name, email, phone, company, city, checked_in, registered_at
            FROM attendees WHERE reg_id = %s
        """, (reg_id,))
        att = row_to_attendee(cur.fetchone(), cur)
        background_tasks.add_task(send_confirmation_email, att)
        return {"success": True, "attendee": att}
    finally:
        cur.close()
        conn.close()


@router.get("/search")
def search_attendees(q: str = ""):
    if not q.strip():
        return []
    conn = get_conn()
    cur = conn.cursor()
    try:
        like = f"%{q}%"
        cur.execute("""
            SELECT reg_id, name, email, phone, company, city, checked_in, registered_at
            FROM attendees
            WHERE name LIKE %s OR phone LIKE %s
            LIMIT 20
        """, (like, like))
        rows = cur.fetchall()
        return [row_to_attendee(r, cur) for r in rows]
    finally:
        cur.close()
        conn.close()


@router.put("/checkin/{reg_id}")
def checkin_attendee(reg_id: str):
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM attendees WHERE reg_id = %s", (reg_id.upper(),))
        att = cur.fetchone()
        if not att:
            raise HTTPException(status_code=404, detail="Registration ID not found")
        if att["checked_in"]:
            raise HTTPException(status_code=409, detail=f"{att['name']} is already checked in!")
        cur.execute("UPDATE attendees SET checked_in = TRUE WHERE reg_id = %s", (reg_id.upper(),))
        conn.commit()
        return {
            "success": True,
            "attendee": {
                "regId":        att["reg_id"],
                "name":         att["name"],
                "email":        att["email"],
                "phone":        att["phone"],
                "company":      att["company"],
                "city":         att["city"],
                "checkedIn":    True,
                "registeredAt": str(att["registered_at"]),
            }
        }
    finally:
        cur.close()
        conn.close()
@router.post("/register", status_code=201)
async def register_attendee(body: AttendeeCreate, background_tasks: BackgroundTasks):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM attendees WHERE email = %s", (body.email,))
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="This email is already registered!")

        reg_id = gen_reg_id()
        while True:
            cur.execute("SELECT id FROM attendees WHERE reg_id = %s", (reg_id,))
            if not cur.fetchone():
                break
            reg_id = gen_reg_id()

        cur.execute("""
            INSERT INTO attendees (reg_id, name, email, phone, company, city)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (reg_id, body.name, body.email, body.phone, body.company, body.city))
        conn.commit()

        cur.execute("""
            SELECT reg_id, name, email, phone, company, city, checked_in, registered_at
            FROM attendees WHERE reg_id = %s
        """, (reg_id,))
        att = row_to_attendee(cur.fetchone(), cur)

        background_tasks.add_task(send_confirmation_email, att)

        return {"success": True, "message": "Registration successful!", "attendee": att}
    finally:
        cur.close()
        conn.close()