import { useState } from "react";
import { historyEntries, historyMonths } from "../data/history";

export function HistoryScreen() {
  const [view, setView] = useState<"month" | "year">("month");

  return (
    <div className="nn-scroll nn-rise nn-screen-pad" style={{ flex: 1, overflowY: "auto", padding: "30px 34px" }}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 27, fontWeight: 500 }}>Historique des transmissions</div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
        Vos transmissions, consultables jusqu'à 1 an en arrière.
      </div>

      <div
        style={{
          display: "inline-flex",
          gap: 4,
          marginTop: 18,
          background: "var(--surface-secondary)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        <div
          onClick={() => setView("month")}
          style={{
            padding: "8px 17px",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            background: view === "month" ? "var(--surface-card)" : undefined,
            color: view === "month" ? "var(--brand-soft-text)" : "var(--text-secondary)",
            boxShadow: view === "month" ? "0 2px 6px rgba(74,58,38,0.1)" : undefined,
          }}
        >
          Ce mois-ci
        </div>
        <div
          onClick={() => setView("year")}
          style={{
            padding: "8px 17px",
            borderRadius: 9,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            background: view === "year" ? "var(--surface-card)" : undefined,
            color: view === "year" ? "var(--brand-soft-text)" : "var(--text-secondary)",
            boxShadow: view === "year" ? "0 2px 6px rgba(74,58,38,0.1)" : undefined,
          }}
        >
          Sur l'année
        </div>
      </div>

      {view === "month" ? (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, maxWidth: 760 }}>
          {historyEntries.map((h, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: 15,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                boxShadow: "0 3px 12px rgba(74,58,38,0.04)",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-secondary)", width: 62, flex: "none" }}>
                {h.date}
              </div>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "var(--brand-soft-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "var(--brand-soft-text)",
                  flex: "none",
                }}
              >
                {h.chambre}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{h.nom}</div>
                <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{h.motif}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{h.shift}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 12, maxWidth: 760 }}>
          {historyMonths.map((m) => (
            <div
              key={m.label}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: 15,
                padding: 16,
                boxShadow: "0 3px 12px rgba(74,58,38,0.04)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{m.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, color: "var(--brand)", marginTop: 8 }}>
                {m.count}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>transmissions</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
