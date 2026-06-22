import { useState } from "react";
import { Logo } from "../components/Logo";
import { services } from "../data/services";
import type { Service } from "../types";

const HOSPITAL = "Hôpital Bichat";
const NURSE = "Ophélie Dupont";

function ServiceCard({ service, onOpen }: { service: Service; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const { locked } = service;

  return (
    <div
      onClick={locked ? undefined : onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-card)",
        border: `1px solid ${locked ? "var(--border-card)" : "#BCD8CD"}`,
        borderRadius: 18,
        padding: 18,
        cursor: locked ? "not-allowed" : "pointer",
        opacity: locked ? 0.65 : 1,
        transition: "all .15s",
        boxShadow: !locked && hover ? "0 4px 14px rgba(46,125,107,0.08)" : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: locked ? "var(--surface-secondary)" : "var(--brand-soft-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 15,
            color: locked ? "var(--text-muted)" : "var(--brand-soft-text)",
          }}
        >
          {service.short}
        </div>
        {locked && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5AC9A" strokeWidth={2}>
            <rect x="5" y="11" width="14" height="9" rx="2"></rect>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
          </svg>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: 16, marginTop: 15 }}>{service.name}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{service.sub}</div>
    </div>
  );
}

export function ServiceScreen({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="nn-rise" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 36px",
          borderBottom: "1px solid var(--border-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Logo size={36} radius={11} />
          <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>NurseNotes</div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              borderLeft: "1px solid var(--border-input)",
              paddingLeft: 11,
            }}
          >
            {HOSPITAL}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "var(--brand-soft-bg)",
              color: "var(--brand-soft-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            OD
          </div>
          {NURSE}
        </div>
      </div>

      <div style={{ flex: 1, padding: "48px 56px" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 500 }}>Bonjour Ophélie 👋</div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 7 }}>
          Sélectionnez votre service pour accéder à vos transmissions.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 32, maxWidth: 880 }}>
          {services.map((s) => (
            <ServiceCard key={s.key} service={s} onOpen={onSelect} />
          ))}
        </div>
        <div style={{ marginTop: 28, fontSize: 12, color: "var(--text-muted)", maxWidth: 620, lineHeight: 1.55 }}>
          Seul votre service est accessible. Les autres services restent verrouillés sauf réquisition exceptionnelle
          (manque de personnel).
        </div>
      </div>
    </div>
  );
}
