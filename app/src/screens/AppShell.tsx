import { useState } from "react";
import type { Patient } from "../types";
import { Sidebar } from "../components/Sidebar";
import { MedicationAssistantPanel } from "../components/MedicationAssistantPanel";
import { DpiModal } from "../components/DpiModal";
import { PatientsScreen } from "./PatientsScreen";
import { TransmissionScreen } from "./TransmissionScreen";
import { HistoryScreen } from "./HistoryScreen";
import { ColleaguesScreen } from "./ColleaguesScreen";
import { useDpiSend } from "../hooks/useDpiSend";

type MainView = "patients" | "history" | "colleagues";

export function AppShell({
  patients,
  onMarkSent,
  onUpdateComment,
  onLogout,
}: {
  patients: Patient[];
  onMarkSent: (id: string) => void;
  onUpdateComment: (id: string, commentaire: string) => void;
  onLogout: () => void;
}) {
  const [mainView, setMainView] = useState<MainView>("patients");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [simulateDpiError, setSimulateDpiError] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) ?? null;
  const dpi = useDpiSend(() => {
    if (selectedPatientId) onMarkSent(selectedPatientId);
  });

  const handleNavigate = (v: MainView) => {
    setSelectedPatientId(null);
    setMainView(v);
  };

  const handleBackToPatients = () => {
    setSelectedPatientId(null);
    setMainView("patients");
  };

  const handleFinishDpi = () => {
    dpi.finish();
    handleBackToPatients();
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
      <Sidebar
        view={selectedPatient ? "transmission" : mainView}
        onNavigate={handleNavigate}
        onNavigateHome={() => handleNavigate("patients")}
        onOpenAssistant={() => setAssistantOpen(true)}
        onLogout={onLogout}
        simulateDpiError={simulateDpiError}
        onToggleSimulateDpiError={() => setSimulateDpiError((s) => !s)}
      />

      <div style={{ flex: 1, height: "100%", minWidth: 0, display: "flex", flexDirection: "column" }}>
        {selectedPatient ? (
          <TransmissionScreen
            key={selectedPatient.id}
            patient={selectedPatient}
            onBack={handleBackToPatients}
            onSend={() => dpi.send(selectedPatient.chambre, simulateDpiError)}
            onUpdateComment={(commentaire) => onUpdateComment(selectedPatient.id, commentaire)}
            dpiPending={dpi.state.status !== "idle"}
          />
        ) : mainView === "patients" ? (
          <PatientsScreen patients={patients} onOpenPatient={setSelectedPatientId} />
        ) : mainView === "history" ? (
          <HistoryScreen />
        ) : (
          <ColleaguesScreen />
        )}
      </div>

      <MedicationAssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />

      <DpiModal
        state={dpi.state}
        patientName={selectedPatient ? `${selectedPatient.civilite} ${selectedPatient.nom}` : ""}
        chambre={selectedPatient?.chambre ?? ""}
        onRetry={() => selectedPatient && dpi.retry(selectedPatient.chambre)}
        onKeepDraft={dpi.keepDraft}
        onFinish={handleFinishDpi}
      />
    </div>
  );
}
