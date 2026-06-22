import type { CSSProperties } from "react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { HighlightedText } from "./HighlightedText";
import { segmentText } from "../utils/segments";

interface FieldCardProps {
  label: string;
  filled: boolean;
  text: string;
  flagTerm?: string | null;
  active: boolean;
  alertDot?: boolean;
  fullWidth?: boolean;
  lineHeight?: number;
}

export function FieldCard({
  label,
  filled,
  text,
  flagTerm,
  active,
  alertDot,
  fullWidth,
  lineHeight = 1.55,
}: FieldCardProps) {
  const isLow = filled && !!flagTerm && text.includes(flagTerm);
  const segments = filled ? segmentText(text, isLow ? flagTerm : null) : [];

  const card: CSSProperties = {
    gridColumn: fullWidth ? "1 / -1" : undefined,
    background: "var(--surface-card)",
    border: `1px solid ${active ? "var(--brand)" : "var(--border-card)"}`,
    borderRadius: 16,
    padding: "16px 18px",
    transition: "border-color .2s",
    boxShadow: "0 3px 12px rgba(74,58,38,0.04)",
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 9 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--text-muted)" }}>
          {label}
        </span>
        {filled && <ConfidenceBadge low={isLow} label={isLow ? "84 % · à vérifier" : "98 %"} />}
      </div>
      {filled ? (
        <div className="nn-flash" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, lineHeight }}>
          {alertDot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flex: "none" }} />}
          <span>
            <HighlightedText segments={segments} />
          </span>
        </div>
      ) : (
        <div className="nn-shimmer" style={{ fontSize: 13, color: "var(--text-faint)" }}>
          En attente de dictée…
        </div>
      )}
    </div>
  );
}
