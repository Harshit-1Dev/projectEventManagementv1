import "../styles/components/shared.css";
import "../styles/pages/pages.css";

export default function Success({ attendee, onHome }) {
  if (!attendee) return null;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(attendee.regId)}&bgcolor=ffffff&color=062F4F&margin=10`;

  return (
    <div className="page">
      <div className="success-icon">🎉</div>
      <h2 className="success-title">You're Registered!</h2>
      <p className="success-welcome">Welcome, <strong>{attendee.name}</strong></p>

      <div className="card">
        <div className="reg-id-box">
          <p className="label">Registration ID</p>
          <p className="value">{attendee.regId}</p>
        </div>

        <div className="qr-wrap">
          <img src={qrUrl} alt="QR Code" width={200} height={200} />
        </div>
        <p className="qr-hint">Show this QR at the venue for instant check-in</p>
        <p className="email-sent">✓ Confirmation email sent to {attendee.email}</p>

        <table className="detail-table">
          <tbody>
            {[["Phone", attendee.phone], ["Company", attendee.company], ["City", attendee.city]].map(([l, v]) => (
              <tr key={l}><td>{l}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <button className="btn btn-secondary" onClick={onHome}>← Back to Home</button>
      </div>
    </div>
  );
}
