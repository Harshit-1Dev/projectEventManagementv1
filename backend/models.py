from pydantic import BaseModel, EmailStr, field_validator
import re


class AttendeeCreate(BaseModel):
    name:    str
    email:   EmailStr   
    phone:   str
    company: str
    city:    str

    @field_validator("name")
    @classmethod
    def name_not_too_short(cls, v):
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters")
        return v

    @field_validator("phone")
    @classmethod
    def phone_must_be_10_digits(cls, v):
        digits = re.sub(r"\s", "", v)
        if not re.fullmatch(r"\d{10}", digits):
            raise ValueError("Phone must be exactly 10 digits")
        return digits

    @field_validator("company")
    @classmethod
    def company_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Company name cannot be empty")
        return v.strip()


class AttendeeOut(BaseModel):
    regId:        str
    name:         str
    email:        str
    phone:        str
    company:      str
    city:         str
    checkedIn:    bool
    registeredAt: str
