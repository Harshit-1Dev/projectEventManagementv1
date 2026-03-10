import { useState } from "react";
import { api } from "../utils/api";
import { CITIES, validateForm } from "../utils/helpers";

export default function Register({ onBack, onSuccess }) {
  const [form,     setForm]     = useState({ name: "", email: "", phone: "", company: "", city: "" });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async () => {
    const errs = validateForm(form);
    setErrors(errs);
    setApiError("");
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const result = await api.register({ ...form, phone: form.phone.replace(/\s/g, "") });
      onSuccess(result.attendee);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: "bold" }}>{label}</label>
      <input
        type={type}
        value={form[name]}
        placeholder={placeholder}
        onChange={e => set(name, e.target.value)}
        style={{ width: "100%", padding: "8px", fontSize: 14, boxSizing: "border-box", border: errors[name] ? "1px solid red" : "1px solid #ccc" }}
      />
      {errors[name] && <p style={{ color: "red", fontSize: 12, margin: "4px 0 0" }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 16, fontSize: 14 }}>
        ← Back
      </button>

      <h2 style={{ marginBottom: 4 }}>Register for the Event</h2>
      <p style={{ color: "#555", fontSize: 13, marginBottom: 24 }}>All fields are required.</p>

      {field("Full Name", "name", "text", "e.g. Pratik Parashar")}
      {field("Email Address", "email", "email", "e.g. pratik@company.com")}
      {field("Phone Number", "phone", "tel", "10-digit mobile")}
      {field("Company / Organisation", "company", "text", "e.g. TechSolutions Pvt Ltd")}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: "bold" }}>City</label>
        <select
          value={form.city}
          onChange={e => set("city", e.target.value)}
          style={{ width: "100%", padding: "8px", fontSize: 14, border: errors.city ? "1px solid red" : "1px solid #ccc" }}
        >
          <option value="">Select city...</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.city && <p style={{ color: "red", fontSize: 12, margin: "4px 0 0" }}>{errors.city}</p>}
      </div>

      {apiError && (
        <p style={{ color: "red", fontSize: 13, marginBottom: 12, padding: "8px", border: "1px solid red" }}>
          {apiError}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "12px", fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
