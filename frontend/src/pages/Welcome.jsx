import "../styles/pages/WelcomeAdmin.css";
import "../styles/components/shared.css";

export default function Welcome({ attendee, onHome, onAnother }) {
  if (!attendee) return null;
  return (
    <div className="page welcome-page">
      <h2 className="welcome-name">Welcome {attendee.name}</h2>
      <p className="welcome-status">You are checked in.</p>

      <table className="welcome-table">
        <tbody>
          {[["Reg ID", attendee.regId], ["Company", attendee.company], ["City", attendee.city]].map(([l, v]) => (
            <tr key={l}><td>{l}</td><td>{v}</td></tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={onAnother}>Check In Another Person</button>
      <button className="btn btn-outline" onClick={onHome}>Back to Home</button>
    </div>
  );
}
