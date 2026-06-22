import { useState, type CSSProperties, type ReactNode } from "react";
import { Logo } from "./Logo";
import type { View } from "../types";

const HOSPITAL = "Hôpital Bichat";
const NURSE = "Ophélie Dupont";
const NURSE_ROLE = "IDE · Équipe du matin";

function NavItem({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  const style: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "11px 13px",
    borderRadius: 13,
    cursor: "pointer",
    fontSize: 13.5,
    fontWeight: active ? 600 : 500,
    marginBottom: 3,
    color: "var(--bg)",
    background: active ? "rgba(250,246,239,0.16)" : "transparent",
    opacity: active ? 1 : 0.78,
    transition: "all .15s",
  };
  return (
    <div onClick={onClick} style={style}>
      {icon}
      {label}
    </div>
  );
}

export function Sidebar({
  view,
  onNavigate,
  onOpenAssistant,
  onLogout,
  simulateDpiError,
  onToggleSimulateDpiError,
}: {
  view: View;
  onNavigate: (v: "patients" | "history" | "colleagues") => void;
  onOpenAssistant: () => void;
  onLogout: () => void;
  simulateDpiError: boolean;
  onToggleSimulateDpiError: () => void;
}) {
  const [assistantHover, setAssistantHover] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

  return (
    <div
      style={{
        width: 236,
        height: "100%",
        background: "var(--brand)",
        color: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        padding: "22px 16px",
        flex: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px 18px" }}>
        <Logo size={34} radius={10} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>NurseNotes</div>
          <div style={{ fontSize: 10.5, opacity: 0.72 }}>{HOSPITAL}</div>
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(250,246,239,0.18)", margin: "4px 0 14px" }} />
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.6, padding: "0 8px 8px" }}>
        Cardiologie
      </div>

      <NavItem
        active={view === "patients"}
        onClick={() => onNavigate("patients")}
        label="Patients du jour"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M3 7h18M3 12h18M3 17h12"></path>
          </svg>
        }
      />
      <NavItem
        active={view === "history"}
        onClick={() => onNavigate("history")}
        label="Historique"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v5l3 2"></path>
          </svg>
        }
      />
      <NavItem
        active={view === "colleagues"}
        onClick={() => onNavigate("colleagues")}
        label="Mes collègues"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="9" cy="8" r="3"></circle>
            <path d="M3 20a6 6 0 0 1 12 0"></path>
            <path d="M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-5-5.9"></path>
          </svg>
        }
      />

      <div style={{ height: 1, background: "rgba(250,246,239,0.18)", margin: "14px 0" }} />

      <div
        onClick={onOpenAssistant}
        onMouseEnter={() => setAssistantHover(true)}
        onMouseLeave={() => setAssistantHover(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          padding: "11px 13px",
          borderRadius: 13,
          cursor: "pointer",
          background: assistantHover ? "rgba(203,124,90,0.35)" : "rgba(203,124,90,0.22)",
          border: "1px solid rgba(203,124,90,0.55)",
          fontSize: 13.5,
          fontWeight: 600,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M12 3a4 4 0 0 1 4 4c0 1.5-.8 2.3-1.5 3-.6.6-1 1.2-1 2.2"></path>
          <path d="M11 17h2"></path>
          <circle cx="12" cy="20.5" r="0.6" fill="currentColor"></circle>
        </svg>
        Assistant médicaments
      </div>

      <div style={{ flex: 1 }} />

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 8px",
          fontSize: 11,
          opacity: 0.6,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <input
          type="checkbox"
          checked={simulateDpiError}
          onChange={onToggleSimulateDpiError}
          style={{ width: 12, height: 12, accentColor: "var(--accent)" }}
        />
        Simuler une erreur DPI (démo)
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          padding: "10px 8px",
          borderRadius: 13,
          background: "rgba(250,246,239,0.12)",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 13,
            flex: "none",
          }}
        >
          OD
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {NURSE}
          </div>
          <div style={{ fontSize: 10.5, opacity: 0.72 }}>{NURSE_ROLE}</div>
        </div>
        <div
          onClick={onLogout}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          style={{ marginLeft: "auto", cursor: "pointer", opacity: logoutHover ? 1 : 0.7 }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <path d="M16 17l5-5-5-5M21 12H9"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
