import "../styles/pages/Success.css";
import "../styles/components/shared.css";

export default function Success({ attendee, onHome }) {
  if (!attendee) return null;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(attendee.regId)}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div className="page">
      
      <h2 className="success-title">Registration Confirmed!</h2>
      <p className="success-welcome">Welcome, <strong>{attendee.name}</strong>!</p>

      <div className="card">
        <div className="reg-id-box">
          <p className="label">Registration ID</p>
          <p className="value">{attendee.regId}</p>
        </div>

        <div className="qr-wrap">
          <img src={qrUrl} alt="QR Code" width={200} height={200} />
        </div>
        <p className="qr-hint">Show this at the venue for check-in</p>
        <p className="email-sent">✓ Confirmation email sent to {attendee.email}</p>

        <table className="detail-table">
          <tbody>
            {[["Email", attendee.email], ["Phone", attendee.phone], ["Company", attendee.company], ["City", attendee.city]].map(([l, v]) => (
              <tr key={l}><td>{l}</td><td>{v}</td></tr>
            ))}
          </tbody>
        </table>

        <button className="btn btn-outline" onClick={onHome}>Back to Home</button>
      </div>
    </div>
  );
}
