import { useLocation } from "wouter";
import { ArrowRight, BriefcaseBusiness, Building2, Car, FileCheck2, GraduationCap, HeartPulse, House, Landmark, Scale, ShieldCheck, Smartphone, Sparkles, Wifi, Zap } from "lucide-react";

const GROUPS = [
  { number:"01", title:"Versicherungen", subtitle:"Schutz, der zu Ihrem Leben passt.", icon:ShieldCheck, items:[
    {icon:Car,title:"Kfz-Versicherung",text:"Leistung und Beitrag unabhängig vergleichen.",path:"/insurance"},
    {icon:House,title:"Hausrat & Haftpflicht",text:"Sachwerte und private Risiken sinnvoll absichern.",path:"/insurance"},
    {icon:HeartPulse,title:"Gesundheit",text:"GKV, PKV und Zusatzschutz verständlich erklärt.",path:"/insurance"}]},
  { number:"02", title:"Energie & Zuhause", subtitle:"Laufende Kosten nachhaltig optimieren.", icon:Zap, items:[
    {icon:Zap,title:"Strom & Gas",text:"Faire Tarife passend zu Verbrauch und Region.",path:"/angebot"},
    {icon:Wifi,title:"Internet",text:"DSL, Kabel und Glasfaser transparent vergleichen.",path:"/angebot"},
    {icon:Smartphone,title:"Mobilfunk",text:"Datenvolumen und Netz ohne unnötige Extras.",path:"/angebot"}]},
  { number:"03", title:"Finanzen", subtitle:"Klare Entscheidungen für Ihre finanzielle Zukunft.", icon:Landmark, items:[
    {icon:Building2,title:"Girokonto",text:"Konten, Gebühren und Leistungen im Überblick.",path:"/assistant"},
    {icon:BriefcaseBusiness,title:"Kredit & Finanzierung",text:"Konditionen und Gesamtkosten richtig einordnen.",path:"/assistant"},
    {icon:Scale,title:"Steuern",text:"Digitale Orientierung für Ihre Steuerfragen.",path:"/assistant"}]},
  { number:"04", title:"Dokumente & Recht", subtitle:"Sicher durch deutsche Prozesse und Anforderungen.", icon:FileCheck2, items:[
    {icon:FileCheck2,title:"Anmeldung & Aufenthalt",text:"Schritte, Unterlagen und Fristen verständlich erklärt.",path:"/assistant"},
    {icon:GraduationCap,title:"Anerkennung",text:"Abschlüsse und Qualifikationen richtig anerkennen lassen.",path:"/assistant"},
    {icon:Scale,title:"Rechtliche Orientierung",text:"Erste Einordnung zu Arbeit, Miete und Verträgen.",path:"/assistant"}]},
];

export default function Services(){
  const [,navigate]=useLocation();
  return <main className="premium-page premium-services-page">
    <header className="premium-page-header"><div className="premium-container premium-page-header-grid"><div><span className="premium-eyebrow"><Sparkles size={13}/> Tarifwelten</span><h1>Komplexes verstehen.<br/><em>Richtig entscheiden.</em></h1><p>Alle wichtigen Vergleichs- und Beratungsleistungen an einem Ort — unabhängig, strukturiert und auf Ihre Situation abgestimmt.</p></div><div className="premium-header-stat"><strong>12+</strong><span>Beratungsbereiche</span><small>Eine Plattform für Ihre wichtigsten Entscheidungen in Deutschland.</small></div></div></header>
    <section className="premium-section"><div className="premium-container premium-service-groups">
      {GROUPS.map(group=>{const GroupIcon=group.icon;return <article className="premium-service-group" key={group.number}>
        <div className="premium-group-heading"><span>{group.number}</span><div className="premium-icon"><GroupIcon size={23}/></div><div><h2>{group.title}</h2><p>{group.subtitle}</p></div></div>
        <div className="premium-group-items">{group.items.map(item=>{const Icon=item.icon;return <button key={item.title} onClick={()=>navigate(item.path)}><span className="premium-icon small"><Icon size={17}/></span><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowRight size={16}/></button>})}</div>
      </article>})}
    </div></section>
    <section className="premium-section premium-service-cta"><div className="premium-container"><div><span className="premium-eyebrow">Persönliche Empfehlung</span><h2>Nicht sicher, wo Sie starten sollen?</h2><p>Unser KI-Assistent analysiert Ihr Anliegen und führt Sie zum passenden nächsten Schritt.</p></div><button className="premium-button" onClick={()=>navigate("/assistant")}>Assistent starten <ArrowRight size={16}/></button></div></section>
  </main>;
}
