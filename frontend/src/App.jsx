import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Success from "./pages/Success";
import { api } from "./utils/api";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [attendee, setAttendee] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    api.health()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  const handleSuccess = (data) => {
    setAttendee(data);
    setScreen("success");
  };

  return (
    <>
      {screen === "home"     && <Home onNavigate={setScreen} apiOnline={apiOnline} />}
      {screen === "register" && <Register onBack={() => setScreen("home")} onSuccess={handleSuccess} />}
      {screen === "success"  && <Success attendee={attendee} onHome={() => setScreen("home")} />}
    </>
  );
}
