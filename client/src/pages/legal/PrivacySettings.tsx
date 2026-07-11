import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Shield, RotateCcw } from "lucide-react";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "tarifberater24_cookie_consent";

export default function PrivacySettings() {
  const [, navigate] = useLocation();
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = "Datenschutzeinstellungen | Tarifberater24";
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (raw) setConsent(JSON.parse(raw));
    } catch {}
  }, []);

  function save() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: consent }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function reset() {
    localStorage.removeItem(CONSENT_KEY);
    setConsent({ necessary: true, analytics: false, marketing: false });
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="w-12 h-6 rounded-full flex items-center px-0.5 transition-colors"
      style={{ background: value ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.15)" }}
      role="switch"
      aria-checked={value}
    >
      <div
        className="w-5 h-5 rounded-full bg-white transition-transform duration-200"
        style={{ transform: value ? "translateX(24px)" : "translateX(0)" }}
      />
    </button>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-void-canvas)", color: "var(--color-pale-mist)" }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-8 text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={16} />
          Zurück
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} style={{ color: "var(--color-dusk-violet)" }} />
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
            Datenschutzeinstellungen
          </h1>
        </div>
        <p className="text-sm opacity-50 mb-10">Verwalten Sie Ihre Cookie-Präferenzen</p>

        <div className="space-y-4">
          {/* Necessary */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-medium mb-1">Notwendige Cookies</p>
                <p className="text-sm opacity-60 leading-relaxed">
                  Diese Cookies sind für den technischen Betrieb der Website erforderlich und können nicht deaktiviert werden. Sie speichern keine persönlichen Informationen.
                </p>
              </div>
              <div className="shrink-0">
                <Toggle value={true} onChange={() => {}} />
              </div>
            </div>
            <p className="text-xs opacity-40 mt-3">Immer aktiv — kann nicht deaktiviert werden</p>
          </div>

          {/* Analytics */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-medium mb-1">Analyse-Cookies</p>
                <p className="text-sm opacity-60 leading-relaxed">
                  Helfen uns zu verstehen, wie Besucher die Website nutzen. Alle Daten werden anonymisiert erfasst und dienen ausschließlich der Verbesserung unserer Dienste.
                </p>
              </div>
              <div className="shrink-0">
                <Toggle value={consent.analytics} onChange={v => setConsent(c => ({ ...c, analytics: v }))} />
              </div>
            </div>
          </div>

          {/* Marketing */}
          <div
            className="p-5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-medium mb-1">Marketing-Cookies</p>
                <p className="text-sm opacity-60 leading-relaxed">
                  Ermöglichen personalisierte Angebote und Empfehlungen basierend auf Ihrem Nutzungsverhalten. Diese Daten können mit Partnerunternehmen geteilt werden.
                </p>
              </div>
              <div className="shrink-0">
                <Toggle value={consent.marketing} onChange={v => setConsent(c => ({ ...c, marketing: v }))} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={save}
            className="flex-1 py-3 px-6 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: saved ? "rgba(34,197,94,0.3)" : "var(--color-dusk-violet)",
              border: saved ? "1px solid rgba(34,197,94,0.5)" : "1px solid transparent",
            }}
          >
            {saved ? "✓ Gespeichert" : "Einstellungen speichern"}
          </button>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm transition-opacity hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--color-pale-mist)" }}
          >
            <RotateCcw size={14} />
            Zurücksetzen
          </button>
        </div>

        <p className="mt-8 text-xs opacity-40">
          Weitere Informationen finden Sie in unserer{" "}
          <button onClick={() => navigate("/datenschutz")} className="underline hover:opacity-80">
            Datenschutzerklärung
          </button>
          .
        </p>
      </div>
    </div>
  );
}
