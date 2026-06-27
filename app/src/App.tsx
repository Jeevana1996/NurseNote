import { useState } from "react";
import type { Patient } from "./types";
import { patients as initialPatients } from "./data/patients";
import { LoginScreen } from "./screens/LoginScreen";
import { ServiceScreen } from "./screens/ServiceScreen";
import { AppShell } from "./screens/AppShell";

type Screen = "login" | "service" | "app";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const handleMarkSent = (id: string) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, status: "fait" } : p)));
  };

  const handleUpdateComment = (id: string, commentaire: string) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, commentaire } : p)));
  };

  if (screen === "login") {
    return <LoginScreen onLogin={() => setScreen("service")} />;
  }
  if (screen === "service") {
    return <ServiceScreen onSelect={() => setScreen("app")} />;
  }
  return (
    <AppShell
      patients={patients}
      onMarkSent={handleMarkSent}
      onUpdateComment={handleUpdateComment}
      onLogout={() => setScreen("login")}
    />
  );
}
