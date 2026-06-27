import { Logo } from "../components/Logo";

const HOSPITAL = "Hôpital Bichat";
const EMAIL = "ophelie.dupont@bichat.aphp.fr";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="nn-rise nn-login-root" style={{ display: "flex", width: "100%", height: "100%" }}>
      <div
        className="nn-login-brand"
        style={{
          width: "46%",
          height: "100%",
          background: "var(--brand)",
          color: "var(--bg)",
          padding: "56px 52px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={44} radius={14} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-0.01em" }}>NurseNotes</div>
            <div style={{ fontSize: 12, opacity: 0.78, letterSpacing: "0.02em" }}>{HOSPITAL}</div>
          </div>
        </div>

        <div>
          <div className="nn-login-headline" style={{ fontFamily: "var(--font-serif)", fontSize: 40, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.01em" }}>
            La transmission,
            <br />
            dictée à voix haute.
          </div>
          <div style={{ fontSize: 15, opacity: 0.85, marginTop: 20, lineHeight: 1.65, maxWidth: 340 }}>
            Dictez vos transmissions, l'application remplit automatiquement les bons champs de la fiche patient. Plus de
            double saisie.
          </div>
        </div>

        <div className="nn-login-stats" style={{ display: "flex", gap: 36 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 25, fontWeight: 600 }}>93%</div>
            <div style={{ fontSize: 11.5, opacity: 0.78, maxWidth: 120, lineHeight: 1.45, marginTop: 2 }}>
              des infirmiers prêts à l'adopter
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 25, fontWeight: 600 }}>~2&nbsp;min</div>
            <div style={{ fontSize: 11.5, opacity: 0.78, maxWidth: 120, lineHeight: 1.45, marginTop: 2 }}>
              gagnées par transmission
            </div>
          </div>
        </div>
      </div>

      <div className="nn-login-form" style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: 340, maxWidth: "100%" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--brand)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Portail soignant
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 500, marginTop: 8 }}>Connexion</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 5 }}>
            Service de Cardiologie · {HOSPITAL}
          </div>

          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7 }}>
              Adresse électronique
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 48,
                padding: "0 15px",
                border: "1px solid var(--border-input)",
                borderRadius: 13,
                background: "var(--surface-card)",
                fontSize: 14,
                color: "var(--text)",
              }}
            >
              {EMAIL}
            </div>
          </div>

          <div style={{ marginTop: 15 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 7 }}>
              Mot de passe
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 48,
                padding: "0 15px",
                border: "1px solid var(--border-input)",
                borderRadius: 13,
                background: "var(--surface-card)",
                fontSize: 18,
                letterSpacing: 3,
                color: "var(--text-muted)",
              }}
            >
              ••••••••
            </div>
          </div>

          <button
            onClick={onLogin}
            style={{
              marginTop: 26,
              width: "100%",
              height: 50,
              border: "none",
              borderRadius: 14,
              background: "var(--brand)",
              color: "var(--bg)",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(46,125,107,0.28)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--brand-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--brand)")}
          >
            Se connecter
          </button>
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "var(--text-muted)" }}>
            Transmissions nominatives · données chiffrées (RGPD)
          </div>
        </div>
      </div>
    </div>
  );
}
