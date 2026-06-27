import { useState } from "react";
import type { Patient } from "../types";
import { StatusPill } from "../components/StatusPill";

const DATE_LABEL = "Jeudi 20 juillet 2023";

function PatientCard({ patient, onOpen }: { patient: Patient; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const done = patient.status === "fait";

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-card)",
        border: `1px solid ${hover ? "var(--brand)" : "var(--border-card)"}`,
        borderRadius: 18,
        padding: "16px 18px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "all .18s",
        boxShadow: hover ? "0 12px 28px rgba(74,58,38,0.1)" : "0 3px 12px rgba(74,58,38,0.04)",
        transform: hover ? "translateY(-2px)" : undefined,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 15,
          background: done ? "var(--brand-soft-bg)" : "var(--surface-secondary)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: "none",
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: "0.06em", color: done ? "var(--brand-soft-text)" : "var(--accent-soft-text-2)", opacity: 0.7 }}>
          CH.
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: 18,
            color: done ? "var(--brand-soft-text)" : "var(--accent-soft-text-2)",
            lineHeight: 1,
          }}
        >
          {patient.chambre}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15.5 }}>
            {patient.civilite} {patient.nom}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{patient.age} ans</span>
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            marginTop: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {patient.motif}
        </div>
      </div>
      <StatusPill status={patient.status} />
    </div>
  );
}

export function PatientsScreen({
  patients,
  onOpenPatient,
}: {
  patients: Patient[];
  onOpenPatient: (id: string) => void;
}) {
  const doneCount = patients.filter((p) => p.status === "fait").length;
  const donePct = Math.round((doneCount / patients.length) * 100);

  return (
    <div className="nn-scroll nn-rise nn-screen-pad" style={{ flex: 1, overflowY: "auto", padding: "30px 34px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 27, fontWeight: 500 }}>Patients du jour</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            {DATE_LABEL} · Transmissions pour l'équipe de l'après-midi
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--brand-soft-bg-2)",
            border: "1px solid var(--brand-soft-border)",
            borderRadius: 999,
            padding: "9px 17px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth={2} strokeLinecap="round">
            <rect x="9" y="3" width="6" height="11" rx="3"></rect>
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3"></path>
          </svg>
          <span style={{ fontSize: 13, color: "var(--brand-soft-text)", fontWeight: 500 }}>
            Touchez un patient pour dicter sa transmission
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
        <div style={{ flex: 1, height: 7, background: "var(--surface-secondary)", borderRadius: 99, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${donePct}%`,
              background: "var(--brand)",
              borderRadius: 99,
              transition: "width .4s",
            }}
          />
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-secondary)", fontWeight: 500, whiteSpace: "nowrap" }}>
          {doneCount} / {patients.length} effectuées
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 14, marginTop: 20 }}>
        {patients.map((p) => (
          <PatientCard key={p.id} patient={p} onOpen={() => onOpenPatient(p.id)} />
        ))}
      </div>
    </div>
  );
}
