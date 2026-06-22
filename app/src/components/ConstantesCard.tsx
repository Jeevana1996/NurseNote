import type { Constantes } from "../types";
import { ConfidenceBadge } from "./ConfidenceBadge";

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

export function ConstantesCard({
  filled,
  active,
  constantes,
}: {
  filled: boolean;
  active: boolean;
  constantes: Constantes;
}) {
  const spo2 = parseInt(constantes.spo2, 10);
  const spo2Color = spo2 < 93 ? "var(--alert)" : undefined;

  return (
    <div
      style={{
        gridColumn: "1 / -1",
        background: "var(--surface-card)",
        border: `1px solid ${active ? "var(--brand)" : "var(--border-card)"}`,
        borderRadius: 16,
        padding: "16px 18px",
        transition: "border-color .2s",
        boxShadow: "0 3px 12px rgba(74,58,38,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 11 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--text-muted)" }}>
          CONSTANTES DU JOUR
        </span>
        {filled && <ConfidenceBadge low={false} label="capteurs 99 %" />}
      </div>
      {filled ? (
        <div className="nn-flash" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          <Stat label="TA" value={constantes.ta} />
          <Stat label="FC" value={constantes.fc} />
          <Stat label="SpO₂" value={`${constantes.spo2}%`} color={spo2Color} />
          <Stat label="O₂" value={constantes.o2} mono={false} />
          <Stat label="Diurèse" value={constantes.diurese} mono={false} />
        </div>
      ) : (
        <div className="nn-shimmer" style={{ fontSize: 13, color: "var(--text-faint)" }}>
          En attente de dictée…
        </div>
      )}
    </div>
  );
}
