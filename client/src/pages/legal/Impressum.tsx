import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Impressum() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Impressum | Tarifberater24";
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-void-canvas)", color: "var(--color-pale-mist)" }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-8 text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={16} />
          Zurück zur Startseite
        </button>

        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
          Impressum
        </h1>
        <p className="text-sm opacity-50 mb-10">Angaben gemäß § 5 TMG</p>

        <section className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Anbieter</h2>
            <div className="space-y-1 text-sm leading-relaxed">
              <p className="text-white font-medium">Tarifberater24</p>
              <p>Svetlozar Gitsov</p>
              <p>Hospitalstraße 30</p>
              <p>66798 Wallerfangen</p>
              <p>Deutschland</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Kontakt</h2>
            <div className="space-y-1 text-sm">
              <p>Telefon: <a href="tel:+4915255234853" className="text-[var(--color-dusk-violet)] hover:underline">+49 15255234853</a></p>
              <p>E-Mail: <a href="mailto:Tarifberatung24@gmail.com" className="text-[var(--color-dusk-violet)] hover:underline">Tarifberatung24@gmail.com</a></p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Steuerliche Angaben</h2>
            <div className="space-y-1 text-sm">
              <p>Steuernummer: 010/224/07003</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Berufsrechtliche Angaben</h2>
            <p className="text-sm leading-relaxed">
              Tarifberater24 ist ein unabhängiger Vergleichs- und Vermittlungsdienst. Wir sind kein zugelassener Versicherungsvermittler gemäß § 34d GewO. Für versicherungsrechtliche Beratung empfehlen wir die Konsultation eines zugelassenen Versicherungsmaklers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Haftung für Inhalte</h2>
            <p className="text-sm leading-relaxed opacity-80">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Haftung für Links</h2>
            <p className="text-sm leading-relaxed opacity-80">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Urheberrecht</h2>
            <p className="text-sm leading-relaxed opacity-80">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Online-Streitbeilegung</h2>
            <p className="text-sm leading-relaxed opacity-80">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-dusk-violet)] hover:underline">
                https://ec.europa.eu/consumers/odr/
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>

        <p className="mt-12 text-xs opacity-40">Stand: Juli 2025</p>
      </div>
    </div>
  );
}
