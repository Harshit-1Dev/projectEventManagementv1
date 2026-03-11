export default function Success({ attendee, onHome }) {
  if (!attendee) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(attendee.regId)}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: 4 }}>Registration Confirmed!</h2>
      <p style={{ color: "#555", marginBottom: 20 }}>Welcome, {attendee.name}!</p>

      <p style={{ fontWeight: "bold", marginBottom: 4 }}>Registration ID</p>
      <p style={{ fontSize: 26, fontFamily: "monospace", letterSpacing: 4, marginBottom: 24, padding: "12px", border: "1px solid #ccc" }}>
        {attendee.regId}
      </p>

      <p style={{ fontWeight: "bold", marginBottom: 8 }}>Your QR Code</p>
      <img
        src={qrUrl}
        alt="QR Code"
        width={200}
        height={200}
        style={{ display: "block", border: "1px solid #ccc", marginBottom: 8 }}
      />
      <p style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>
        Show this at the venue for check-in.
      </p>

      <p style={{ fontSize: 13, color: "green", marginBottom: 24 }}>
        ✓ Confirmation email sent to {attendee.email}
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 14 }}>
        <tbody>
          {[["Email", attendee.email], ["Phone", attendee.phone], ["Company", attendee.company], ["City", attendee.city]].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 4px", color: "#777", width: 80 }}>{label}</td>
              <td style={{ padding: "8px 4px" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onHome} style={{ width: "100%", padding: "12px", fontSize: 15, cursor: "pointer" }}>
        Back to Home
      </button>
    </div>
  );
}
