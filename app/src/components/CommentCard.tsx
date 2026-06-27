export function CommentCard({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        background: "var(--surface-card)",
        border: "1px solid var(--border-card)",
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: "0 3px 12px rgba(74,58,38,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 9 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--text-muted)" }}>
          COMMENTAIRES
        </span>
        <span
          style={{
            fontSize: 10.5,
            color: "var(--accent-soft-text-2)",
            background: "var(--surface-secondary)",
            padding: "3px 8px",
            borderRadius: 7,
          }}
        >
          note libre
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ajoutez une note particulière pour la relève…"
        rows={3}
        style={{
          width: "100%",
          resize: "vertical",
          border: "1px solid var(--border-input)",
          borderRadius: 11,
          padding: "10px 12px",
          fontFamily: "inherit",
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--text)",
          background: "var(--bg)",
          outline: "none",
        }}
      />
    </div>
  );
}
