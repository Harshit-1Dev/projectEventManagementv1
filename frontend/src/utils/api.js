const BASE = "http://localhost:8000/api";

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Something went wrong");
  return data;
};

export const api = {
  health:   ()     => fetch(`${BASE}/health`, { signal: AbortSignal.timeout(3000) }).then(handle),
  register: (body) => fetch(`${BASE}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(handle),
  onspot:   (body)  => fetch(`${BASE}/onspot`,   { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(handle),
  search:   (q)     => fetch(`${BASE}/search?q=${encodeURIComponent(q)}`).then(handle),
  checkin:  (regId) => fetch(`${BASE}/checkin/${regId}`, { method: "PUT" }).then(handle),
  adminLogin:     (body) => fetch(`${BASE}/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(handle),
  adminAttendees: ()     => fetch(`${BASE}/admin/attendees`).then(handle),
};