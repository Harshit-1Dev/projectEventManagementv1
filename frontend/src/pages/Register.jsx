import { useState } from "react";
import "../styles/components/shared.css";
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

export default function Register({ onBack, onSuccess }) {
  const [form,     setForm]     = useState({ name: "", email: "", phone: "", company: "", city: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

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

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h2 className="page-title">Register</h2>
      <p className="page-subtitle">Fill in your details. All fields are required.</p>
      <div className="card">
        <Field label="Full Name"              name="name"    placeholder="e.g. Steve Irwin"       form={form} setForm={setForm} errors={errors} />
        <Field label="Email Address"          name="email"   placeholder="e.g. crocodileMan@company.com"   form={form} setForm={setForm} errors={errors} type="email" />
        <Field label="Phone Number"           name="phone"   placeholder="10-digit mobile"            form={form} setForm={setForm} errors={errors} type="tel" />
        <Field label="Company / Organisation" name="company" placeholder="e.g. Your Company"         form={form} setForm={setForm} errors={errors} />
        <div className="field">
          <label>City</label>
          <select
            value={form.city}
            onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
            className={errors.city ? "err" : ""}
          >
            <option value="">Select city...</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="err-msg">{errors.city}</p>}
        </div>
        {apiError && <div className="error-box">{apiError}</div>}
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Registering..." : "Register →"}
        </button>
      </div>
    </div>
  );
}
