import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, Home, DollarSign, Wrench, Users, BookOpen, AlertCircle, Check } from "lucide-react";

const PAID_SERVICES_DETAILS = [
  {
    icon: Home,
    de: "Jobcenter Antrag",
    bg: "Jobcenter Заявка",
    id: "jobcenter",
    price: "€29",
    deDesc: "Professionelle Hilfe bei Jobcenter-Anträgen, Widersprüchen und Dokumentation.",
    bgDesc: "Професионална помощ с Jobcenter заявки, възражения и документация.",
  },
  {
    icon: DollarSign,
    de: "Finanzamt Hilfe",
    bg: "Finanzamt Помощ",
    id: "finanzamt",
    price: "€39",
    deDesc: "Unterstützung bei Steuererklärungen, Einsprüchen und Behördenkommunikation.",
    bgDesc: "Помощ със данъчни декларации, възражения и административна комуникация.",
  },
  {
    icon: Wrench,
    de: "Zulassung Stelle",
    bg: "Zulassung Място",
    id: "zulassung",
    price: "€49",
    deDesc: "Komplette Unterstützung bei Fahrzeugzulassung, Umschreibung und Dokumentation.",
    bgDesc: "Пълна помощ с регистрация на автомобили, преписване и документи.",
  },
  {
    icon: Users,
    de: "Behörden Beratung",
    bg: "Администрация Консултация",
    id: "authorities",
    price: "€25",
    deDesc: "Allgemeine Beratung für Behördengänge, Anträge und administrative Prozesse.",
    bgDesc: "Обща консултация за административни процеси и заявки.",
  },
  {
    icon: BookOpen,
    de: "Dokument Hilfe",
    bg: "Документ Помощ",
    id: "documents",
    price: "€19",
    deDesc: "Hilfe bei Dokumentenübersetzung, Beglaubigung und Vorbereitung.",
    bgDesc: "Помощ с преводи на документи, заверяване и подготовка.",
  },
  {
    icon: AlertCircle,
    de: "Rechtliche Fragen",
    bg: "Правни Въпроси",
    id: "legal_help",
    price: "€35",
    deDesc: "Konsultation mit Fachleuten für komplexe rechtliche Fragen und Probleme.",
    bgDesc: "Консултация с експерти за сложни правни въпроси.",
  },
];

export default function PaidServices() {
  const [, navigate] = useLocation();
  const { i18n } = useTranslation();
  const isBg = i18n.language.startsWith("bg");

  return (
    <main className="check24-home">
      {/* Header */}
      <section className="check24-header">
        <div className="check24-container">
          <button
            onClick={() => navigate("/")}
            className="check24-back-button"
          >
            ← {isBg ? "Назад" : "Zurück"}
          </button>
          <h1 className="check24-logo-text">
            {isBg ? "Помощ с документи" : "Dokumenten Hilfe"}
          </h1>
        </div>
      </section>

      {/* Services grid */}
      <section className="check24-services">
        <div className="check24-container">
          <p className="check24-section-subtitle">
            {isBg
              ? "Професионална помощ за административни процеси"
              : "Professionelle Unterstützung bei administrativen Prozessen"}
          </p>
          <div className="check24-grid check24-grid-3">
            {PAID_SERVICES_DETAILS.map(({ icon: Icon, de, bg, id, price, deDesc, bgDesc }) => (
              <div key={id} className="check24-service-card">
                <div className="check24-service-header">
                  <div className="check24-service-icon">
                    <Icon size={40} />
                  </div>
                  <span className="check24-service-price">{price}</span>
                </div>
                <h3 className="check24-service-title">{isBg ? bg : de}</h3>
                <p className="check24-service-desc">{isBg ? bgDesc : deDesc}</p>
                <ul className="check24-service-features">
                  <li><Check size={14} /> {isBg ? "Бързо" : "Schnell"}</li>
                  <li><Check size={14} /> {isBg ? "Надежно" : "Zuverlässig"}</li>
                  <li><Check size={14} /> {isBg ? "На български" : "Auf Deutsch"}</li>
                </ul>
                <button
                  className="check24-service-button"
                  onClick={() => navigate("/angebot")}
                >
                  {isBg ? "Поръчай" : "Jetzt buchen"} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="check24-how-it-works">
        <div className="check24-container">
          <h2 className="check24-section-title">
            {isBg ? "Как работи" : "So funktioniert es"}
          </h2>
          <div className="check24-steps-grid">
            <div className="check24-step">
              <span className="check24-step-number">1</span>
              <h3>{isBg ? "Изберете услугата" : "Service wählen"}</h3>
              <p>{isBg ? "Изберете нужната вам помощ" : "Wählen Sie die benötigte Hilfe"}</p>
            </div>
            <div className="check24-step">
              <span className="check24-step-number">2</span>
              <h3>{isBg ? "Попълнете формата" : "Formular ausfüllen"}</h3>
              <p>{isBg ? "Дайте нужната информация" : "Geben Sie Ihre Informationen ein"}</p>
            </div>
            <div className="check24-step">
              <span className="check24-step-number">3</span>
              <h3>{isBg ? "Платете" : "Bezahlen"}</h3>
              <p>{isBg ? "Безопасна онлайн плащане" : "Sichere Online-Zahlung"}</p>
            </div>
            <div className="check24-step">
              <span className="check24-step-number">4</span>
              <h3>{isBg ? "Получете помощ" : "Hilfe erhalten"}</h3>
              <p>{isBg ? "Експерт ще се свърже с вас" : "Ein Experte wird sich mit Ihnen in Verbindung setzen"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="check24-footer-cta">
        <div className="check24-container">
          <h2>{isBg ? "Нужна ви е помощ?" : "Brauchen Sie Hilfe?"}</h2>
          <button
            className="check24-button-primary"
            onClick={() => navigate("/angebot")}
          >
            {isBg ? "Начни сега" : "Jetzt starten"} <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
