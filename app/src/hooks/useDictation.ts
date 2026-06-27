import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldKey, Patient } from "../types";
import { nowLabel } from "../utils/format";

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognition };
    webkitSpeechRecognition?: { new (): SpeechRecognition };
  }
}

export const speechRecognitionSupported =
  typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export type DictationStatus = "idle" | "waking" | "listening" | "complete";

export interface DictationState {
  status: DictationStatus;
  transcript: string;
  filled: Partial<Record<FieldKey, boolean>>;
  fieldText: Partial<Record<FieldKey, string>>;
  activeField: FieldKey | null;
  savedAt: string | null;
  error: string | null;
}

const IDLE_STATE: DictationState = {
  status: "idle",
  transcript: "",
  filled: {},
  fieldText: {},
  activeField: null,
  savedAt: null,
  error: null,
};

/** Section keywords the nurse says out loud to switch which field she's dictating into. */
const SECTION_KEYWORDS: { field: FieldKey; words: string[] }[] = [
  { field: "antecedents", words: ["antecedents", "antecedent"] },
  { field: "traitements", words: ["traitements", "traitement"] },
  { field: "constantes", words: ["constantes", "constante"] },
  { field: "examens", words: ["examens", "examen"] },
  { field: "surveillance", words: ["surveillance"] },
];

function normalizeWord(word: string): string {
  return word
    .normalize("NFD")
    .replace(/\p{Mark}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Finds where the "ok connect" wake phrase ends in a word array, or -1 if absent. */
function findWakeWordEnd(words: string[]): number {
  for (let i = 0; i < words.length - 1; i++) {
    const a = normalizeWord(words[i]);
    const b = normalizeWord(words[i + 1]);
    if ((a === "ok" || a === "okay") && (b === "connect" || b === "connecte")) return i + 2;
  }
  return -1;
}

function buildTranscript(event: SpeechRecognitionEvent): string {
  let finalText = "";
  let interimText = "";
  for (let i = 0; i < event.results.length; i++) {
    const result = event.results.item(i);
    const piece = result.item(0).transcript;
    if (result.isFinal) finalText += piece + " ";
    else interimText += piece + " ";
  }
  return (finalText + interimText).trim();
}

/** Drives real microphone dictation: waits for the "ok connect" wake phrase, then
 * segments the live transcript into transmission fields using spoken section
 * keywords (antécédents, traitements, constantes, examens, surveillance). */
export function useDictation(patient: Patient | undefined) {
  const [state, setState] = useState<DictationState>(IDLE_STATE);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const manualStopRef = useRef(false);
  const statusRef = useRef<DictationStatus>("idle");
  const savedAtRef = useRef<string | null>(null);
  const wakeWordEndRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      manualStopRef.current = true;
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const handleResult = useCallback((event: SpeechRecognitionEvent) => {
    const full = buildTranscript(event);
    const words = full.split(/\s+/).filter(Boolean);

    if (statusRef.current === "waking") {
      const wakeEnd = findWakeWordEnd(words);
      if (wakeEnd === -1) return;
      wakeWordEndRef.current = wakeEnd;
      statusRef.current = "listening";
    }

    const postWake = words.slice(wakeWordEndRef.current ?? 0);

    const markers: { field: FieldKey; wordIndex: number }[] = [];
    postWake.forEach((w, idx) => {
      const norm = normalizeWord(w);
      const match = SECTION_KEYWORDS.find((s) => s.words.includes(norm));
      if (match) markers.push({ field: match.field, wordIndex: idx });
    });

    const fieldText: Partial<Record<FieldKey, string>> = {};
    const filled: Partial<Record<FieldKey, boolean>> = {};
    let activeField: FieldKey | null = null;

    markers.forEach((marker, i) => {
      const start = marker.wordIndex + 1;
      const end = i + 1 < markers.length ? markers[i + 1].wordIndex : postWake.length;
      const segment = postWake.slice(start, end).join(" ").trim();
      if (segment) {
        fieldText[marker.field] = segment;
        filled[marker.field] = true;
      }
      activeField = marker.field;
    });

    if (Object.keys(filled).length > 0 && !savedAtRef.current) {
      savedAtRef.current = nowLabel();
    }

    setState((s) => ({
      ...s,
      status: statusRef.current,
      transcript: postWake.join(" "),
      filled,
      fieldText,
      activeField,
      savedAt: savedAtRef.current,
    }));
  }, []);

  const handleError = useCallback((event: SpeechRecognitionErrorEvent) => {
    if (event.error === "aborted" || event.error === "no-speech") return;
    manualStopRef.current = true;
    statusRef.current = "idle";
    const message =
      event.error === "not-allowed" || event.error === "service-not-allowed"
        ? "Microphone refusé. Autorisez l'accès au micro dans les réglages de votre navigateur."
        : "Une erreur de reconnaissance vocale est survenue. Réessayez.";
    setState((s) => ({ ...s, status: "idle", activeField: null, error: message }));
  }, []);

  const handleEnd = useCallback(() => {
    if (manualStopRef.current) return;
    if (statusRef.current === "waking" || statusRef.current === "listening") {
      try {
        recognitionRef.current?.start();
      } catch {
        // already running; ignore
      }
    }
  }, []);

  const start = useCallback(() => {
    if (!patient) return;
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setState({ ...IDLE_STATE, error: "Reconnaissance vocale non disponible sur ce navigateur. Essayez Chrome ou Edge." });
      return;
    }

    manualStopRef.current = false;
    savedAtRef.current = null;
    wakeWordEndRef.current = null;
    statusRef.current = "waking";
    setState({ ...IDLE_STATE, status: "waking" });

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR";
    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      statusRef.current = "idle";
      setState((s) => ({ ...s, status: "idle", error: "Impossible de démarrer le microphone." }));
    }
  }, [patient, handleResult, handleError, handleEnd]);

  const stop = useCallback(() => {
    manualStopRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    statusRef.current = "idle";
    setState((s) => {
      const hasContent = Object.keys(s.filled).length > 0;
      const status = hasContent ? "complete" : "idle";
      statusRef.current = status;
      return { ...s, status, activeField: null };
    });
  }, []);

  return { state, start, stop };
}
