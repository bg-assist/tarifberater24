import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function AGB() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "AGB | Tarifberater24";
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

        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="text-sm opacity-50 mb-10">Tarifberater24 — Stand: Juli 2025</p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">§ 1 Geltungsbereich</h2>
            <p className="opacity-80">
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Leistungen von Tarifberater24 (Svetlozar Gitsov, Hospitalstraße 30, 66798 Wallerfangen) gegenüber Nutzern der Plattform unter der Domain bg-assist.de und zugehöriger Subdomains.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">§ 2 Leistungsbeschreibung</h2>
            <p className="opacity-80">
              Tarifberater24 betreibt ein unabhängiges Vergleichs- und Vermittlungsportal. Wir stellen Nutzern Informationen zu Tarifen und Produkten verschiedener Anbieter bereit und vermitteln auf Wunsch Kontakte zu Partnerunternehmen. Tarifberater24 ist kein Vertragspartner der vermittelten Leistungen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">§ 3 Vergütung und Provision</h2>
            <p className="opacity-80">
              Die Nutzung der Plattform ist für Verbraucher kostenlos. Tarifberater24 erhält von Partnerunternehmen eine Provision, wenn ein Nutzer über unsere Plattform einen Vertrag abschließt. Diese Vergütungsstruktur beeinflusst nicht die Objektivität unserer Empfehlungen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">§ 4 Registrierung und Nutzerkonto</h2>
            <p className="opacity-80">
              Die Nutzung bestimmter Funktionen setzt eine Registrierung voraus. Der Nutzer ist verpflichtet, wahrheitsgemäße Angaben zu machen und seine Zugangsdaten vertraulich zu behandeln. Tarifberater24 behält sich das Recht vor, Konten bei Missbrauch zu sperren.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">§ 5 Haftungsbeschränkung</h2>
            <p className="opacity-80">
              Tarifberater24 haftet nicht für die Richtigkeit, Vollständigkeit oder Aktualität der von Partnerunternehmen bereitgestellten Informationen. Die Plattform übernimmt keine Haftung für Schäden, die durch die Nutzung vermittelter Produkte entstehen. Für Schäden aus einfacher Fahrlässigkeit haftet Tarifberater24 nur bei Verletzung wesentlicher Vertragspflichten.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">§ 6 Datenschutz</h2>
            <p className="opacity-80">
              Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{" "}
              <button onClick={() => navigate("/datenschutz")} className="text-[var(--color-dusk-violet)] hover:underline">
                Datenschutzerklärung
              </button>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">§ 7 Änderungen der AGB</h2>
            <p className="opacity-80">
              Tarifberater24 behält sich vor, diese AGB jederzeit mit Wirkung für die Zukunft zu ändern. Nutzer werden über wesentliche Änderungen per E-Mail informiert. Die weitere Nutzung der Plattform nach Inkrafttreten der Änderungen gilt als Zustimmung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">§ 8 Anwendbares Recht und Gerichtsstand</h2>
            <p className="opacity-80">
              Es gilt deutsches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, Saarlouis.
            </p>
          </section>

        </div>

        <p className="mt-12 text-xs opacity-40">
          Diese AGB wurden mit Sorgfalt erstellt. Für eine rechtssichere Prüfung empfehlen wir die Konsultation eines Rechtsanwalts.
        </p>
      </div>
    </div>
  );
}
