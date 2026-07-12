import { AlertCircle, ArrowRight, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <main className="premium-state-page">
      <section className="premium-state-card">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(212,175,55,.08)", border: "1px solid rgba(212,175,55,.28)" }}
        >
          <AlertCircle size={30} style={{ color: "var(--premium-gold-soft)" }} />
        </div>

        <span className="premium-eyebrow">Fehler 404</span>
        <h1
          className="mt-5 mb-3 text-white"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(38px,8vw,64px)", fontWeight: 400, letterSpacing: "-.045em" }}
        >
          Seite nicht gefunden
        </h1>
        <p className="mb-8" style={{ color: "#9fa2a8", lineHeight: 1.75 }}>
          Die gewünschte Seite wurde verschoben, gelöscht oder ist nicht verfügbar.
        </p>

        <button onClick={() => setLocation("/")} className="premium-button">
          <Home size={16} /> Zur Startseite <ArrowRight size={15} />
        </button>
      </section>
    </main>
  );
}
