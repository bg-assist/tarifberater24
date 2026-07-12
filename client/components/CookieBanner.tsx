import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { X, Cookie, ChevronDown, ChevronUp } from "lucide-react";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "tarifberater24_cookie_consent";
const ANALYTICS_SCRIPT_ID = "tarifberater24-umami";

function syncAnalyticsConsent(enabled: boolean) {
  const existing = document.getElementById(ANALYTICS_SCRIPT_ID);
  if (!enabled) {
    existing?.remove();
    return;
  }

  if (existing) return;

  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();
  if (!endpoint || !websiteId) {
    console.warn("[Analytics] Consent granted, but Umami is not configured");
    return;
  }

  const script = document.createElement("script");
  script.id = ANALYTICS_SCRIPT_ID;
  script.defer = true;
  script.src = `${endpoint.replace(/\/$/, "")}/umami`;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
}

function loadConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  syncAnalyticsConsent(consent.analytics);
  window.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: consent }));
}

export function useCookieConsent() {
  return loadConsent();
}

export default function CookieBanner() {
  const [, navigate] = useLocation();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = loadConsent();
    if (existing) {
      syncAnalyticsConsent(existing.analytics);
      return;
    }

    // Slight delay for better UX
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function acceptAll() {
    const c = { necessary: true, analytics: true, marketing: true };
    saveConsent(c);
    setVisible(false);
  }

  function acceptNecessary() {
    const c = { necessary: true, analytics: false, marketing: false };
    saveConsent(c);
    setVisible(false);
  }

  function saveCustom() {
    saveConsent(consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 60%, transparent)" }}
    >
      <div
        className="max-w-2xl mx-auto rounded-2xl p-5 md:p-6"
        style={{
          background: "rgba(20,20,30,0.98)",
          border: "1px solid rgba(52,55,85,0.6)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <Cookie size={20} className="mt-0.5 shrink-0" style={{ color: "var(--color-dusk-violet)" }} />
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">Wir verwenden Cookies</h3>
            <p className="text-xs opacity-60 leading-relaxed">
              Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. Technisch notwendige Cookies sind immer aktiv.
              Weitere Informationen finden Sie in unserer{" "}
              <button
                onClick={() => { navigate("/datenschutz"); setVisible(false); }}
                className="underline hover:opacity-100 opacity-80"
              >
                Datenschutzerklärung
              </button>
              .
            </p>
          </div>
          <button
            onClick={acceptNecessary}
            className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
            aria-label="Schließen"
          >
            <X size={16} />
          </button>
        </div>

        {/* Expandable settings */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity mb-4"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Einstellungen anpassen
        </button>

        {expanded && (
          <div className="space-y-3 mb-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
            {/* Necessary */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white">Notwendig</p>
                <p className="text-xs opacity-50">Technisch erforderlich für den Betrieb</p>
              </div>
              <div
                className="w-10 h-5 rounded-full flex items-center px-0.5"
                style={{ background: "var(--color-dusk-violet)" }}
              >
                <div className="w-4 h-4 rounded-full bg-white ml-auto" />
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white">Analyse</p>
                <p className="text-xs opacity-50">Nutzungsstatistiken zur Verbesserung</p>
              </div>
              <button
                onClick={() => setConsent(c => ({ ...c, analytics: !c.analytics }))}
                className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors"
                style={{ background: consent.analytics ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.15)" }}
                aria-checked={consent.analytics}
                role="switch"
              >
                <div
                  className="w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: consent.analytics ? "translateX(20px)" : "translateX(0)" }}
                />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white">Marketing</p>
                <p className="text-xs opacity-50">Personalisierte Angebote</p>
              </div>
              <button
                onClick={() => setConsent(c => ({ ...c, marketing: !c.marketing }))}
                className="w-10 h-5 rounded-full flex items-center px-0.5 transition-colors"
                style={{ background: consent.marketing ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.15)" }}
                aria-checked={consent.marketing}
                role="switch"
              >
                <div
                  className="w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: consent.marketing ? "translateX(20px)" : "translateX(0)" }}
                />
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={acceptAll}
            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-dusk-violet)" }}
          >
            Alle akzeptieren
          </button>
          {expanded ? (
            <button
              onClick={saveCustom}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-pale-mist)" }}
            >
              Auswahl speichern
            </button>
          ) : (
            <button
              onClick={acceptNecessary}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--color-pale-mist)" }}
            >
              Nur notwendige
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
