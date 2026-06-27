import { useState, type CSSProperties } from "react";
import type { Constantes } from "../types";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { CardIconButton, CheckIcon, PencilIcon, TrashIcon } from "./CardIconButton";

function Stat({ label, value, mono = true, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: mono ? "var(--font-mono)" : undefined,
          fontWeight: 600,
          fontSize: mono ? 18 : 14,
          marginTop: mono ? 0 : 4,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 4 }}>
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          border: "1px solid var(--border-input)",
          borderRadius: 9,
          padding: "6px 8px",
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          color: "var(--text)",
          background: "var(--bg)",
          outline: "none",
        }}
      />
    </div>
  );
}

const STATS: { key: keyof Constantes; label: string }[] = [
  { key: "ta", label: "TA" },
  { key: "fc", label: "FC" },
  { key: "spo2", label: "SpO₂" },
  { key: "o2", label: "O₂" },
  { key: "diurese", label: "Diurèse" },
];

export function ConstantesCard({
  filled,
  active,
  constantes,
  onChange,
  onClear,
}: {
  filled: boolean;
  active: boolean;
  constantes: Constantes;
  onChange: (key: keyof Constantes, value: string) => void;
  onClear: () => void;
}) {
  const [editing, setEditing] = useState(false);

  const spo2 = parseInt(constantes.spo2, 10);
  const spo2Color = spo2 < 93 ? "var(--alert)" : undefined;

  const card: CSSProperties = {
    gridColumn: "1 / -1",
    background: "var(--surface-card)",
    border: `1px solid ${active ? "var(--brand)" : "var(--border-card)"}`,
    borderRadius: 16,
    padding: "16px 18px",
    transition: "border-color .2s",
    boxShadow: "0 3px 12px rgba(74,58,38,0.04)",
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 11 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--text-muted)" }}>
          CONSTANTES DU JOUR
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {filled && !editing && <ConfidenceBadge low={false} label="capteurs 99 %" />}
          {editing ? (
            <CardIconButton title="Terminer" onClick={() => setEditing(false)}>
              <CheckIcon />
            </CardIconButton>
          ) : (
            <>
              <CardIconButton title="Écrire / modifier" onClick={() => setEditing(true)}>
                <PencilIcon />
              </CardIconButton>
              {filled && (
                <CardIconButton title="Effacer" onClick={onClear}>
                  <TrashIcon />
                </CardIconButton>
              )}
            </>
          )}
        </div>
      </div>
      {editing ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {STATS.map(({ key, label }) => (
            <StatInput key={key} label={label} value={constantes[key]} onChange={(value) => onChange(key, value)} />
          ))}
        </div>
      ) : filled ? (
        <div className="nn-flash" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          <Stat label="TA" value={constantes.ta} />
          <Stat label="FC" value={constantes.fc} />
          <Stat label="SpO₂" value={`${constantes.spo2}%`} color={spo2Color} />
          <Stat label="O₂" value={constantes.o2} mono={false} />
          <Stat label="Diurèse" value={constantes.diurese} mono={false} />
        </div>
      ) : (
        <div
          onClick={() => setEditing(true)}
          className="nn-shimmer"
          style={{ fontSize: 13, color: "var(--text-faint)", cursor: "pointer" }}
        >
          En attente de dictée… (cliquez pour écrire)
        </div>
      )}
    </div>
  );
}
