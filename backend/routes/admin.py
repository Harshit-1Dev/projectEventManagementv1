import os
import hashlib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_conn

router = APIRouter(prefix="/api/admin", tags=["admin"])


class LoginBody(BaseModel):
    username: str
    password: str


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def seed_admin():
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM admins WHERE username = 'admin'")
        if not cur.fetchone():
            cur.execute(
                "INSERT INTO admins (username, password) VALUES (%s, %s)",
                ("admin", hash_password("admin123"))
            )
            conn.commit()
            print("✅ Default admin created — username: admin, password: admin123")
    finally:
        cur.close()
        conn.close()


@router.post("/login")
def admin_login(body: LoginBody):
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM admins WHERE username = %s", (body.username,))
        admin = cur.fetchone()
        if not admin or admin["password"] != hash_password(body.password):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        return {"success": True, "username": admin["username"]}
    finally:
        cur.close()
        conn.close()


@router.get("/attendees")
def get_all_attendees(username: str = "", password: str = ""):
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("""
            SELECT reg_id, name, email, phone, company, city, checked_in, registered_at
            FROM attendees ORDER BY registered_at DESC
        """)
        rows = cur.fetchall()
        return [{
            "regId":        r["reg_id"],
            "name":         r["name"],
            "email":        r["email"],
            "phone":        r["phone"],
            "company":      r["company"],
            "city":         r["city"],
            "checkedIn":    bool(r["checked_in"]),
            "registeredAt": str(r["registered_at"]),
        } for r in rows]
    finally:
        cur.close()
        conn.close()
