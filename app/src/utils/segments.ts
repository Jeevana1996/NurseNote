export type SegmentKind = "plain" | "term" | "flag";

export interface Segment {
  text: string;
  kind: SegmentKind;
}

/** Medical terms the speech recognizer underlines as "recognized" in the transmission review. */
const RECOGNIZED_TERMS = [
  "Furosémide IV",
  "Furosémide",
  "Bisoprolol",
  "Apixaban",
  "Amiodarone",
  "Atorvastatine",
  "Aspirine",
  "Ticagrelor",
  "Amlodipine",
  "Ramipril",
  "Colchicine",
  "Ibuprofène",
  "Fibrillation auriculaire",
  "AVC ischémique",
  "Insuffisance cardiaque",
  "oxygénothérapie",
  "dyslipidémie",
  "troponines",
  "œdèmes",
  "dyspnée",
  "HTA",
  "ACFA",
  "SCA",
  "BAV",
  "RGO",
];

interface Mark {
  start: number;
  end: number;
  kind: "term" | "flag";
}

/**
 * Splits a field's text into plain / recognized-term / low-confidence-flag segments,
 * for rendering with underlines (term) or a highlighted "to verify" box (flag).
 */
export function segmentText(text: string, flagTerm?: string | null): Segment[] {
  if (!text) return [];

  const marks: Mark[] = [];
  const collect = (term: string | undefined | null, kind: Mark["kind"]) => {
    if (!term) return;
    let i = text.indexOf(term);
    while (i >= 0) {
      marks.push({ start: i, end: i + term.length, kind });
      i = text.indexOf(term, i + term.length);
    }
  };
  RECOGNIZED_TERMS.forEach((t) => collect(t, "term"));
  collect(flagTerm, "flag");

  // Same start: flag wins over term. Otherwise prefer the longer match.
  marks.sort(
    (a, b) =>
      a.start - b.start ||
      (a.kind === "flag" ? -1 : b.kind === "flag" ? 1 : 0) ||
      (b.end - b.start) - (a.end - a.start)
  );

  const kept: Mark[] = [];
  let lastEnd = 0;
  for (const m of marks) {
    if (m.start >= lastEnd) {
      kept.push(m);
      lastEnd = m.end;
    }
  }

  const out: Segment[] = [];
  let pos = 0;
  for (const m of kept) {
    if (m.start > pos) out.push({ text: text.slice(pos, m.start), kind: "plain" });
    out.push({ text: text.slice(m.start, m.end), kind: m.kind });
    pos = m.end;
  }
  if (pos < text.length) out.push({ text: text.slice(pos), kind: "plain" });
  return out;
}
