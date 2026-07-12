import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight, LogIn, Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function TopNav() {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/services", label: t("nav.services") },
    { path: "/assistant", label: t("nav.assistant") },
    { path: "/news", label: t("nav.news") },
    { path: "/partners", label: t("nav.partner") },
  ];

  const go = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="premium-header">
      <nav className="premium-nav" aria-label="Hauptnavigation">
        <button onClick={() => go("/")} className="premium-brand" aria-label="Tarifberater24 Startseite">
          <span className="premium-brand-mark"><ShieldCheck size={19} strokeWidth={1.7} /></span>
          <span className="premium-brand-copy">
            <strong>Tarifberater<span>24</span></strong>
            <small>Unabhängig. Digital. Sicher.</small>
          </span>
        </button>

        <div className="premium-nav-links" role="list">
          {navItems.map((item) => {
            const active = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <button key={item.path} onClick={() => go(item.path)} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="premium-nav-actions">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <button onClick={() => go("/profile")} className="premium-avatar" title={user?.name ?? t("nav.profile")}>
              {(user?.name ?? "?")[0].toUpperCase()}
            </button>
          ) : (
            <a href={getLoginUrl() ?? "/"} className="premium-login"><LogIn size={15} />{t("nav.login")}</a>
          )}
          <button onClick={() => go("/get-offer")} className="premium-cta">
            {t("nav.getOffer")}<ArrowUpRight size={15} />
          </button>
          <button className="premium-menu-trigger" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label="Menü öffnen">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="premium-mobile-menu">
          <div className="premium-mobile-eyebrow"><Sparkles size={14} /> Premium Vergleichsservice</div>
          {navItems.map((item) => (
            <button key={item.path} onClick={() => go(item.path)} className={location === item.path ? "is-active" : ""}>
              <span>{item.label}</span><ArrowUpRight size={17} />
            </button>
          ))}
          <button onClick={() => go("/get-offer")} className="premium-mobile-cta">Kostenlos vergleichen</button>
        </div>
      )}
    </header>
  );
}
