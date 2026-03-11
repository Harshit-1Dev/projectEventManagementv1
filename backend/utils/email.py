import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "GroupThink Events"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

fm = FastMail(conf)


def build_email_body(att: dict) -> str:
    qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={att['regId']}&bgcolor=ffffff&color=000000&margin=10"
    return f"""
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
      <h2>Registration Confirmed!</h2>
      <p>Hi {att['name']}, you are registered for <strong>Tech Summit 2026, Bengaluru</strong>.</p>

      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Registration ID</td><td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; font-size: 18px;">{att['regId']}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">{att['name']}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">{att['email']}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">{att['phone']}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company</td><td style="padding: 8px; border: 1px solid #ddd;">{att['company']}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">City</td><td style="padding: 8px; border: 1px solid #ddd;">{att['city']}</td></tr>
      </table>

      <p><strong>Your QR Code — show this at the venue for check-in:</strong></p>
      <img src="{qr_url}" alt="QR Code" width="200" height="200" style="border: 1px solid #ddd;" />

      <p style="margin-top: 24px; color: #666; font-size: 13px;">
        GroupThink Events · groupthink.in
      </p>
    </div>
    """


async def send_confirmation_email(att: dict):
    if not os.getenv("MAIL_USERNAME"):
        return
    try:
        msg = MessageSchema(
            subject=f"Registration Confirmed — {att['regId']} | Tech Summit 2026",
            recipients=[att["email"]],
            body=build_email_body(att),
            subtype=MessageType.html,
        )
        await fm.send_message(msg)
    except Exception as e:
        print(f"Email error: {e}")
