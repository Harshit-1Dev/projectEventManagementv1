export default function Home({ onNavigate, apiOnline }) {
  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>GroupThink Events</h1>
      <p style={{ color: "#555", marginBottom: 4 }}>Tech Summit 2026 · New Delhi</p>
      <p style={{ fontSize: 13, color: apiOnline ? "green" : "#999", marginBottom: 32 }}>
        ● {apiOnline ? "API Connected" : "API Offline"}
      </p>

      <button onClick={() => onNavigate("register")}
        style={{ display: "block", width: "100%", padding: "12px", marginBottom: 10, fontSize: 15, cursor: "pointer" }}>
        Register
      </button>

      <button onClick={() => onNavigate("checkin")}
        style={{ display: "block", width: "100%", padding: "12px", marginBottom: 10, fontSize: 15, cursor: "pointer" }}>
        Check-In
      </button>

      <button disabled
        style={{ display: "block", width: "100%", padding: "12px", fontSize: 15, cursor: "not-allowed", color: "#aaa" }}>
        Admin Login
      </button>
    </div>
  );
}
