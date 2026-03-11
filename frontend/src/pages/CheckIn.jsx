import { useState } from "react";
import { api } from "../utils/api";
import { CITIES, validateForm } from "../utils/helpers";

export default function CheckIn({ onBack, onCheckedIn }) {
  const [tab,      setTab]      = useState("qr");
  const [regInput, setRegInput] = useState("");
  const [regError, setRegError] = useState("");
  const [searchQ,  setSearchQ]  = useState("");
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [showSpot, setShowSpot] = useState(false);
  const [spotForm, setSpotForm] = useState({ name: "", email: "", phone: "", company: "", city: "" });
  const [spotErr,  setSpotErr]  = useState({});
  const [spotApi,  setSpotApi]  = useState("");

  const setSpot = (f, v) => setSpotForm(p => ({ ...p, [f]: v }));

  const handleQRCheckin = async () => {
    const id = regInput.trim().toUpperCase();
    if (!id) { setRegError("Please enter a Registration ID"); return; }
    setLoading(true); setRegError("");
    try {
      const res = await api.checkin(id);
      onCheckedIn(res.attendee);
    } catch (err) {
      setRegError(err.message);
    } finally { setLoading(false); }
  };

  const handleSearch = async (val) => {
    setSearchQ(val);
    if (!val.trim()) { setResults([]); return; }
    try {
      setResults(await api.search(val));
    } catch (_) { setResults([]); }
  };

  const handleSearchCheckin = async (att) => {
    if (att.checkedIn) return;
    setLoading(true);
    try {
      const res = await api.checkin(att.regId);
      onCheckedIn(res.attendee);
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleOnspot = async () => {
    const errs = validateForm(spotForm);
    setSpotErr(errs); setSpotApi("");
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await api.onspot({ ...spotForm, phone: spotForm.phone.replace(/\s/g, "") });
      onCheckedIn(res.attendee);
    } catch (err) { setSpotApi(err.message); }
    finally { setLoading(false); }
  };

  const s = {
    input: { width: "100%", padding: "8px", fontSize: 14, boxSizing: "border-box", border: "1px solid #ccc" },
    label: { display: "block", marginBottom: 4, fontSize: 13, fontWeight: "bold" },
  };

  return (
    <div style={{ maxWidth: 440, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 16, fontSize: 14 }}>← Back</button>
      <h2 style={{ marginBottom: 4 }}>Event Check-In</h2>
      <p style={{ color: "#555", fontSize: 13, marginBottom: 20 }}>Select a check-in method.</p>

      <div style={{ display: "flex", marginBottom: 24, borderBottom: "2px solid #eee" }}>
        {[["qr", "With QR Code"], ["search", "Without QR Code"]].map(([t, l]) => (
          <button key={t} onClick={() => { setTab(t); setRegError(""); setRegInput(""); setSearchQ(""); setResults([]); }}
            style={{ flex: 1, padding: "10px", border: "none", borderBottom: tab === t ? "2px solid #000" : "2px solid transparent", background: "none", fontWeight: tab === t ? "bold" : "normal", cursor: "pointer", fontSize: 14, marginBottom: -2 }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "qr" && (
        <div>
          <label style={s.label}>Registration ID</label>
          <input value={regInput} onChange={e => { setRegInput(e.target.value.toUpperCase()); setRegError(""); }}
            onKeyDown={e => e.key === "Enter" && handleQRCheckin()}
            placeholder="e.g. GT1043ABX"
            style={{ ...s.input, fontFamily: "monospace", fontSize: 18, letterSpacing: 3, textAlign: "center", marginBottom: 8 }} />
          {regError && <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>{regError}</p>}
          <button onClick={handleQRCheckin} disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Checking in..." : "Check In"}
          </button>
        </div>
      )}

      {tab === "search" && (
        <div>
          <label style={s.label}>Search by name or phone</label>
          <input value={searchQ} onChange={e => handleSearch(e.target.value)}
            placeholder="Type name or phone number..."
            style={{ ...s.input, marginBottom: 12 }} />
          {results.map(att => (
            <div key={att.regId} style={{ border: "1px solid #eee", padding: "12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: "bold" }}>{att.name}</p>
                <p style={{ margin: "0 0 2px", fontSize: 13, color: "#555" }}>{att.phone} · {att.company}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#aaa", fontFamily: "monospace" }}>{att.regId}</p>
              </div>
              {att.checkedIn
                ? <span style={{ fontSize: 13, color: "green" }}>✓ Checked In</span>
                : <button onClick={() => handleSearchCheckin(att)} disabled={loading}
                    style={{ padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>
                    Check In
                  </button>
              }
            </div>
          ))}
          {searchQ && results.length === 0 && <p style={{ color: "#888", fontSize: 13 }}>No results found.</p>}
        </div>
      )}

      <hr style={{ margin: "28px 0", borderColor: "#eee" }} />

      <button onClick={() => setShowSpot(!showSpot)}
        style={{ width: "100%", padding: "12px", fontSize: 15, cursor: "pointer", background: "#f5f5f5", border: "1px solid #ddd" }}>
        {showSpot ? "Cancel" : "On-Spot Registration"}
      </button>

      {showSpot && (
        <div style={{ marginTop: 16, padding: "16px", border: "1px solid #eee" }}>
          <h3 style={{ margin: "0 0 16px" }}>Register &amp; Check In Now</h3>
          {[["Full Name", "name", "text", "e.g. Narenda Modi"],
            ["Email Address", "email", "email", "e.g. narenda@company.com"],
            ["Phone Number", "phone", "tel", "10-digit mobile"],
            ["Company / Organisation", "company", "text", "e.g. TechSolutions"]
          ].map(([label, field, type, placeholder]) => (
            <div key={field} style={{ marginBottom: 12 }}>
              <label style={s.label}>{label}</label>
              <input type={type} value={spotForm[field]} placeholder={placeholder}
                onChange={e => setSpot(field, e.target.value)}
                style={{ ...s.input, border: spotErr[field] ? "1px solid red" : "1px solid #ccc" }} />
              {spotErr[field] && <p style={{ color: "red", fontSize: 12, margin: "3px 0 0" }}>{spotErr[field]}</p>}
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <label style={s.label}>City</label>
            <select value={spotForm.city} onChange={e => setSpot("city", e.target.value)}
              style={{ ...s.input, border: spotErr.city ? "1px solid red" : "1px solid #ccc" }}>
              <option value="">Select city...</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {spotErr.city && <p style={{ color: "red", fontSize: 12, margin: "3px 0 0" }}>{spotErr.city}</p>}
          </div>
          {spotApi && <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{spotApi}</p>}
          <button onClick={handleOnspot} disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Processing..." : "Register & Check In"}
          </button>
        </div>
      )}
    </div>
  );
}
