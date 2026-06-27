import { useState } from "react";
import type { FieldKey, Patient } from "../types";
import { useDictation, speechRecognitionSupported } from "../hooks/useDictation";
import { FieldCard } from "../components/FieldCard";
import { ConstantesCard } from "../components/ConstantesCard";
import { CommentCard } from "../components/CommentCard";

const FIELD_LABELS: Record<FieldKey, string> = {
  antecedents: "Antécédents",
  traitements: "Traitements",
  constantes: "Constantes",
  examens: "Examens",
  surveillance: "Surveillance",
};

export function TransmissionScreen({
  patient,
  onBack,
  onSend,
  onUpdateComment,
  dpiPending,
}: {
  patient: Patient;
  onBack: () => void;
  onSend: () => void;
  onUpdateComment: (commentaire: string) => void;
  dpiPending: boolean;
}) {
  const [backHover, setBackHover] = useState(false);
  const dictation = useDictation(patient);

  const isFait = patient.status === "fait";
  const { status, transcript, filled, fieldText, activeField, savedAt, error } = dictation.state;
  const isActivelyDictating = status === "waking" || status === "listening";

  const fieldFilled = (field: FieldKey) => isFait || !!filled[field];
  const fieldContent = (field: Exclude<FieldKey, "constantes">) => fieldText[field] ?? patient[field];

  const flag = patient.lowConfidenceTerm ?? null;
  const flagFound = !!flag && Object.values(fieldText).some((t) => t.toLowerCase().includes(flag.toLowerCase()));
  const reviewLowShow = status === "complete" && flagFound;
  const reviewHighShow = status === "complete" && !flagFound;
  const reviewPct = flagFound ? "96 %" : "99 %";

  const canSave = !dpiPending && !isActivelyDictating && (status === "complete" || Object.keys(filled).length > 0);

  const handleSave = () => {
    if (!canSave) return;
    onSend();
  };

  const handleMicToggle = () => {
    if (isActivelyDictating) dictation.stop();
    else dictation.start();
  };

  return (
    <div className="nn-transmission-root" style={{ display: "flex", width: "100%", height: "100%" }}>
      <div className="nn-transmission-fields" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "18px 26px",
            borderBottom: "1px solid var(--border-card)",
            background: "var(--surface-card)",
            flexWrap: "wrap",
          }}
        >
          <div
            onClick={onBack}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            style={{
              cursor: "pointer",
              width: 36,
              height: 36,
              borderRadius: 11,
              border: "1px solid var(--border-input)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
              background: backHover ? "#F3ECE0" : undefined,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "var(--brand-soft-bg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",
            }}
          >
            <div style={{ fontSize: 8, color: "var(--brand-soft-text)", opacity: 0.75 }}>CH.</div>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 16, color: "var(--brand-soft-text)", lineHeight: 1 }}>
              {patient.chambre}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 21,
                  fontWeight: 500,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: 0,
                }}
              >
                {patient.civilite} {patient.nom}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-muted)", flex: "none" }}>{patient.age} ans</span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--accent-soft-text)",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {patient.motif}
            </div>
          </div>
          {savedAt && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11.5,
                fontWeight: 500,
                color: "var(--brand-soft-text)",
                background: "var(--brand-soft-bg-2)",
                border: "1px solid var(--brand-soft-border)",
                padding: "7px 12px",
                borderRadius: 9,
                whiteSpace: "nowrap",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              Brouillon auto · {savedAt}
            </div>
          )}
          <button
            onClick={handleSave}
            style={{
              padding: "10px 17px",
              borderRadius: 13,
              fontWeight: 600,
              fontSize: 13.5,
              cursor: canSave ? "pointer" : "not-allowed",
              border: "none",
              background: canSave ? "var(--brand)" : "#EAE3D6",
              color: canSave ? "var(--bg)" : "#B0A892",
              boxShadow: canSave ? "0 6px 16px rgba(46,125,107,0.26)" : undefined,
            }}
          >
            {isFait ? "Mettre à jour" : "Envoyer au dossier patient"}
          </button>
        </div>

        <div className="nn-scroll nn-transmission-fields-scroll" style={{ flex: 1, overflowY: "auto", padding: "22px 26px", background: "var(--bg)" }}>
          {reviewLowShow && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 11,
                background: "var(--accent-soft-bg)",
                border: "1px solid var(--accent-soft-border)",
                borderRadius: 14,
                padding: "13px 16px",
                marginBottom: 16,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-soft-text)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}>
                <path d="M12 9v4M12 17h.01"></path>
                <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path>
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--accent-soft-text)" }}>
                  Relecture — reconnaissance vocale {reviewPct}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--accent-soft-text-2)", marginTop: 3, lineHeight: 1.5 }}>
                  Une zone, <b>surlignée en terracotta</b>, est à vérifier avant l'envoi au dossier patient. Les termes
                  médicaux reconnus sont soulignés.
                </div>
              </div>
            </div>
          )}
          {reviewHighShow && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 11,
                background: "var(--brand-soft-bg-2)",
                border: "1px solid var(--brand-soft-border)",
                borderRadius: 14,
                padding: "13px 16px",
                marginBottom: 16,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}>
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--brand-soft-text)" }}>
                  Relecture — reconnaissance vocale {reviewPct}
                </div>
                <div style={{ fontSize: 12.5, color: "#4A7A6C", marginTop: 3, lineHeight: 1.5 }}>
                  Aucune zone à vérifier. Vous pouvez envoyer la transmission au dossier patient.
                </div>
              </div>
            </div>
          )}
          {isFait && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: "var(--brand-soft-bg-2)",
                border: "1px solid var(--brand-soft-border)",
                color: "var(--brand-soft-text)",
                borderRadius: 13,
                padding: "11px 15px",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              Transmission intégrée au DPI. Vous pouvez la re-dicter pour la mettre à jour.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 14 }}>
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", color: "var(--text-muted)" }}>
                  MOTIF D'ADMISSION
                </span>
                <span style={{ fontSize: 10.5, color: "var(--accent-soft-text-2)", background: "var(--surface-secondary)", padding: "3px 8px", borderRadius: 7 }}>
                  pré-enregistré
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{patient.motif}</div>
            </div>

            <FieldCard
              label="ANTÉCÉDENTS"
              filled={fieldFilled("antecedents")}
              text={fieldContent("antecedents")}
              flagTerm={flag}
              active={activeField === "antecedents"}
            />
            <FieldCard
              label="TRAITEMENTS EN COURS"
              filled={fieldFilled("traitements")}
              text={fieldContent("traitements")}
              flagTerm={flag}
              active={activeField === "traitements"}
            />
            <div style={{ gridColumn: "1 / -1" }}>
              <ConstantesCard
                filled={fieldFilled("constantes")}
                active={activeField === "constantes"}
                constantes={patient.constantes}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <FieldCard
                label="EXAMENS / RÉSULTATS EN ATTENTE"
                filled={fieldFilled("examens")}
                text={fieldContent("examens")}
                flagTerm={flag}
                active={activeField === "examens"}
                alertDot={patient.examAlert}
                fullWidth
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <FieldCard
                label="SURVEILLANCE & TRANSMISSIONS POUR LA RELÈVE"
                filled={fieldFilled("surveillance")}
                text={fieldContent("surveillance")}
                flagTerm={flag}
                active={activeField === "surveillance"}
                fullWidth
                lineHeight={1.6}
              />
            </div>
            <CommentCard value={patient.commentaire ?? ""} onChange={onUpdateComment} />
          </div>
          <div style={{ height: 20 }} />
        </div>
      </div>

      <div
        className="nn-transmission-voice"
        style={{
          width: 320,
          flex: "none",
          height: "100%",
          background: "var(--brand-deep)",
          color: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          padding: "22px 20px",
        }}
      >
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.6 }}>
          Reconnaissance vocale
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 5 }}>Dictée de la transmission</div>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            onClick={speechRecognitionSupported ? handleMicToggle : undefined}
            className={isActivelyDictating ? "nn-pulse" : undefined}
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: speechRecognitionSupported ? "pointer" : "not-allowed",
              opacity: speechRecognitionSupported ? 1 : 0.45,
              transition: "all .2s",
              background: isActivelyDictating ? "var(--alert)" : "var(--accent)",
              boxShadow: isActivelyDictating ? undefined : "0 8px 22px rgba(203,124,90,0.4)",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth={2} strokeLinecap="round">
              <rect x="9" y="3" width="6" height="11" rx="3"></rect>
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"></path>
            </svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 15, opacity: 0.92 }}>
            {!speechRecognitionSupported
              ? "Indisponible sur ce navigateur"
              : isActivelyDictating
                ? "À l'écoute…"
                : "Toucher pour dicter"}
          </div>
          {status === "waking" && (
            <div
              style={{
                marginTop: 9,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                background: "rgba(191,208,180,0.22)",
                border: "1px solid rgba(191,208,180,0.5)",
                padding: "4px 11px",
                borderRadius: 9,
              }}
            >
              « Ok connect »
            </div>
          )}
          {error && (
            <div style={{ marginTop: 10, fontSize: 11.5, color: "#E8B4A4", textAlign: "center", lineHeight: 1.45 }}>
              {error}
            </div>
          )}
          {speechRecognitionSupported && !error && (
            <div style={{ marginTop: 10, fontSize: 11, opacity: 0.6, textAlign: "center", lineHeight: 1.5 }}>
              Dites « antécédents », « traitements », « constantes », « examens » ou « surveillance » pour remplir chaque
              rubrique.
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.55 }}>
          Transcription en direct
        </div>
        <div
          className="nn-scroll nn-transmission-voice-transcript"
          style={{
            flex: 1,
            marginTop: 8,
            background: "var(--brand-deeper)",
            borderRadius: 14,
            padding: 15,
            overflowY: "auto",
            fontSize: 13.5,
            lineHeight: 1.65,
          }}
        >
          {transcript.length > 0 ? (
            <>
              <span>{transcript}</span>
              {status === "listening" && (
                <span
                  className="nn-blink"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 15,
                    background: "var(--sage)",
                    marginLeft: 2,
                    verticalAlign: -2,
                  }}
                />
              )}
            </>
          ) : (
            <span style={{ opacity: 0.5 }}>
              Touchez le micro, dites « Ok connect », puis dictez votre transmission. Les champs se remplissent
              automatiquement.
            </span>
          )}
        </div>
        {activeField && (
          <div style={{ marginTop: 11, fontSize: 12, display: "flex", alignItems: "center", gap: 7, color: "var(--sage)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sage)" }} />
            Remplissage : {FIELD_LABELS[activeField]}
          </div>
        )}
      </div>
    </div>
  );
}
