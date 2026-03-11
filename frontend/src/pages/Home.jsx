import "../styles/pages/Home.css";
import "../styles/components/shared.css";
import "../styles/global.css";

export default function Home({ onNavigate, apiOnline }) {
  return (
    <div className="page">
      <p className="home-event">TECH SUMMIT 2026 · Bengaluru</p>
      <h1 className="home-brand">GroupThink Events</h1>
      <p className="home-tagline">Event Registration &amp; Check-In Portal</p>
      <div className={`api-dot ${apiOnline ? "online" : "offline"}`}>
        <span className="dot" />
        {apiOnline ? "API Connected" : "API Offline"}
      </div>
      <div className="home-menu">
        <button className="btn btn-primary" onClick={() => onNavigate("register")}>Register</button>
        <button className="btn btn-outline" onClick={() => onNavigate("checkin")}>Check-In</button>
        <button className="btn btn-outline" onClick={() => onNavigate("admin")}>Admin Login</button>
      </div>
    </div>
  );
}
