import { useCallback, useRef, useState } from "react";
import { dpiReference, nowLabel } from "../utils/format";

export type DpiStatus = "idle" | "sending" | "done" | "error";

export interface DpiState {
  status: DpiStatus;
  reference: string | null;
  sentAt: string | null;
}

const SEND_MS = 1700;
const IDLE_STATE: DpiState = { status: "idle", reference: null, sentAt: null };

/** Drives the "send to DPI" modal: a simulated network round-trip that ends in
 * success, or — when simulateError is set — a recoverable connection failure. */
export function useDpiSend(onSent: () => void) {
  const [state, setState] = useState<DpiState>(IDLE_STATE);
  const timer = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const send = useCallback(
    (chambre: string, simulateError: boolean, force = false) => {
      clear();
      setState({ status: "sending", reference: null, sentAt: nowLabel() });
      timer.current = window.setTimeout(() => {
        if (simulateError && !force) {
          setState((s) => ({ ...s, status: "error" }));
          return;
        }
        setState({ status: "done", reference: dpiReference(chambre), sentAt: nowLabel() });
        onSent();
      }, SEND_MS);
    },
    [clear, onSent]
  );

  const retry = useCallback((chambre: string) => send(chambre, false, true), [send]);

  const keepDraft = useCallback(() => {
    clear();
    setState({ status: "idle", reference: null, sentAt: nowLabel() });
  }, [clear]);

  const finish = useCallback(() => {
    clear();
    setState(IDLE_STATE);
  }, [clear]);

  return { state, send, retry, keepDraft, finish };
}
