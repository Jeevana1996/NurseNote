import { useState } from "react";
import { colleagues } from "../data/colleagues";
import type { ColleagueEntry } from "../types";

const DATE_LABEL = "Jeudi 20 juillet 2023";

const STATUT_LABEL: Record<ColleagueEntry["statut"], string> = {
  stable: "Stable",
  a_surveiller: "À surveiller",
  sortie_prevue: "Sortie prévue",
};

function StatutBadge({ statut }: { statut: ColleagueEntry["statut"] }) {
  const style =
    statut === "a_surveiller"
      ? { background: "var(--accent-soft-bg)", color: "var(--accent-soft-text)" }
      : statut === "sortie_prevue"
        ? { background: "var(--surface-secondary)", color: "var(--text-secondary)" }
        : { background: "var(--brand-soft-bg)", color: "var(--brand-soft-text)" };
  return (
    <span
      style={{
        ...style,
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        flex: "none",
      }}
    >
      {STATUT_LABEL[statut]}
    </span>
  );
}

export function ColleaguesScreen() {
  const [colleagueKey, setColleagueKey] = useState(colleagues[0].key);
  const [expanded, setExpanded] = useState<number | null>(null);
  const current = colleagues.find((c) => c.key === colleagueKey) ?? colleagues[0];

  const handleSelectColleague = (key: string) => {
    setColleagueKey(key);
    setExpanded(null);
  };

  return (
    <div className="nn-scroll nn-rise nn-screen-pad" style={{ flex: 1, overflowY: "auto", padding: "30px 34px" }}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 27, fontWeight: 500 }}>Transmissions des collègues</div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
        Équipe présente le {DATE_LABEL} · consultation seule (non modifiable).
      </div>

      <div className="nn-colleagues-row" style={{ display: "flex", gap: 20, marginTop: 22, alignItems: "flex-start" }}>
        <div className="nn-colleagues-list" style={{ width: 240, flex: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {colleagues.map((c) => {
            const active = c.key === colleagueKey;
            return (
              <div
                key={c.key}
                onClick={() => handleSelectColleague(c.key)}
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
            {current.entries.map((e, i) => {
              const isOpen = expanded === i;
              return (
                <div
                  key={i}
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    background: "var(--surface-card)",
                    border: `1px solid ${isOpen ? "var(--brand)" : "var(--border-card)"}`,
                    borderRadius: 15,
                    padding: "14px 18px",
                    cursor: "pointer",
                    transition: "border-color .15s",
                    boxShadow: "0 3px 12px rgba(74,58,38,0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 14.5 }}>{e.nom}</span>
                        <StatutBadge statut={e.statut} />
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>{e.note}</div>
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)", flex: "none" }}>{e.heure}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#B5AC9A"
                      strokeWidth={2}
                      style={{ flex: "none", transform: isOpen ? "rotate(180deg)" : undefined, transition: "transform .15s" }}
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </div>
                  {isOpen && (
                    <div
                      style={{
                        marginTop: 13,
                        paddingTop: 13,
                        borderTop: "1px solid var(--border-card)",
                        fontSize: 13.5,
                        lineHeight: 1.65,
                        color: "var(--text)",
                      }}
                    >
                      {e.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
