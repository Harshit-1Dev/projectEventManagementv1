// AdminLogin.jsx
import { useState } from "react";
import "../styles/components/shared.css";
import "../styles/pages/pages.css";
import { api } from "../utils/api";

export default function AdminLogin({ onLogin, onBack }) {
  const [form,    setForm]    = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleLogin = async () => {
    if (!form.username || !form.password) { setError("Please enter username and password"); return; }
    setLoading(true); setError("");
    try { const res = await api.adminLogin(form); onLogin(res.username); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-inner">
        <div className="login-icon">🔐</div>
        <h2 className="login-title">Admin Login</h2>
        <p className="login-sub">Sign in to access the dashboard.</p>
        <div className="card">
          <div className="field">
            <label>Username</label>
            <input value={form.username} onChange={e => set("username", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="admin" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="••••••••" />
          </div>
          {error && <div className="error-box">{error}</div>}
          <button className="btn btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
          <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: 10 }}>← Back</button>
        </div>
      </div>
    </div>
  );
}
