import type { DpiState } from "../hooks/useDpiSend";

export function DpiModal({
  state,
  patientName,
  chambre,
  onRetry,
  onKeepDraft,
  onFinish,
}: {
  state: DpiState;
  patientName: string;
  chambre: string;
  onRetry: () => void;
  onKeepDraft: () => void;
  onFinish: () => void;
}) {
  if (state.status === "idle") return null;

  return (
    <div
      className="nn-rise"
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(43,42,38,0.5)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--surface-card)",
          borderRadius: 22,
          padding: "30px 30px 26px",
          boxShadow: "0 36px 90px rgba(43,42,38,0.32)",
        }}
      >
        {state.status === "sending" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div
                className="nn-spin"
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  border: "4px solid #E2EFEA",
                  borderTopColor: "var(--brand)",
                }}
              />
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 500, marginTop: 18 }}>
                Envoi de la transmission
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                Intégration au dossier patient informatisé…
              </div>
            </div>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, color: "var(--text)" }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>
                Transmission enregistrée
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, color: "var(--text)", fontWeight: 600 }}>
                <span
                  className="nn-spin"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "2.5px solid #E2EFEA",
                    borderTopColor: "var(--brand)",
                    flex: "none",
                  }}
                />
                Envoi au dossier patient (DPI)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, color: "var(--text-faint)" }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "2px solid var(--border-input)",
                    flex: "none",
                  }}
                />
                Notification à l'équipe de l'après-midi
              </div>
            </div>
          </>
        )}

        {state.status === "done" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div
                className="nn-pop"
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: "50%",
                  background: "var(--brand-soft-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 500, marginTop: 16 }}>
                Transmission intégrée au DPI
              </div>
              <div style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 5, lineHeight: 1.55 }}>
                Le dossier de <b>{patientName}</b> (chambre {chambre}) a été mis à jour.
                <br />
                Visible par toute l'équipe soignante.
              </div>
            </div>
            <div
              style={{
                marginTop: 20,
                background: "var(--bg)",
                border: "1px solid var(--border-card)",
                borderRadius: 13,
                padding: "13px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--text-muted)" }}>Référence DPI</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{state.reference}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ color: "var(--text-muted)" }}>Horodatage</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>20/07/2023 · {state.sentAt}</span>
              </div>
            </div>
            <button
              onClick={onFinish}
              style={{
                marginTop: 20,
                width: "100%",
                height: 48,
                border: "none",
                borderRadius: 14,
                background: "var(--brand)",
                color: "var(--bg)",
                fontWeight: 600,
                fontSize: 14.5,
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(46,125,107,0.28)",
              }}
            >
              Retour aux patients
            </button>
          </>
        )}

        {state.status === "error" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div
                className="nn-pop"
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: "50%",
                  background: "var(--alert-soft-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--alert)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4M12 17h.01"></path>
                  <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path>
                </svg>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 500, marginTop: 16 }}>
                Envoi au DPI interrompu
              </div>
              <div style={{ fontSize: 13.5, color: "var(--text-secondary)", marginTop: 5, lineHeight: 1.55 }}>
                La connexion au serveur du dossier patient a été perdue.
              </div>
            </div>
            <div
              style={{
                marginTop: 18,
                background: "var(--brand-soft-bg-2)",
                border: "1px solid var(--brand-soft-border)",
                borderRadius: 13,
                padding: "13px 15px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brand)"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flex: "none", marginTop: 1 }}
              >
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              <div style={{ fontSize: 12.5, color: "var(--brand-soft-text)", lineHeight: 1.55 }}>
                <b>Aucune donnée perdue.</b> La transmission est sauvegardée en local (brouillon) et sera synchronisée
                automatiquement à la reconnexion.
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button
                onClick={onKeepDraft}
                style={{
                  flex: 1,
                  height: 48,
                  border: "1px solid var(--border-input)",
                  borderRadius: 14,
                  background: "var(--surface-card)",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                Conserver le brouillon
              </button>
              <button
                onClick={onRetry}
                style={{
                  flex: 1,
                  height: 48,
                  border: "none",
                  borderRadius: 14,
                  background: "var(--brand)",
                  color: "var(--bg)",
                  fontWeight: 600,
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                Réessayer l'envoi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
