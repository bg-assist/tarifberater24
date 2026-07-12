import { useLocation } from "wouter";
import { ArrowUpRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

const LEGAL_LINKS = [
  { label: "Impressum", path: "/impressum" },
  { label: "Datenschutz", path: "/datenschutz" },
  { label: "AGB", path: "/agb" },
  { label: "Cookie-Richtlinie", path: "/cookies" },
  { label: "Affiliate-Offenlegung", path: "/affiliate-disclosure" },
  { label: "Datenschutzeinstellungen", path: "/privacy-settings" },
];
const SERVICE_LINKS = [
  { label: "Angebot anfragen", path: "/get-offer" }, { label: "Alle Services", path: "/services" },
  { label: "KI-Assistent", path: "/assistant" }, { label: "Über uns", path: "/about" },
  { label: "FAQ", path: "/faq" }, { label: "Kontakt", path: "/contact" },
];

export default function Footer() {
  const [, navigate] = useLocation();
  return (
    <footer className="premium-footer">
      <div className="premium-container">
        <div className="premium-footer-cta">
          <div><span className="premium-eyebrow"><Sparkles size={13} /> Persönliche Empfehlung</span><h2>Bereit für einen besseren Tarif?</h2><p>Unverbindlich vergleichen. Transparent entscheiden. Dauerhaft sparen.</p></div>
          <button className="premium-button" onClick={() => navigate("/get-offer")}>Kostenlos starten <ArrowUpRight size={17} /></button>
        </div>
        <div className="premium-footer-grid">
          <div className="premium-footer-brand">
            <div className="premium-brand"><span className="premium-brand-mark"><ShieldCheck size={19} /></span><span className="premium-brand-copy"><strong>Tarifberater<span>24</span></strong><small>Unabhängig. Digital. Sicher.</small></span></div>
            <p>Ihr unabhängiger Vergleichs- und Vermittlungsdienst für Versicherungen, Energie, Internet und mehr in Deutschland.</p>
            <address>Hospitalstraße 30 · 66798 Wallerfangen</address>
          </div>
          <div><h3>Entdecken</h3><ul>{SERVICE_LINKS.map((link)=><li key={link.path}><button onClick={()=>navigate(link.path)}>{link.label}</button></li>)}</ul></div>
          <div><h3>Rechtliches</h3><ul>{LEGAL_LINKS.map((link)=><li key={link.path}><button onClick={()=>navigate(link.path)}>{link.label}</button></li>)}</ul></div>
        </div>
        <div className="premium-footer-bottom">
          <p>© {new Date().getFullYear()} Tarifberater24 — Svetlozar Gitsov.</p>
          <div><span><LockKeyhole size={13}/> SSL gesichert</span><span><ShieldCheck size={13}/> DSGVO konform</span></div>
        </div>
        <p className="premium-disclaimer">* Bei erfolgreichem Vertragsabschluss kann Tarifberater24 eine Provision erhalten. Dies beeinflusst nicht die Objektivität unserer Empfehlungen. <button onClick={()=>navigate("/affiliate-disclosure")}>Mehr erfahren</button>.</p>
      </div>
    </footer>
  );
}
