import { useState, useEffect } from "react";
import Home           from "./pages/Home";
import Register       from "./pages/Register";
import Success        from "./pages/Success";
import CheckIn        from "./pages/CheckIn";
import Welcome        from "./pages/Welcome";
import AdminLogin     from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { api }        from "./utils/api";

export default function App() {
  const [screen,    setScreen]    = useState("home");
  const [attendee,  setAttendee]  = useState(null);
  const [welcome,   setWelcome]   = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [checkinTab, setCheckinTab] = useState("qr");

  useEffect(() => {
    api.health().then(() => setApiOnline(true)).catch(() => setApiOnline(false));
  }, []);

  const goCheckin = (tab) => { setCheckinTab(tab); setScreen("checkin"); };

  return (
    <>
      {screen === "home"      && <Home           apiOnline={apiOnline} onNavigate={s => s === "checkin-qr" ? goCheckin("qr") : s === "checkin-search" ? goCheckin("search") : setScreen(s)} />}
      {screen === "register"  && <Register        onBack={() => setScreen("home")} onSuccess={a => { setAttendee(a); setScreen("success"); }} />}
      {screen === "success"   && <Success         attendee={attendee} onHome={() => setScreen("home")} />}
      {screen === "checkin"   && <CheckIn         defaultTab={checkinTab} onBack={() => setScreen("home")} onCheckedIn={a => { setWelcome(a); setScreen("welcome"); }} />}
      {screen === "welcome"   && <Welcome         attendee={welcome} onHome={() => setScreen("home")} onAnother={() => setScreen("checkin")} />}
      {screen === "admin"     && <AdminLogin      onBack={() => setScreen("home")} onLogin={u => { setAdminUser(u); setScreen("dashboard"); }} />}
      {screen === "dashboard" && <AdminDashboard  adminUser={adminUser} onLogout={() => { setAdminUser(null); setScreen("home"); }} />}
    </>
  );
}
