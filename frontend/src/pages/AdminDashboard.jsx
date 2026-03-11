import { useState, useEffect } from "react";
import "../styles/pages/WelcomeAdmin.css";
import "../styles/components/shared.css";
import { api } from "../utils/api";

function exportPDF(attendees) {
  const rows = attendees.map(a => `
    <tr>
      <td>${a.regId}</td>
      <td>${a.name}</td>
      <td>${a.email}</td>
      <td>${a.phone}</td>
      <td>${a.company}</td>
      <td>${a.city}</td>
      <td>${a.checkedIn ? "Checked In" : "Pending"}</td>
    </tr>
  `).join("");

  const html = `
    <html>
    <head>
      <title>Attendees — GroupThink Events</title>
      <style>
        body { font-family: sans-serif; padding: 24px; }
        h2 { margin-bottom: 4px; }
        p  { color: #555; font-size: 13px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { background: #f1f5f9; padding: 8px 10px; text-align: left; border: 1px solid #e2e8f0; }
        td { padding: 8px 10px; border: 1px solid #e2e8f0; }
        tr:nth-child(even) td { background: #f8fafc; }
      </style>
    </head>
    <body>
      <h2>GroupThink Events — Tech Summit 2026</h2>
      <p>Total: ${attendees.length} · Checked In: ${attendees.filter(a => a.checkedIn).length} · Pending: ${attendees.filter(a => !a.checkedIn).length}</p>
      <table>
        <thead><tr><th>Reg ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th>City</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;

  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  w.print();
}

export default function AdminDashboard({ adminUser, onLogout }) {
  const [attendees, setAttendees] = useState([]);
  const [search,    setSearch]    = useState("");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    api.adminAttendees()
      .then(setAttendees)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? attendees.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.regId.toLowerCase().includes(search.toLowerCase())
      )
    : attendees;

  const checkedIn = attendees.filter(a => a.checkedIn).length;

  return (
    <div className="page page--wide">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-subtitle">Signed in as <strong>{adminUser}</strong></p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={onLogout}>Sign Out</button>
      </div>

      <div className="admin-stats">
        {[["Total", attendees.length], ["Checked In", checkedIn], ["Pending", attendees.length - checkedIn]].map(([l, v]) => (
          <div key={l} className="admin-stat">
            <div className="admin-stat-value">{v}</div>
            <div className="admin-stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="admin-toolbar">
        <input className="admin-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, reg ID..." />
        <button className="btn btn-primary btn-sm" onClick={() => exportPDF(filtered)}>Export PDF</button>
      </div>

      {loading ? (
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading...</p>
      ) : (
        <table className="att-table">
          <thead>
            <tr>
              <th>Reg ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Company / City</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>No attendees found</td></tr>
            )}
            {filtered.map(a => (
              <tr key={a.regId}>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.regId}</td>
                <td><p className="att-name">{a.name}</p></td>
                <td><p className="att-meta">{a.email}</p><p className="att-meta">{a.phone}</p></td>
                <td><p className="att-meta">{a.company}</p><p className="att-meta">{a.city}</p></td>
                <td>
                  <span className={`badge ${a.checkedIn ? "badge-green" : "badge-yellow"}`}>
                    {a.checkedIn ? "Checked In" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
