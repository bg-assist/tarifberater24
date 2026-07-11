import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Info } from "lucide-react";

export default function AffiliateDisclosure() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Affiliate-Offenlegung | Tarifberater24";
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-void-canvas)", color: "var(--color-pale-mist)" }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-8 text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={16} />
          Zurück zur Startseite
        </button>

        {/* Info Banner */}
        <div
          className="flex items-start gap-3 p-4 rounded-xl mb-8"
          style={{ background: "rgba(52,55,85,0.4)", border: "1px solid rgba(52,55,85,0.8)" }}
        >
          <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--color-dusk-violet)" }} />
          <p className="text-sm opacity-80">
            Transparenz ist uns wichtig. Diese Seite erklärt, wie Tarifberater24 Einnahmen erzielt und wie das unsere Empfehlungen beeinflusst.
          </p>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
          Affiliate- & Partner-Offenlegung
        </h1>
        <p className="text-sm opacity-50 mb-10">Transparenz über unser Geschäftsmodell</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Wie wir Geld verdienen</h2>
            <p className="opacity-80">
              Tarifberater24 ist ein kostenloser Vergleichs- und Vermittlungsdienst für Verbraucher. Wir finanzieren uns ausschließlich durch Provisionen, die wir von Partnerunternehmen erhalten, wenn ein Nutzer über unsere Plattform einen Vertrag abschließt.
            </p>
            <p className="opacity-80 mt-3">
              <strong className="text-white">Für Sie als Nutzer entstehen keine zusätzlichen Kosten.</strong> Die Provision wird vom Partnerunternehmen getragen und beeinflusst den Preis Ihres Vertrages nicht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Partnerbeziehungen</h2>
            <p className="opacity-80">
              Wir arbeiten mit verschiedenen Anbietern in folgenden Bereichen zusammen:
            </p>
            <ul className="list-disc list-inside opacity-80 mt-2 space-y-1">
              <li>Versicherungen (Kfz, Haftpflicht, Hausrat, Krankenversicherung)</li>
              <li>Energie (Strom, Gas)</li>
              <li>Internet & Telekommunikation</li>
              <li>Banking & Finanzprodukte</li>
              <li>Rechts- und Steuerberatung</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Unabhängigkeit unserer Empfehlungen</h2>
            <p className="opacity-80">
              Unsere Empfehlungen basieren auf den Angaben und Bedürfnissen des Nutzers. Wir bemühen uns, stets das beste Angebot für Ihre individuelle Situation zu finden. Die Höhe einer Provision beeinflusst nicht, welche Angebote wir Ihnen zeigen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Kennzeichnung von Partnerangeboten</h2>
            <p className="opacity-80">
              Angebote, bei denen eine Partnerbeziehung besteht, werden auf unserer Plattform entsprechend gekennzeichnet. Wir halten uns an die Vorgaben des UWG (Gesetz gegen den unlauteren Wettbewerb) zur Kennzeichnungspflicht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Fragen?</h2>
            <p className="opacity-80">
              Bei Fragen zu unseren Partnerbeziehungen oder unserem Geschäftsmodell wenden Sie sich gerne an:{" "}
              <a href="mailto:Tarifberatung24@gmail.com" className="text-[var(--color-dusk-violet)] hover:underline">
                Tarifberatung24@gmail.com
              </a>
            </p>
          </section>

        </div>

        <p className="mt-12 text-xs opacity-40">Stand: Juli 2025</p>
      </div>
    </div>
  );
}
