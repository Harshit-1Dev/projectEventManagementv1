export default function Welcome({ attendee, onHome, onAnother }) {
  if (!attendee) return null;
  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 20px", fontFamily: "sans-serif", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 12 }}>completed</div>
      <h2 style={{ fontSize: 26, marginBottom: 6 }}>Welcome {attendee.name}</h2>
      <p style={{ fontSize: 16, color: "green", marginBottom: 32 }}>You are checked in.</p>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left", marginBottom: 28 }}>
        <tbody>
          {[["Reg ID", attendee.regId], ["Company", attendee.company], ["City", attendee.city]].map(([l, v]) => (
            <tr key={l} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 4px", color: "#777", width: 80 }}>{l}</td>
              <td style={{ padding: "8px 4px", fontFamily: l === "Reg ID" ? "monospace" : "inherit" }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onAnother} style={{ width: "100%", padding: "12px", fontSize: 15, cursor: "pointer", marginBottom: 10 }}>
        Check In Another Person
      </button>
      <button onClick={onHome} style={{ width: "100%", padding: "12px", fontSize: 15, cursor: "pointer" }}>
        Back to Home
      </button>
    </div>
  );
}
