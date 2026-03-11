
import "../styles/components/shared.css";
import "../styles/pages/pages.css";

export default function Welcome({ attendee, onHome, onAnother }) {
  if (!attendee) return null;
  return (
    <div className="page welcome-page">
      <div className="welcome-icon-wrap">✓</div>
      <h2 className="welcome-name">Welcome, {attendee.name}!</h2>
      <p className="welcome-status">You are checked in ✓</p>
      <div className="card">
        <table className="welcome-table">
          <tbody>
            {[["Reg ID", attendee.regId], ["Company", attendee.company], ["City", attendee.city], ["Phone", attendee.phone]].map(([l, v]) => (
              <tr key={l}><td>{l}</td><td style={{ fontFamily: l === "Reg ID" ? "monospace" : "inherit" }}>{v}</td></tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={onAnother}>Check In Another Person</button>
        <button className="btn btn-secondary" onClick={onHome}>← Back to Home</button>
      </div>
    </div>
  );
}
