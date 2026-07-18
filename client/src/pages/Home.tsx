import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, ShieldCheck, Zap, Smartphone, Landmark, FileText, HeartPulse, Home, DollarSign, Wrench, Users, BookOpen, AlertCircle } from "lucide-react";

// Main services grid (Check24 style)
const MAIN_SERVICES = [
  { icon: ShieldCheck, de: "Versicherungen", bg: "Застраховки", id: "insurance" },
  { icon: Zap, de: "Energie", bg: "Енергия", id: "energy" },
  { icon: Smartphone, de: "Internet & Mobilfunk", bg: "Интернет & Мобилни", id: "internet" },
  { icon: Landmark, de: "Banking & Finanzen", bg: "Банки & Финанси", id: "banking" },
  { icon: FileText, de: "Steuern & Recht", bg: "Данъци & Право", id: "legal" },
  { icon: HeartPulse, de: "Gesundheit", bg: "Здраве", id: "health" },
];

// Paid services (institutional help)
const PAID_SERVICES = [
  { icon: Home, de: "Jobcenter Antrag", bg: "Jobcenter Заявка", id: "jobcenter", price: "€29" },
  { icon: DollarSign, de: "Finanzamt Hilfe", bg: "Finanzamt Помощ", id: "finanzamt", price: "€39" },
  { icon: Wrench, de: "Zulassung Stelle", bg: "Zulassung Място", id: "zulassung", price: "€49" },
  { icon: Users, de: "Behörden Beratung", bg: "Администрация Консултация", id: "authorities", price: "€25" },
  { icon: BookOpen, de: "Dokument Hilfe", bg: "Документ Помощ", id: "documents", price: "€19" },
  { icon: AlertCircle, de: "Rechtliche Fragen", bg: "Правни Въпроси", id: "legal_help", price: "€35" },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { t, i18n } = useTranslation();
  const isBg = i18n.language.startsWith("bg");

  return (
    <main className="check24-home">
      {/* Header with search */}
      <section className="check24-header">
        <div className="check24-container">
          <h1 className="check24-logo-text">Tarifberater24</h1>
          <input 
            type="text" 
            placeholder={isBg ? "Търсете или питайте" : "Suchen oder fragen"} 
            className="check24-search"
          />
        </div>
      </section>

      {/* Main services grid */}
      <section className="check24-services">
        <div className="check24-container">
          <h2 className="check24-section-title">
            {isBg ? "Сравни тарифи" : "Tarife vergleichen"}
          </h2>
          <div className="check24-grid check24-grid-6">
            {MAIN_SERVICES.map(({ icon: Icon, de, bg, id }) => (
              <button
                key={id}
                className="check24-card"
                onClick={() => navigate("/services")}
              >
                <div className="check24-card-icon">
                  <Icon size={32} />
                </div>
                <h3 className="check24-card-title">{isBg ? bg : de}</h3>
                <ArrowRight size={16} className="check24-card-arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Paid services section */}
      <section className="check24-paid-services">
        <div className="check24-container">
          <div className="check24-paid-header">
            <h2 className="check24-section-title">
              {isBg ? "Помощ с документи и институции" : "Hilfe mit Dokumenten & Behörden"}
            </h2>
            <p className="check24-section-subtitle">
              {isBg 
                ? "Профессионална помощ за сложни административни процеси" 
                : "Professionelle Unterstützung bei komplexen administrativen Prozessen"}
            </p>
          </div>
          <div className="check24-grid check24-grid-6">
            {PAID_SERVICES.map(({ icon: Icon, de, bg, id, price }) => (
              <button
                key={id}
                className="check24-card check24-card-paid"
                onClick={() => navigate("/services")}
              >
                <div className="check24-card-icon">
                  <Icon size={32} />
                </div>
                <h3 className="check24-card-title">{isBg ? bg : de}</h3>
                <span className="check24-card-price">{price}</span>
                <ArrowRight size={16} className="check24-card-arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News section (compact) */}
      <section className="check24-news">
        <div className="check24-container">
          <div className="check24-news-header">
            <h2 className="check24-section-title">
              {isBg ? "Новини за българи в Германия" : "Nachrichten für Bulgaren in Deutschland"}
            </h2>
            <button 
              className="check24-link-button"
              onClick={() => navigate("/news")}
            >
              {isBg ? "Всички новини" : "Alle Nachrichten"} <ArrowRight size={16} />
            </button>
          </div>
          <div className="check24-news-grid">
            {/* Placeholder for news items */}
            <div className="check24-news-item">
              <span className="check24-news-date">{isBg ? "Днес" : "Heute"}</span>
              <p>{isBg ? "Важна информация за данъци в Германия" : "Wichtige Informationen zu Steuern in Deutschland"}</p>
            </div>
            <div className="check24-news-item">
              <span className="check24-news-date">{isBg ? "Вчера" : "Gestern"}</span>
              <p>{isBg ? "Нови тарифи за енергия" : "Neue Energietarife verfügbar"}</p>
            </div>
            <div className="check24-news-item">
              <span className="check24-news-date">{isBg ? "Преди 2 дни" : "Vor 2 Tagen"}</span>
              <p>{isBg ? "Промени в застраховките" : "Änderungen bei Versicherungen"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="check24-footer-cta">
        <div className="check24-container">
          <h2>{isBg ? "Готови ли сте да спестите?" : "Bereit zu sparen?"}</h2>
          <button 
            className="check24-button-primary"
            onClick={() => navigate("/angebot")}
          >
            {isBg ? "Начни сравнение" : "Jetzt vergleichen"} <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
