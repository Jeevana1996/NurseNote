import type { CSSProperties } from "react";
import type { PatientStatus } from "../types";

const base: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  flex: "none",
};

export function StatusPill({ status }: { status: PatientStatus }) {
  const done = status === "fait";
  return (
    <span
      style={{
        ...base,
        background: done ? "var(--brand-soft-bg)" : "var(--accent-soft-bg)",
        color: done ? "var(--brand-soft-text)" : "var(--accent-soft-text)",
      }}
    >
      {done ? "Transmis au DPI" : "À faire"}
    </span>
  );
}
