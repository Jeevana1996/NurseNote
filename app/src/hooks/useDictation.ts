import { useCallback, useEffect, useRef, useState } from "react";
import type { FieldKey, Patient } from "../types";
import { nowLabel } from "../utils/format";

export type DictationStatus = "idle" | "waking" | "listening" | "complete";

export interface DictationState {
  status: DictationStatus;
  transcript: string;
  filled: Partial<Record<FieldKey, boolean>>;
  activeField: FieldKey | null;
  savedAt: string | null;
}

const WAKE_MS = 700;
const WORD_INTERVAL_MS = 50;
const ACTIVE_FIELD_HIGHLIGHT_MS = 1100;
const COMPLETE_DELAY_MS = 450;

const IDLE_STATE: DictationState = { status: "idle", transcript: "", filled: {}, activeField: null, savedAt: null };

/** Drives the scripted "voice dictation" demo: a wake pause, then a word-by-word
 * transcript reveal that fills the matching transmission field as each trigger
 * phrase is reached. */
export function useDictation(patient: Patient | undefined) {
  const [state, setState] = useState<DictationState>(IDLE_STATE);

  const wakeTimer = useRef<number | null>(null);
  const wordInterval = useRef<number | null>(null);
  const activeFieldTimer = useRef<number | null>(null);
  const completeTimer = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (wakeTimer.current) window.clearTimeout(wakeTimer.current);
    if (wordInterval.current) window.clearInterval(wordInterval.current);
    if (activeFieldTimer.current) window.clearTimeout(activeFieldTimer.current);
    if (completeTimer.current) window.clearTimeout(completeTimer.current);
    wakeTimer.current = null;
    wordInterval.current = null;
    activeFieldTimer.current = null;
    completeTimer.current = null;
  }, []);

  // The caller remounts this hook per patient (TransmissionScreen is keyed by
  // patient.id), so only timer cleanup on unmount is needed here.
  useEffect(() => clearTimers, [clearTimers]);

  const start = useCallback(() => {
    if (!patient) return;
    clearTimers();
    setState({ status: "waking", transcript: "", filled: {}, activeField: null, savedAt: null });

    wakeTimer.current = window.setTimeout(() => {
      const text =
        patient.dictation || `${patient.civilite} ${patient.nom} chambre ${patient.chambre}. ${patient.motif}.`;
      const words = text.split(" ");
      const pendingSteps = [...patient.steps];
      let revealed = 0;
      let filled: Partial<Record<FieldKey, boolean>> = {};
      let activeField: FieldKey | null = null;
      let savedAt: string | null = null;

      setState((s) => ({ ...s, status: "listening" }));

      wordInterval.current = window.setInterval(() => {
        revealed += 1;
        const transcriptSoFar = words.slice(0, revealed).join(" ");
        const lower = transcriptSoFar.toLowerCase();

        // Side effects (array mutation, timer scheduling) belong here, in the
        // interval tick itself — not inside the setState updater below, which
        // React 18 StrictMode double-invokes and would otherwise replay them.
        for (let i = 0; i < pendingSteps.length; i++) {
          const step = pendingSteps[i];
          if (lower.includes(step.trigger.toLowerCase())) {
            filled = { ...filled, [step.field]: true };
            activeField = step.field;
            savedAt = savedAt ?? nowLabel();
            pendingSteps.splice(i, 1);
            i -= 1;

            const fieldToReset = step.field;
            if (activeFieldTimer.current) window.clearTimeout(activeFieldTimer.current);
            activeFieldTimer.current = window.setTimeout(() => {
              setState((s2) => (s2.activeField === fieldToReset ? { ...s2, activeField: null } : s2));
            }, ACTIVE_FIELD_HIGHLIGHT_MS);
          }
        }

        setState((s) => ({ ...s, transcript: transcriptSoFar, filled, activeField, savedAt }));

        if (revealed >= words.length && wordInterval.current) {
          window.clearInterval(wordInterval.current);
          wordInterval.current = null;
          completeTimer.current = window.setTimeout(() => {
            setState((s) => ({ ...s, status: "complete", activeField: null }));
          }, COMPLETE_DELAY_MS);
        }
      }, WORD_INTERVAL_MS);
    }, WAKE_MS);
  }, [patient, clearTimers]);

  const stop = useCallback(() => {
    clearTimers();
    setState((s) =>
      s.status === "idle" ? s : { ...s, status: "idle", activeField: null, savedAt: s.transcript ? nowLabel() : s.savedAt }
    );
  }, [clearTimers]);

  return { state, start, stop };
}
