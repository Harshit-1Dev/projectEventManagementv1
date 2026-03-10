import random
import string
from fastapi import APIRouter, HTTPException
from database import get_conn
from models import AttendeeCreate

router = APIRouter(prefix="/api", tags=["attendees"])


def gen_reg_id() -> str:
  
    chars  = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    num    = str(random.randint(1000, 9999))
    suffix = "".join(random.choice(chars) for _ in range(3))
    return f"GT{num}{suffix}"


def row_to_attendee(row: tuple, cursor) -> dict:
  
    cols = [d[0] for d in cursor.description]
    raw  = dict(zip(cols, row))
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


@router.post("/register", status_code=201)
def register_attendee(body: AttendeeCreate):

    conn = get_conn()
    cur  = conn.cursor()

    try:
        cur.execute(
            "SELECT id FROM attendees WHERE email = %s",
            (body.email,)
        )
        if cur.fetchone():
            raise HTTPException(
                status_code=409,
                detail="This email is already registered!"
            )

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
        row = cur.fetchone()

        return {
            "success":  True,
            "message":  "Registration successful!",
            "attendee": row_to_attendee(row, cur),
        }

    finally:
        cur.close()
        conn.close()
