const BASE = "http://localhost:8000/api";

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Something went wrong");
  return data;
};

export const api = {
  health:   ()     => fetch(`${BASE}/health`, { signal: AbortSignal.timeout(3000) }).then(handle),
  register: (body) => fetch(`${BASE}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(handle),
};
