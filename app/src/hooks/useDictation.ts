import { useCallback, useEffect, useRef, useState } from "react";
import type { Constantes, FieldKey, Patient } from "../types";
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
  constantes: Partial<Constantes>;
  activeField: FieldKey | null;
  savedAt: string | null;
  error: string | null;
}

const IDLE_STATE: DictationState = {
  status: "idle",
  transcript: "",
  filled: {},
  fieldText: {},
  constantes: {},
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

/** Monitoring-item keywords recognized once inside the "constantes" section, so dictated
 * vital signs map directly onto the structured Constantes fields. */
const CONSTANTES_KEYWORDS: { key: keyof Constantes; words: string[] }[] = [
  { key: "ta", words: ["tension", "ta"] },
  { key: "fc", words: ["frequence", "fc", "pouls"] },
  { key: "spo2", words: ["saturation", "spo2", "sao2"] },
  { key: "o2", words: ["oxygene", "o2", "debit"] },
  { key: "diurese", words: ["diurese"] },
];

function normalizeWord(word: string): string {
  return word
    .normalize("NFD")
    .replace(/\p{Mark}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Segments the words spoken inside the "constantes" section by monitoring-item keyword
 * (tension, fréquence, saturation, oxygène, diurèse), mirroring the top-level section logic. */
function parseConstantes(words: string[]): Partial<Constantes> {
  const markers: { key: keyof Constantes; wordIndex: number }[] = [];
  words.forEach((w, idx) => {
    const norm = normalizeWord(w);
    const match = CONSTANTES_KEYWORDS.find((c) => c.words.includes(norm));
    if (match) markers.push({ key: match.key, wordIndex: idx });
  });

  const result: Partial<Constantes> = {};
  markers.forEach((marker, i) => {
    const start = marker.wordIndex + 1;
    const end = i + 1 < markers.length ? markers[i + 1].wordIndex : words.length;
    const segment = words.slice(start, end).join(" ").trim();
    if (segment) result[marker.key] = segment;
  });
  return result;
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
 * keywords (antécédents, traitements, constantes, examens, surveillance).
 * Dictated content and manual edits both accumulate in refs that survive
 * stop()/start() cycles, so dictating one section, stopping, then dictating
 * another section no longer erases the first. */
export function useDictation(patient: Patient | undefined) {
  const [state, setState] = useState<DictationState>(IDLE_STATE);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const manualStopRef = useRef(false);
  const statusRef = useRef<DictationStatus>("idle");
  const savedAtRef = useRef<string | null>(null);
  const wakeWordEndRef = useRef<number | null>(null);

  const fieldTextRef = useRef<Partial<Record<FieldKey, string>>>({});
  const filledRef = useRef<Partial<Record<FieldKey, boolean>>>({});
  const constantesRef = useRef<Partial<Constantes>>({});

  useEffect(() => {
    return () => {
      manualStopRef.current = true;
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  const publish = useCallback(() => {
    setState((s) => ({
      ...s,
      fieldText: { ...fieldTextRef.current },
      filled: { ...filledRef.current },
      constantes: { ...constantesRef.current },
      savedAt: savedAtRef.current,
    }));
  }, []);

  const setFieldText = useCallback((field: Exclude<FieldKey, "constantes">, value: string) => {
    fieldTextRef.current = { ...fieldTextRef.current, [field]: value };
    if (value.trim().length > 0) {
      filledRef.current = { ...filledRef.current, [field]: true };
      if (!savedAtRef.current) savedAtRef.current = nowLabel();
    } else {
      const next = { ...filledRef.current };
      delete next[field];
      filledRef.current = next;
    }
    publish();
  }, [publish]);

  const clearField = useCallback((field: Exclude<FieldKey, "constantes">) => {
    const nextText = { ...fieldTextRef.current };
    delete nextText[field];
    fieldTextRef.current = nextText;
    const nextFilled = { ...filledRef.current };
    delete nextFilled[field];
    filledRef.current = nextFilled;
    publish();
  }, [publish]);

  const setConstante = useCallback((key: keyof Constantes, value: string) => {
    constantesRef.current = { ...constantesRef.current, [key]: value };
    const anyFilled = Object.values(constantesRef.current).some((v) => !!v && v.trim().length > 0);
    if (anyFilled) {
      filledRef.current = { ...filledRef.current, constantes: true };
      if (!savedAtRef.current) savedAtRef.current = nowLabel();
    } else {
      const next = { ...filledRef.current };
      delete next.constantes;
      filledRef.current = next;
    }
    publish();
  }, [publish]);

  const clearConstantes = useCallback(() => {
    constantesRef.current = {};
    const next = { ...filledRef.current };
    delete next.constantes;
    filledRef.current = next;
    publish();
  }, [publish]);

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

    const sessionFieldText: Partial<Record<FieldKey, string>> = {};
    const sessionFilled: Partial<Record<FieldKey, boolean>> = {};
    const sessionConstantes: Partial<Constantes> = {};
    let activeField: FieldKey | null = null;

    markers.forEach((marker, i) => {
      const start = marker.wordIndex + 1;
      const end = i + 1 < markers.length ? markers[i + 1].wordIndex : postWake.length;
      const segmentWords = postWake.slice(start, end);
      const segment = segmentWords.join(" ").trim();
      if (segment) {
        sessionFieldText[marker.field] = segment;
        sessionFilled[marker.field] = true;
        if (marker.field === "constantes") Object.assign(sessionConstantes, parseConstantes(segmentWords));
      }
      activeField = marker.field;
    });

    fieldTextRef.current = { ...fieldTextRef.current, ...sessionFieldText };
    filledRef.current = { ...filledRef.current, ...sessionFilled };
    constantesRef.current = { ...constantesRef.current, ...sessionConstantes };

    if (Object.keys(sessionFilled).length > 0 && !savedAtRef.current) {
      savedAtRef.current = nowLabel();
    }

    setState((s) => ({
      ...s,
      status: statusRef.current,
      transcript: postWake.join(" "),
      fieldText: { ...fieldTextRef.current },
      filled: { ...filledRef.current },
      constantes: { ...constantesRef.current },
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
      setState((s) => ({
        ...s,
        status: "idle",
        error: "Reconnaissance vocale non disponible sur ce navigateur. Essayez Chrome ou Edge.",
      }));
      return;
    }

    manualStopRef.current = false;
    wakeWordEndRef.current = null;
    statusRef.current = "waking";
    setState((s) => ({ ...s, status: "waking", transcript: "", activeField: null, error: null }));

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
    const hasContent = Object.keys(filledRef.current).length > 0;
    const status = hasContent ? "complete" : "idle";
    statusRef.current = status;
    setState((s) => ({ ...s, status, activeField: null }));
  }, []);

  return { state, start, stop, setFieldText, clearField, setConstante, clearConstantes };
}
