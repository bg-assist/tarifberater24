import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, ChevronUp, ArrowRight, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "Allgemein",
    questions: [
      {
        q: "Was ist Tarifberater24?",
        a: "Tarifberater24 ist ein unabhängiges Vergleichs- und Vermittlungsportal, das Einwanderern in Deutschland hilft, die besten Tarife für Versicherungen, Energie, Internet, Banking und mehr zu finden.",
      },
      {
        q: "Ist die Nutzung kostenlos?",
        a: "Ja, die Nutzung von Tarifberater24 ist für Sie als Verbraucher vollständig kostenlos. Wir finanzieren uns durch Provisionen von Partnerunternehmen, die nur bei erfolgreichem Vertragsabschluss anfallen.",
      },
      {
        q: "Wie verdient Tarifberater24 Geld?",
        a: "Wir erhalten eine Provision von Partnerunternehmen, wenn ein Nutzer über unsere Plattform einen Vertrag abschließt. Diese Provision wird vom Anbieter getragen und erhöht Ihren Preis nicht.",
      },
    ],
  },
  {
    category: "Datenschutz",
    questions: [
      {
        q: "Wie werden meine Daten verwendet?",
        a: "Ihre Daten werden ausschließlich zur Angebotserstellung und Vermittlung verwendet. Wir geben Ihre Daten nur mit Ihrer ausdrücklichen Einwilligung an Partnerunternehmen weiter. Weitere Details finden Sie in unserer Datenschutzerklärung.",
      },
      {
        q: "Kann ich meine Daten löschen lassen?",
        a: "Ja, Sie haben jederzeit das Recht auf Löschung Ihrer Daten gemäß Art. 17 DSGVO. Senden Sie eine E-Mail an Tarifberatung24@gmail.com mit dem Betreff 'Datenlöschung'.",
      },
      {
        q: "Werden meine Daten verkauft?",
        a: "Nein. Wir verkaufen Ihre Daten unter keinen Umständen. Eine Weitergabe erfolgt ausschließlich im Rahmen der Vermittlungsleistung und nur mit Ihrer Einwilligung.",
      },
    ],
  },
  {
    category: "Angebote & Verträge",
    questions: [
      {
        q: "Wie lange dauert es, bis ich ein Angebot erhalte?",
        a: "In der Regel melden wir uns innerhalb von 24 Stunden bei Ihnen. Bei dringenden Anfragen versuchen wir, noch schneller zu reagieren.",
      },
      {
        q: "Bin ich verpflichtet, einen Vertrag abzuschließen?",
        a: "Nein. Alle Angebote sind vollständig unverbindlich. Sie entscheiden selbst, ob und welches Angebot Sie annehmen möchten.",
      },
      {
        q: "Was passiert nach meiner Anfrage?",
        a: "Nach Ihrer Anfrage analysieren wir Ihren Bedarf und kontaktieren Sie mit passenden Angeboten. Wenn Sie ein Angebot auswählen, begleiten wir Sie beim Vertragsabschluss.",
      },
      {
        q: "Kann ich mehrere Bereiche gleichzeitig anfragen?",
        a: "Aktuell können Sie pro Anfrage einen Bereich auswählen. Sie können jedoch mehrere separate Anfragen stellen.",
      },
    ],
  },
  {
    category: "Technisches",
    questions: [
      {
        q: "Welche Browser werden unterstützt?",
        a: "Tarifberater24 funktioniert mit allen modernen Browsern (Chrome, Firefox, Safari, Edge). Wir empfehlen die aktuellste Version für die beste Erfahrung.",
      },
      {
        q: "Gibt es eine mobile App?",
        a: "Unsere Plattform ist vollständig mobiloptimiert und funktioniert auf allen Smartphones und Tablets. Eine native App ist in Planung.",
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-white pr-4">{question}</span>
        <span className="shrink-0 mt-0.5 opacity-40">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-sm opacity-60 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "FAQ | Tarifberater24";
  }, []);

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: "var(--surface-void-canvas)", color: "var(--color-pale-mist)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
            style={{ background: "rgba(52,55,85,0.4)", border: "1px solid rgba(52,55,85,0.6)" }}
          >
            <HelpCircle size={12} />
            Häufige Fragen
          </div>
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-nbarchitekt)" }}
          >
            FAQ
          </h1>
          <p className="text-sm opacity-50">
            Antworten auf die häufigsten Fragen zu Tarifberater24.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {FAQ_ITEMS.map(section => (
            <div key={section.category}>
              <h2 className="text-xs font-semibold uppercase tracking-widest opacity-40 mb-4">
                {section.category}
              </h2>
              <div
                className="rounded-xl overflow-hidden px-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {section.questions.map(item => (
                  <FAQItem key={item.q} question={item.q} answer={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div
          className="mt-10 p-6 rounded-xl text-center"
          style={{ background: "rgba(52,55,85,0.2)", border: "1px solid rgba(52,55,85,0.4)" }}
        >
          <h3 className="text-white font-semibold mb-2">Noch Fragen?</h3>
          <p className="text-sm opacity-50 mb-5">
            Unser Team hilft Ihnen gerne weiter — auf Deutsch, Bulgarisch oder Englisch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--color-dusk-violet)" }}
            >
              Kontakt aufnehmen <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate("/assistant")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--color-pale-mist)" }}
            >
              AI-Assistent fragen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
