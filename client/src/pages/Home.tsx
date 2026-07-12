import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowRight, BadgeCheck, Bot, Check, Clock3, FileText, HeartPulse, Landmark, ShieldCheck, Smartphone, Sparkles, Zap } from "lucide-react";
import heroBackground from "@/assets/hero-bg-premium.webp";

const SERVICES = [
  { icon: ShieldCheck, de:"Versicherungen", bg:"Застраховки", deText:"Privat, Gesundheit, Kfz und Schutz für jede Lebensphase.", bgText:"Лични, здравни, автомобилни и други застраховки." },
  { icon: Zap, de:"Energie", bg:"Енергия", deText:"Strom- und Gastarife transparent vergleichen.", bgText:"Прозрачно сравнение на ток и газ." },
  { icon: Smartphone, de:"Internet & Mobilfunk", bg:"Интернет и мобилни", deText:"Leistungsstarke Tarife ohne unnötige Kosten.", bgText:"Мощни тарифи без излишни разходи." },
  { icon: Landmark, de:"Banking & Finanzen", bg:"Банки и финанси", deText:"Konten, Kredite und Finanzlösungen im Überblick.", bgText:"Сметки, кредити и финансови решения." },
  { icon: FileText, de:"Steuern & Recht", bg:"Данъци и право", deText:"Digitale Orientierung bei komplexen Fragen.", bgText:"Дигитална ориентация при сложни въпроси." },
  { icon: HeartPulse, de:"Gesundheit", bg:"Здраве", deText:"Passende Absicherung und Services für Ihre Gesundheit.", bgText:"Подходяща защита и услуги за здравето ви." },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { i18n } = useTranslation();
  const isBg = i18n.language.startsWith("bg");
  const c = isBg ? {
    eyebrow:"Независим дигитален консултант", title:<>По-добри тарифи.<br/><em>По-умни решения.</em></>,
    intro:"Tarifberater24 сравнява сложни оферти и ви води към подходящото решение — прозрачно, сигурно и без излишен натиск.",
    compare:"Сравни безплатно", assistant:"Попитай AI асистента", trusted:"Доверие чрез прозрачност", services:"Една платформа. Всички важни решения.",
    serviceIntro:"От застраховки до енергия — структуриран избор, ясни препоръки и човешка подкрепа.", all:"Всички услуги", process:"Просто. Ясно. За минути.",
    steps:["Изберете категория","Отговорете на няколко въпроса","Получете лично предложение"], aiTitle:"Вашият личен AI консултант.", aiText:"Получете незабавна ориентация, сравнете варианти и разберете какво наистина е важно за вашия случай.", start:"Започни разговор",
  } : {
    eyebrow:"Unabhängige digitale Tarifberatung", title:<>Bessere Tarife.<br/><em>Klügere Entscheidungen.</em></>,
    intro:"Tarifberater24 macht komplexe Angebote verständlich und führt Sie zur passenden Entscheidung — transparent, sicher und ohne Verkaufsdruck.",
    compare:"Kostenlos vergleichen", assistant:"KI-Assistent fragen", trusted:"Vertrauen durch Transparenz", services:"Eine Plattform. Alle wichtigen Entscheidungen.",
    serviceIntro:"Von Versicherung bis Energie — strukturierte Auswahl, klare Empfehlungen und persönliche Unterstützung.", all:"Alle Services", process:"Einfach. Klar. In wenigen Minuten.",
    steps:["Kategorie auswählen","Wenige Fragen beantworten","Persönliches Angebot erhalten"], aiTitle:"Ihr persönlicher KI-Tarifberater.", aiText:"Erhalten Sie sofort Orientierung, vergleichen Sie Optionen und verstehen Sie, worauf es in Ihrer Situation wirklich ankommt.", start:"Gespräch starten",
  };

  return <main className="premium-page premium-home">
    <section className="premium-hero">
      <div className="premium-hero-art" style={{backgroundImage:`linear-gradient(90deg, rgba(5,6,7,.98) 0%, rgba(5,6,7,.82) 46%, rgba(5,6,7,.2) 100%), url(${heroBackground})`}} />
      <div className="premium-container premium-hero-grid">
        <div className="premium-hero-copy premium-reveal">
          <span className="premium-eyebrow"><Sparkles size={13}/>{c.eyebrow}</span>
          <h1 className="premium-title">{c.title}</h1>
          <p className="premium-subtitle">{c.intro}</p>
          <div className="premium-hero-actions">
            <button className="premium-button" onClick={()=>navigate("/angebot")}>{c.compare}<ArrowRight size={17}/></button>
            <button className="premium-button secondary" onClick={()=>navigate("/assistant")}><Bot size={17}/>{c.assistant}</button>
          </div>
          <div className="premium-trust-row">{["DSGVO", "SSL", "Unabhängig"].map(item=><span key={item}><Check size={12}/>{item}</span>)}</div>
        </div>
        <div className="premium-hero-panel premium-reveal">
          <span className="premium-panel-label"><BadgeCheck size={15}/>{c.trusted}</span>
          <div className="premium-score"><strong>4.9</strong><span>★★★★★<small>Verifizierte Beratung</small></span></div>
          <hr className="premium-rule"/>
          <div className="premium-metrics"><div><b>24/7</b><small>Digital erreichbar</small></div><div><b>100%</b><small>Transparent</small></div><div><b>0 €</b><small>Vergleichskosten</small></div></div>
        </div>
      </div>
    </section>

    <section className="premium-section"><div className="premium-container">
      <div className="premium-section-head"><div><span className="premium-eyebrow">Services</span><h2>{c.services}</h2><p>{c.serviceIntro}</p></div><button className="premium-button secondary" onClick={()=>navigate("/services")}>{c.all}<ArrowRight size={16}/></button></div>
      <div className="premium-service-grid">
        {SERVICES.map(({icon:Icon,de,bg,deText,bgText},index)=><button key={de} className="premium-card premium-service-card premium-reveal" onClick={()=>navigate("/services")}>
          <div className="premium-card-inner"><span className="premium-icon"><Icon size={22}/></span><span className="premium-card-number">0{index+1}</span><h3>{isBg?bg:de}</h3><p>{isBg?bgText:deText}</p><span className="premium-card-link">Entdecken <ArrowRight size={15}/></span></div>
        </button>)}
      </div>
    </div></section>

    <section className="premium-section premium-process"><div className="premium-container">
      <span className="premium-eyebrow">So funktioniert es</span><h2>{c.process}</h2>
      <div className="premium-steps">{c.steps.map((step,index)=><div key={step}><span>0{index+1}</span><div><Check size={17}/><h3>{step}</h3><p>{index===0?"Versicherung, Energie, Internet oder Finanzen.":index===1?"Sicher, verständlich und ohne unnötige Angaben.":"Transparent erklärt und auf Ihre Ziele abgestimmt."}</p></div></div>)}</div>
    </div></section>

    <section className="premium-section"><div className="premium-container"><div className="premium-ai-panel">
      <div className="premium-ai-orbit"><Bot size={38}/><span/><span/></div>
      <div><span className="premium-eyebrow">Tarifberater24 Intelligence</span><h2>{c.aiTitle}</h2><p>{c.aiText}</p><div className="premium-ai-chips"><span><Clock3 size={13}/> Sofort verfügbar</span><span><ShieldCheck size={13}/> Datenschutzorientiert</span></div></div>
      <button className="premium-button" onClick={()=>navigate("/assistant")}>{c.start}<ArrowRight size={17}/></button>
    </div></div></section>
  </main>;
}
