import { useState } from "react";
import "../styles/components/shared.css";
import { api } from "../utils/api";
import { CITIES, validateForm } from "../utils/helpers";

export default function Register({ onBack, onSuccess }) {
  const [form,     setForm]     = useState({ name: "", email: "", phone: "", company: "", city: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    const errs = validateForm(form);
    setErrors(errs); setApiError("");
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await api.register({ ...form, phone: form.phone.replace(/\s/g, "") });
      onSuccess(res.attendee);
    } catch (err) { setApiError(err.message); }
    finally { setLoading(false); }
  };

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={form[name]} placeholder={placeholder}
        onChange={e => set(name, e.target.value)}
        className={errors[name] ? "err" : ""} />
      {errors[name] && <p className="err-msg">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2 className="page-title">Register for the Event</h2>
      <p className="page-subtitle">All fields are required.</p>
      <div className="card">
        <Field label="Full Name"              name="name"    placeholder="e.g. Narendra Modi" />
        <Field label="Email Address"          name="email"   placeholder="e.g. Narendra@company.com" type="email" />
        <Field label="Phone Number"           name="phone"   placeholder="10-digit mobile" type="tel" />
        <Field label="Company / Organisation" name="company" placeholder="e.g. Manyata TechSolutions Pvt Ltd" />
        <div className="field">
          <label>City</label>
          <select value={form.city} onChange={e => set("city", e.target.value)} className={errors.city ? "err" : ""}>
            <option value="">Select city...</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="err-msg">{errors.city}</p>}
        </div>
        {apiError && <div className="error-box">{apiError}</div>}
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
