import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicy() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Cookie-Richtlinie | Tarifberater24";
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-void-canvas)", color: "var(--color-pale-mist)" }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-8 text-sm opacity-60 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={16} />
          Zurück
        </button>

        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
          Cookie-Richtlinie
        </h1>
        <p className="text-sm opacity-50 mb-10">Gemäß ePrivacy-Richtlinie und DSGVO</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Was sind Cookies?</h2>
            <p className="opacity-80">
              Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden. Sie ermöglichen es der Website, Ihren Browser beim nächsten Besuch wiederzuerkennen und gespeicherte Einstellungen abzurufen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Welche Cookies verwenden wir?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-white font-medium">Cookie</th>
                    <th className="text-left py-2 pr-4 text-white font-medium">Typ</th>
                    <th className="text-left py-2 pr-4 text-white font-medium">Zweck</th>
                    <th className="text-left py-2 text-white font-medium">Dauer</th>
                  </tr>
                </thead>
                <tbody className="opacity-80">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-xs">session_token</td>
                    <td className="py-2 pr-4">Notwendig</td>
                    <td className="py-2 pr-4">Authentifizierung</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-xs">cookie_consent</td>
                    <td className="py-2 pr-4">Notwendig</td>
                    <td className="py-2 pr-4">Cookie-Einstellungen</td>
                    <td className="py-2">1 Jahr</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono text-xs">_analytics</td>
                    <td className="py-2 pr-4">Analyse</td>
                    <td className="py-2 pr-4">Nutzungsstatistiken</td>
                    <td className="py-2">2 Jahre</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">_marketing</td>
                    <td className="py-2 pr-4">Marketing</td>
                    <td className="py-2 pr-4">Personalisierung</td>
                    <td className="py-2">1 Jahr</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Cookies verwalten</h2>
            <p className="opacity-80">
              Sie können Ihre Cookie-Einstellungen jederzeit über unsere{" "}
              <button onClick={() => navigate("/privacy-settings")} className="text-[var(--color-dusk-violet)] hover:underline">
                Datenschutzeinstellungen
              </button>{" "}
              anpassen. Außerdem können Sie Cookies in Ihrem Browser deaktivieren. Bitte beachten Sie, dass dies die Funktionalität der Website einschränken kann.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">Drittanbieter-Cookies</h2>
            <p className="opacity-80">
              Wir nutzen HubSpot für unser CRM. HubSpot kann eigene Cookies setzen, um Formulareingaben zu verarbeiten. Weitere Informationen finden Sie in der{" "}
              <a href="https://legal.hubspot.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-dusk-violet)] hover:underline">
                Datenschutzerklärung von HubSpot
              </a>
              .
            </p>
          </section>

        </div>

        <p className="mt-12 text-xs opacity-40">Stand: Juli 2025</p>
      </div>
    </div>
  );
}
