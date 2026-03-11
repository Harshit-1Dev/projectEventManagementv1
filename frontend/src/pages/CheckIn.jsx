import { useState } from "react";
import "../styles/components/shared.css";
import "../styles/pages/pages.css";
import { api } from "../utils/api";
import { CITIES, validateForm } from "../utils/helpers";

function Field({ label, name, type, placeholder, form, setForm, errors }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type={type || "text"}
        value={form[name]}
        placeholder={placeholder}
        onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        className={errors[name] ? "err" : ""}
      />
      {errors[name] && <p className="err-msg">{errors[name]}</p>}
    </div>
  );
}

export default function CheckIn({ onBack, onCheckedIn, defaultTab = "qr" }) {
  const [tab,      setTab]      = useState(defaultTab);
  const [regInput, setRegInput] = useState("");
  const [regError, setRegError] = useState("");
  const [searchQ,  setSearchQ]  = useState("");
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [showSpot, setShowSpot] = useState(false);
  const [spotForm, setSpotForm] = useState({ name: "", email: "", phone: "", company: "", city: "" });
  const [spotErr,  setSpotErr]  = useState({});
  const [spotApi,  setSpotApi]  = useState("");

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
    try {
      const res = await api.onspot({ ...spotForm, phone: spotForm.phone.replace(/\s/g, "") });
      onCheckedIn(res.attendee);
    }
    catch (err) { setSpotApi(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2 className="page-title">Check-In</h2>
      <p className="page-subtitle">Verify your attendance.</p>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === "qr" ? "active" : ""}`}
          onClick={() => { setTab("qr"); setRegError(""); setRegInput(""); }}>
          📷  With QR Code
        </button>
        <button className={`tab-btn ${tab === "search" ? "active" : ""}`}
          onClick={() => { setTab("search"); setSearchQ(""); setResults([]); }}>
          🔍  Without QR Code
        </button>
      </div>

      {tab === "qr" && (
        <div className="card">
          <div className="field">
            <label>Enter Registration ID</label>
            <input
              value={regInput}
              className="reg-input"
              onChange={e => { setRegInput(e.target.value.toUpperCase()); setRegError(""); }}
              onKeyDown={e => e.key === "Enter" && handleQRCheckin()}
              placeholder="GT1043ABX"
            />
          </div>
          {regError && <div className="error-box">{regError}</div>}
          <button className="btn btn-primary" onClick={handleQRCheckin} disabled={loading}>
            {loading ? "Checking in..." : "Check In →"}
          </button>
        </div>
      )}

      {tab === "search" && (
        <div className="card">
          <div className="field">
            <label>Search by name or phone</label>
            <input
              value={searchQ}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Type to search..."
            />
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
          {searchQ && results.length === 0 && <p style={{ color: "var(--grey)", fontSize: 13 }}>No results found.</p>}
        </div>
      )}

      <hr className="divider" />

      <button className="btn btn-secondary" onClick={() => setShowSpot(!showSpot)}>
        {showSpot ? "Cancel" : "🚀  On-Spot Registration"}
      </button>

      {showSpot && (
        <div className="onspot-box">
          <p className="onspot-title">Register &amp; Check In Now</p>
          <Field label="Full Name"              name="name"    placeholder="e.g. Steve Irwin"       form={spotForm} setForm={setSpotForm} errors={spotErr} />
          <Field label="Email Address"          name="email"   placeholder="e.g. crocodileMan@company.com"   form={spotForm} setForm={setSpotForm} errors={spotErr} type="email" />
          <Field label="Phone Number"           name="phone"   placeholder="10-digit mobile"            form={spotForm} setForm={setSpotForm} errors={spotErr} type="tel" />
          <Field label="Company / Organisation" name="company" placeholder="e.g. Your Company"         form={spotForm} setForm={setSpotForm} errors={spotErr} />
          <div className="field">
            <label>City</label>
            <select
              value={spotForm.city}
              onChange={e => setSpotForm(p => ({ ...p, city: e.target.value }))}
              className={spotErr.city ? "err" : ""}
            >
              <option value="">Select city...</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {spotErr.city && <p className="err-msg">{spotErr.city}</p>}
          </div>
          {spotApi && <div className="error-box">{spotApi}</div>}
          <button className="btn btn-primary" onClick={handleOnspot} disabled={loading}>
            {loading ? "Processing..." : "Register & Check In →"}
          </button>
        </div>
      )}
    </div>
  );
}
