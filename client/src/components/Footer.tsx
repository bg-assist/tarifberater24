import { useLocation } from "wouter";

const LEGAL_LINKS = [
  { label: "Impressum", path: "/impressum" },
  { label: "Datenschutz", path: "/datenschutz" },
  { label: "AGB", path: "/agb" },
  { label: "Cookie-Richtlinie", path: "/cookies" },
  { label: "Affiliate-Offenlegung", path: "/affiliate-disclosure" },
  { label: "Datenschutzeinstellungen", path: "/privacy-settings" },
];

const SERVICE_LINKS = [
  { label: "Angebot anfragen", path: "/get-offer" },
  { label: "Über uns", path: "/about" },
  { label: "FAQ", path: "/faq" },
  { label: "Kontakt", path: "/contact" },
];

export default function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer
      className="mt-auto border-t"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full border flex items-center justify-center"
                style={{ borderColor: "var(--color-dusk-violet)" }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-dusk-violet)" }} />
              </div>
              <span
                className="font-bold text-white text-xs tracking-widest uppercase"
                style={{ fontFamily: "var(--font-nbarchitekt)" }}
              >
                Tarifberater24
              </span>
            </div>
            <p className="text-xs opacity-50 leading-relaxed max-w-xs">
              Ihr unabhängiger Vergleichs- und Vermittlungsdienst für Versicherungen, Energie, Internet und mehr in Deutschland.
            </p>
            <p className="text-xs opacity-30 mt-3">
              Hospitalstraße 30, 66798 Wallerfangen
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4 opacity-60">Dienste</p>
            <ul className="space-y-2">
              {SERVICE_LINKS.map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-white uppercase tracking-widest mb-4 opacity-60">Rechtliches</p>
            <ul className="space-y-2">
              {LEGAL_LINKS.map(link => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs opacity-30">
            © {new Date().getFullYear()} Tarifberater24 — Svetlozar Gitsov. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs opacity-50"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              SSL gesichert
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs opacity-50"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              DSGVO konform
            </div>
          </div>
        </div>

        {/* Affiliate disclaimer */}
        <p className="mt-4 text-xs opacity-25 leading-relaxed">
          * Tarifberater24 erhält Provisionen von Partnerunternehmen bei erfolgreichem Vertragsabschluss. Dies beeinflusst nicht die Objektivität unserer Empfehlungen. Weitere Informationen in unserer{" "}
          <button onClick={() => navigate("/affiliate-disclosure")} className="underline hover:opacity-60">
            Affiliate-Offenlegung
          </button>
          .
        </p>
      </div>
    </footer>
  );
}
