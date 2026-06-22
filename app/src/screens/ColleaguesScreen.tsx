import { useState } from "react";
import { colleagues } from "../data/colleagues";

const DATE_LABEL = "Jeudi 20 juillet 2023";

export function ColleaguesScreen() {
  const [colleagueKey, setColleagueKey] = useState(colleagues[0].key);
  const current = colleagues.find((c) => c.key === colleagueKey) ?? colleagues[0];

  return (
    <div className="nn-scroll nn-rise" style={{ flex: 1, overflowY: "auto", padding: "30px 34px" }}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 27, fontWeight: 500 }}>Transmissions des collègues</div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
        Équipe présente le {DATE_LABEL} · consultation seule (non modifiable).
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 22, alignItems: "flex-start" }}>
        <div style={{ width: 240, flex: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {colleagues.map((c) => {
            const active = c.key === colleagueKey;
            return (
              <div
                key={c.key}
                onClick={() => setColleagueKey(c.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "11px 13px",
                  borderRadius: 14,
                  cursor: "pointer",
                  border: `1px solid ${active ? "var(--brand)" : "var(--border-card)"}`,
                  background: active ? "#F1F6EE" : "var(--surface-card)",
                  transition: "all .15s",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: active ? "var(--brand)" : "var(--brand-soft-bg)",
                    color: active ? "var(--bg)" : "var(--brand-soft-text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 13,
                    flex: "none",
                  }}
                >
                  {c.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{c.entries.length} transmissions</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>
            Transmissions de <b>{current.name}</b> · {DATE_LABEL}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {current.entries.map((e, i) => (
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
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "var(--surface-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "var(--accent-soft-text-2)",
                    flex: "none",
                  }}
                >
                  {e.chambre}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{e.nom}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{e.note}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5AC9A" strokeWidth={2}>
                  <rect x="5" y="11" width="14" height="9" rx="2"></rect>
                  <path d="M8 11V8a4 4 0 0 1 8 0v3"></path>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
