import type { Segment } from "../utils/segments";

export function HighlightedText({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.kind === "plain" ? (
          <span key={i}>{seg.text}</span>
        ) : (
          <span key={i} className={seg.kind === "flag" ? "nn-flag-term" : "nn-recognized-term"}>
            {seg.text}
          </span>
        )
      )}
    </>
  );
}
