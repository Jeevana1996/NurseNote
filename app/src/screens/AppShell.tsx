import { useState } from "react";
import type { Patient } from "../types";
import { Sidebar } from "../components/Sidebar";
import { Logo } from "../components/Logo";
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
  onBackToServices,
}: {
  patients: Patient[];
  onMarkSent: (id: string) => void;
  onUpdateComment: (id: string, commentaire: string) => void;
  onLogout: () => void;
  onBackToServices: () => void;
}) {
  const [mainView, setMainView] = useState<MainView>("patients");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [simulateDpiError, setSimulateDpiError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) ?? null;
  const dpi = useDpiSend(() => {
    if (selectedPatientId) onMarkSent(selectedPatientId);
  });

  const handleNavigate = (v: MainView) => {
    setSelectedPatientId(null);
    setMainView(v);
    setSidebarOpen(false);
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
        onNavigateHome={() => {
          setSidebarOpen(false);
          onBackToServices();
        }}
        onOpenAssistant={() => {
          setAssistantOpen(true);
          setSidebarOpen(false);
        }}
        onLogout={onLogout}
        simulateDpiError={simulateDpiError}
        onToggleSimulateDpiError={() => setSimulateDpiError((s) => !s)}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div className="nn-sidebar-backdrop nn-sidebar-open" onClick={() => setSidebarOpen(false)} />
      )}

      <div style={{ flex: 1, height: "100%", minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div
          className="nn-mobile-topbar"
          style={{
            alignItems: "center",
            gap: 11,
            padding: "14px 18px",
            borderBottom: "1px solid var(--border-card)",
            background: "var(--surface-card)",
            flex: "none",
          }}
        >
          <div
            onClick={() => setSidebarOpen(true)}
            style={{ cursor: "pointer", flex: "none", color: "var(--text-secondary)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16"></path>
            </svg>
          </div>
          <Logo size={26} radius={8} />
          <div style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: "-0.01em" }}>NurseNotes</div>
        </div>
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
