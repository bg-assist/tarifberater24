import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Datenschutz() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Datenschutzerklärung | Tarifberater24";
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
          Datenschutzerklärung
        </h1>
        <p className="text-sm opacity-50 mb-10">Gemäß DSGVO (EU) 2016/679</p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Verantwortlicher</h2>
            <p className="opacity-80">
              Verantwortlicher im Sinne der DSGVO ist:<br />
              <strong className="text-white">Tarifberater24 — Svetlozar Gitsov</strong><br />
              Hospitalstraße 30, 66798 Wallerfangen<br />
              E-Mail: <a href="mailto:Tarifberatung24@gmail.com" className="text-[var(--color-dusk-violet)] hover:underline">Tarifberatung24@gmail.com</a><br />
              Tel.: +49 15255234853
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Erhobene Daten und Zwecke</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-white font-medium">Datenkategorie</th>
                    <th className="text-left py-2 pr-4 text-white font-medium">Zweck</th>
                    <th className="text-left py-2 text-white font-medium">Rechtsgrundlage</th>
                  </tr>
                </thead>
                <tbody className="opacity-80">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Name, E-Mail, Telefon</td>
                    <td className="py-2 pr-4">Angebotserstellung, Kontaktaufnahme</td>
                    <td className="py-2">Art. 6 Abs. 1 lit. b DSGVO</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">IP-Adresse, Browser-Daten</td>
                    <td className="py-2 pr-4">Technischer Betrieb, Sicherheit</td>
                    <td className="py-2">Art. 6 Abs. 1 lit. f DSGVO</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Angaben zum Bedarf</td>
                    <td className="py-2 pr-4">Partnerweiterleitung, Angebote</td>
                    <td className="py-2">Art. 6 Abs. 1 lit. a DSGVO</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Cookie-Daten</td>
                    <td className="py-2 pr-4">Analyse, Funktionalität</td>
                    <td className="py-2">Art. 6 Abs. 1 lit. a DSGVO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Weitergabe an Dritte</h2>
            <p className="opacity-80">
              Ihre Daten werden nur mit Ihrer ausdrücklichen Einwilligung an Partnerunternehmen weitergegeben, um Ihnen ein passendes Angebot unterbreiten zu können. Wir verkaufen Ihre Daten nicht. Eine Weitergabe erfolgt ausschließlich im Rahmen der Vermittlungsleistung.
            </p>
            <p className="opacity-80 mt-3">
              Wir nutzen folgende Drittanbieter-Dienste (Auftragsverarbeitung gemäß Art. 28 DSGVO):
            </p>
            <ul className="list-disc list-inside opacity-80 mt-2 space-y-1">
              <li>HubSpot Inc. (CRM) — USA, EU-Standardvertragsklauseln</li>
              <li>Hosting-Anbieter (Serverstandort: EU)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Cookies</h2>
            <p className="opacity-80">
              Wir verwenden technisch notwendige Cookies sowie optionale Analyse-Cookies. Sie können Ihre Cookie-Einstellungen jederzeit über unsere{" "}
              <button onClick={() => navigate("/privacy-settings")} className="text-[var(--color-dusk-violet)] hover:underline">
                Datenschutzeinstellungen
              </button>{" "}
              anpassen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Ihre Rechte</h2>
            <ul className="list-disc list-inside opacity-80 space-y-1">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
              <li>Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p className="opacity-80 mt-3">
              Zur Ausübung Ihrer Rechte wenden Sie sich an:{" "}
              <a href="mailto:Tarifberatung24@gmail.com" className="text-[var(--color-dusk-violet)] hover:underline">
                Tarifberatung24@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Speicherdauer</h2>
            <p className="opacity-80">
              Wir speichern Ihre Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Lead-Daten werden nach spätestens 24 Monaten ohne Vertragsabschluss gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Beschwerderecht</h2>
            <p className="opacity-80">
              Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren. Zuständig ist das Unabhängige Datenschutzzentrum Saarland (UDZ Saarland).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Datensicherheit</h2>
            <p className="opacity-80">
              Unsere Website verwendet SSL/TLS-Verschlüsselung. Die Übertragung Ihrer Daten erfolgt verschlüsselt. Wir treffen technische und organisatorische Maßnahmen gemäß Art. 32 DSGVO.
            </p>
          </section>

        </div>

        <p className="mt-12 text-xs opacity-40">
          Stand: Juli 2025 — Diese Datenschutzerklärung wurde mit Sorgfalt erstellt. Für eine rechtssichere Prüfung empfehlen wir die Konsultation eines Datenschutzbeauftragten.
        </p>
      </div>
    </div>
  );
}
