import "../styles/global.css";
import "../styles/components/shared.css";
import "../styles/pages/Home.css";

export default function Home({ onNavigate, apiOnline }) {
  return (
    <div className="home-page">
      <div className="home-inner">
        
        <p className="home-title">Tech Summit 2026 --- Bengaluru</p>
        <h1 className="home-event">GroupThink<br />Events</h1>
        <p className="home-tagline">Registration &amp; Check-In Portal</p>

        <div className={`api-dot ${apiOnline ? "online" : "offline"}`}>
          <span className="dot" />
          {apiOnline ? "API Connected" : "API Offline"}
        </div>

        <div className="home-menu">
          <button className="btn btn-primary" onClick={() => onNavigate("register")}>
            Register for the Event
          </button>
          <div className="home-divider" />
          <button className="btn btn-secondary" onClick={() => onNavigate("checkin-qr")}>
            Check-In with QR Code
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate("checkin-search")}>
            Check-In without QR Code
          </button>
          <div className="home-divider" />
          <button className="btn btn-secondary" onClick={() => onNavigate("admin")}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
