import type { CSSProperties } from "react";

const base: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.01em",
  padding: "3px 9px",
  borderRadius: 8,
  whiteSpace: "nowrap",
};

export function ConfidenceBadge({ low, label }: { low: boolean; label: string }) {
  return (
    <span
      style={{
        ...base,
        background: low ? "#F6E4DA" : "var(--brand-soft-bg)",
        color: low ? "var(--accent-soft-text)" : "var(--brand-soft-text)",
      }}
    >
      {label}
    </span>
  );
}
