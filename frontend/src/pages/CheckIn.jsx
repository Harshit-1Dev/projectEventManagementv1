import { useState } from "react";
import "../styles/pages/CheckIn.css";
import "../styles/components/shared.css";
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
    try { const res = await api.checkin(id); onCheckedIn(res.attendee); }
    catch (err) { setRegError(err.message); }
    finally { setLoading(false); }
  };

  const handleSearch = async (val) => {
    setSearchQ(val);
    if (!val.trim()) { setResults([]); return; }
    try { setResults(await api.search(val)); }
    catch (_) { setResults([]); }
  };

  const handleSearchCheckin = async (att) => {
    if (att.checkedIn) return;
    setLoading(true);
    try { const res = await api.checkin(att.regId); onCheckedIn(res.attendee); }
    catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleOnspot = async () => {
    const errs = validateForm(spotForm);
    setSpotErr(errs); setSpotApi("");
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try { const res = await api.onspot({ ...spotForm, phone: spotForm.phone.replace(/\s/g, "") }); onCheckedIn(res.attendee); }
    catch (err) { setSpotApi(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2 className="page-title">Event Check-In</h2>
      <p className="page-subtitle">Select a check-in method.</p>

      <div className="tab-bar">
        {[["qr", "With QR Code"], ["search", "Without QR Code"]].map(([t, l]) => (
          <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => { setTab(t); setRegError(""); setRegInput(""); setSearchQ(""); setResults([]); }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "qr" && (
        <div className="card">
          <div className="field">
            <label>Registration ID</label>
            <input value={regInput} className="reg-input"
              onChange={e => { setRegInput(e.target.value.toUpperCase()); setRegError(""); }}
              onKeyDown={e => e.key === "Enter" && handleQRCheckin()}
              placeholder="e.g. GT1043ABX" />
          </div>
          {regError && <div className="error-box">{regError}</div>}
          <button className="btn btn-primary" onClick={handleQRCheckin} disabled={loading}>
            {loading ? "Checking in..." : "Check In"}
          </button>
        </div>
      )}

      {tab === "search" && (
        <div className="card">
          <div className="field">
            <label>Search by name or phone</label>
            <input value={searchQ} onChange={e => handleSearch(e.target.value)} placeholder="Type to search..." />
          </div>
          {results.map(att => (
            <div key={att.regId} className="result-card">
              <div>
                <p className="result-name">{att.name}</p>
                <p className="result-meta">{att.phone} · {att.company}</p>
                <p className="result-reg">{att.regId}</p>
              </div>
              {att.checkedIn
                ? <span className="checked-label">✓ Checked In</span>
                : <button className="btn btn-primary btn-sm" onClick={() => handleSearchCheckin(att)} disabled={loading}>Check In</button>
              }
            </div>
          ))}
          {searchQ && results.length === 0 && <p style={{ color: "#94a3b8", fontSize: 13 }}>No results found.</p>}
        </div>
      )}

      <hr className="divider" />

      <button className="btn btn-outline" onClick={() => setShowSpot(!showSpot)}>
        {showSpot ? "Cancel" : "On-Spot Registration"}
      </button>

      {showSpot && (
        <div className="onspot-box">
          <p className="onspot-title">Register &amp; Check In Now</p>
          {[["Full Name", "name", "text", "e.g. Narendra Modi"],
            ["Email Address", "email", "email", "e.g. Narendra@company.com"],
            ["Phone Number", "phone", "tel", "10-digit mobile"],
            ["Company / Organisation", "company", "text", "e.g. Manyata TechSolutions Pvt Ltd"]
          ].map(([label, field, type, placeholder]) => (
            <div key={field} className="field">
              <label>{label}</label>
              <input type={type} value={spotForm[field]} placeholder={placeholder}
                onChange={e => setSpot(field, e.target.value)}
                className={spotErr[field] ? "err" : ""} />
              {spotErr[field] && <p className="err-msg">{spotErr[field]}</p>}
            </div>
          ))}
          <div className="field">
            <label>City</label>
            <select value={spotForm.city} onChange={e => setSpot("city", e.target.value)} className={spotErr.city ? "err" : ""}>
              <option value="">Select city...</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {spotErr.city && <p className="err-msg">{spotErr.city}</p>}
          </div>
          {spotApi && <div className="error-box">{spotApi}</div>}
          <button className="btn btn-primary" onClick={handleOnspot} disabled={loading}>
            {loading ? "Processing..." : "Register & Check In"}
          </button>
        </div>
      )}
    </div>
  );
}
