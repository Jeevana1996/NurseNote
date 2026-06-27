import { useState } from "react";
import { drugs } from "../data/drugs";

export function MedicationAssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [drugKey, setDrugKey] = useState(drugs[0].key);
  const [query, setQuery] = useState("");
  const [closeHover, setCloseHover] = useState(false);

  if (!open) return null;

  const drug = drugs.find((d) => d.key === drugKey) ?? drugs[0];

  const submitQuery = () => {
    const q = query.toLowerCase().trim();
    if (!q) return;
    const hit = drugs.find((d) => d.key.includes(q) || d.name.toLowerCase().includes(q));
    if (hit) setDrugKey(hit.key);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(43,42,38,0.35)", zIndex: 40 }}
      />
      <div
        className="nn-slide"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          maxWidth: 400,
          height: "100%",
          background: "var(--surface-card)",
          zIndex: 41,
          boxShadow: "-24px 0 60px rgba(43,42,38,0.18)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "20px 22px", borderBottom: "1px solid var(--border-card)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "var(--brand)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth={2} strokeLinecap="round">
                  <path d="M12 3a4 4 0 0 1 4 4c0 1.5-.8 2.3-1.5 3-.6.6-1 1.2-1 2.2M11 17h2"></path>
                  <circle cx="12" cy="20.5" r="0.7" fill="var(--bg)"></circle>
                </svg>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 18 }}>Assistant médicaments</div>
            </div>
            <div
              onClick={onClose}
              onMouseEnter={() => setCloseHover(true)}
              onMouseLeave={() => setCloseHover(false)}
              style={{ cursor: "pointer", color: closeHover ? "var(--text)" : "var(--text-muted)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 14,
              border: "1px solid var(--border-input)",
              borderRadius: 12,
              padding: "0 12px",
              height: 44,
              background: "var(--bg)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth={2} strokeLinecap="round">
              <rect x="9" y="3" width="6" height="9" rx="3"></rect>
              <path d="M6 10a6 6 0 0 0 12 0M12 16v3"></path>
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitQuery()}
              placeholder="Dictez ou tapez un médicament…"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontFamily: "inherit",
                fontSize: 14,
                background: "transparent",
                color: "var(--text)",
              }}
            />
            <button
              onClick={submitQuery}
              style={{
                border: "none",
                background: "var(--brand)",
                color: "var(--bg)",
                fontWeight: 600,
                fontSize: 13,
                padding: "8px 13px",
                borderRadius: 9,
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {drugs.map((d) => {
              const active = d.key === drugKey;
              return (
                <div
                  key={d.key}
                  onClick={() => {
                    setDrugKey(d.key);
                    setQuery("");
                  }}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    padding: "7px 12px",
                    borderRadius: 9,
                    cursor: "pointer",
                    border: `1px solid ${active ? "var(--brand)" : "var(--border-input)"}`,
                    color: active ? "var(--brand-soft-text)" : "var(--text-secondary)",
                    background: active ? "var(--brand-soft-bg)" : "var(--surface-card)",
                  }}
                >
                  {d.name.split(" (")[0]}
                </div>
              );
            })}
          </div>
        </div>

        <div className="nn-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500 }}>{drug.name}</div>
          <div
            style={{
              display: "inline-block",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--brand-soft-text)",
              background: "var(--brand-soft-bg)",
              padding: "4px 11px",
              borderRadius: 8,
              marginTop: 9,
            }}
          >
            {drug.classe}
          </div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 15 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                POSOLOGIE USUELLE
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>{drug.poso}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                VOIE / ADMINISTRATION
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>{drug.voie}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                EFFETS INDÉSIRABLES
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6 }}>{drug.effets}</div>
            </div>
            <div
              style={{
                background: "var(--accent-soft-bg)",
                border: "1px solid var(--accent-soft-border)",
                borderRadius: 13,
                padding: "13px 15px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--accent-soft-text)" }}>
                À SURVEILLER
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, marginTop: 6, color: "var(--accent-soft-text-2)" }}>
                {drug.surv}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "13px 22px",
            borderTop: "1px solid var(--border-card)",
            fontSize: 11.5,
            color: "var(--text-muted)",
            lineHeight: 1.5,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth={2}
            style={{ flex: "none", marginTop: 1 }}
          >
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 8h.01M11 12h1v4h1"></path>
          </svg>
          Informations générées par IA à titre indicatif. À vérifier dans le Vidal / protocole du service avant
          administration.
        </div>
      </div>
    </>
  );
}
