import { useState, type CSSProperties } from "react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { HighlightedText } from "./HighlightedText";
import { segmentText } from "../utils/segments";
import { CardIconButton, CheckIcon, PencilIcon, TrashIcon } from "./CardIconButton";

interface FieldCardProps {
  label: string;
  filled: boolean;
  text: string;
  flagTerm?: string | null;
  active: boolean;
  alertDot?: boolean;
  fullWidth?: boolean;
  lineHeight?: number;
  onChange: (value: string) => void;
  onClear: () => void;
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
  onChange,
  onClear,
}: FieldCardProps) {
  const [editing, setEditing] = useState(false);

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
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {filled && !editing && <ConfidenceBadge low={isLow} label={isLow ? "84 % · à vérifier" : "98 %"} />}
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
        <textarea
          autoFocus
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          placeholder="Écrivez la transmission pour cette rubrique…"
          rows={3}
          style={{
            width: "100%",
            resize: "vertical",
            border: "1px solid var(--border-input)",
            borderRadius: 11,
            padding: "9px 11px",
            fontFamily: "inherit",
            fontSize: 14,
            lineHeight,
            color: "var(--text)",
            background: "var(--bg)",
            outline: "none",
          }}
        />
      ) : filled ? (
        <div className="nn-flash" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, lineHeight }}>
          {alertDot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flex: "none" }} />}
          <span>
            <HighlightedText segments={segments} />
          </span>
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
