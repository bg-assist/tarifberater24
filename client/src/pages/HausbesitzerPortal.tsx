import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sun, Zap, Home, Shield, Building2, Flame } from "lucide-react";

const PORTAL_SECTIONS = [
  {
    id: "solar",
    icon: Sun,
    title: "Photovoltaik & Solar",
    subtitle: "Kostenlos Angebote vergleichen",
    description: "Nutzen Sie die Kraft der Sonne. Vergleichen Sie Solaranlagen und Speichersysteme von zertifizierten Fachbetrieben.",
    color: "from-amber-500/10 to-orange-500/5",
    borderColor: "border-amber-500/20",
  },
  {
    id: "energy",
    icon: Zap,
    title: "Strom & Gas sparen",
    subtitle: "Die besten Tarife finden",
    description: "Finden Sie die günstigsten Strom- und Gastarife in Ihrer Region. Wechsel in wenigen Minuten.",
    color: "from-blue-500/10 to-cyan-500/5",
    borderColor: "border-blue-500/20",
  },
  {
    id: "smarthome",
    icon: Home,
    title: "Smart Home",
    subtitle: "Energie sparen mit smarter Technik",
    description: "Intelligente Systeme für Heizung, Beleuchtung und Sicherheit. Sparen Sie Energie und erhöhen Sie Ihren Komfort.",
    color: "from-green-500/10 to-emerald-500/5",
    borderColor: "border-green-500/20",
  },
  {
    id: "insurance",
    icon: Shield,
    title: "Versicherungen",
    subtitle: "Gebäude-, Hausrat- und PV-Versicherungen",
    description: "Umfassender Schutz für Ihr Haus und Ihre Investitionen. Vergleichen Sie Policen transparent und sparen Sie.",
    color: "from-red-500/10 to-pink-500/5",
    borderColor: "border-red-500/20",
  },
  {
    id: "financing",
    icon: Building2,
    title: "Baufinanzierung",
    subtitle: "Hypotheken und Immobilienkredite vergleichen",
    description: "Finden Sie die beste Finanzierung für Ihr Eigenheim. Vergleichen Sie Zinsen und Konditionen von Banken.",
    color: "from-purple-500/10 to-indigo-500/5",
    borderColor: "border-purple-500/20",
  },
  {
    id: "heating",
    icon: Flame,
    title: "Wärmepumpe & Heizung",
    subtitle: "Modernisieren und Energiekosten senken",
    description: "Ersetzen Sie alte Heizungen durch effiziente Wärmepumpen. Nutzen Sie Förderprogramme und sparen Sie langfristig.",
    color: "from-orange-500/10 to-red-500/5",
    borderColor: "border-orange-500/20",
  },
];

export default function HausbesitzerPortal() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <main className="premium-page premium-hausbesitzer-portal">
      {/* Hero Section */}
      <section className="premium-section premium-hero-section">
        <div className="premium-container">
          <div className="premium-hero-content premium-reveal">
            <span className="premium-eyebrow">🏠 Hausbesitzer Portal</span>
            <h1 className="premium-title">Sparen & Modernisieren</h1>
            <p className="premium-subtitle">
              Alles für Ihr Eigenheim an einem Ort. Vergleichen Sie Tarife, finden Sie Fördermittel und modernisieren Sie Ihr Haus — komplett kostenlos und unverbindlich.
            </p>
            <div className="premium-hero-actions">
              <button className="premium-button" onClick={() => navigate("/get-offer")}>
                Kostenlos vergleichen
                <ArrowRight size={17} />
              </button>
              <button className="premium-button secondary" onClick={() => navigate("/assistant")}>
                Fragen stellen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Cards Grid */}
      <section className="premium-section">
        <div className="premium-container">
          <div className="premium-portal-grid">
            {PORTAL_SECTIONS.map(({ id, icon: Icon, title, subtitle, description, color, borderColor }) => (
              <div
                key={id}
                className={`premium-portal-card premium-reveal border ${borderColor} bg-gradient-to-br ${color} backdrop-blur-sm`}
              >
                <div className="premium-portal-card-header">
                  <div className="premium-portal-icon">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <div className="premium-portal-title-group">
                    <h3 className="premium-portal-card-title">{title}</h3>
                    <p className="premium-portal-card-subtitle">{subtitle}</p>
                  </div>
                </div>

                <p className="premium-portal-card-description">{description}</p>

                <div className="premium-portal-card-image">
                  <div className="premium-portal-placeholder">
                    <div className="premium-portal-placeholder-icon">
                      <Icon size={48} strokeWidth={1} opacity={0.2} />
                    </div>
                  </div>
                </div>

                <button className="premium-portal-cta">
                  Mehr erfahren
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="premium-section premium-trust-section">
        <div className="premium-container">
          <div className="premium-trust-grid">
            <div className="premium-trust-item premium-reveal">
              <div className="premium-trust-icon">✓</div>
              <h4>100% kostenlos</h4>
              <p>Keine versteckten Gebühren oder Kosten</p>
            </div>
            <div className="premium-trust-item premium-reveal">
              <div className="premium-trust-icon">✓</div>
              <h4>Unverbindlich</h4>
              <p>Sie entscheiden selbst, ob Sie einen Vertrag abschließen</p>
            </div>
            <div className="premium-trust-item premium-reveal">
              <div className="premium-trust-icon">✓</div>
              <h4>DSGVO-konform</h4>
              <p>Ihre Daten sind sicher und geschützt</p>
            </div>
            <div className="premium-trust-item premium-reveal">
              <div className="premium-trust-icon">✓</div>
              <h4>Unabhängig</h4>
              <p>Wir arbeiten mit vielen Partnern, nicht nur einem</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="premium-section premium-cta-section">
        <div className="premium-container">
          <div className="premium-cta-content premium-reveal">
            <h2>Bereit zu sparen?</h2>
            <p>Starten Sie jetzt Ihren kostenlosen Vergleich und finden Sie die besten Angebote für Ihr Haus.</p>
            <button className="premium-button" onClick={() => navigate("/get-offer")}>
              Jetzt vergleichen
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
