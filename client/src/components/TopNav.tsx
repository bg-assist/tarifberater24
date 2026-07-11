import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function TopNav() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { path: "/", label: t("nav.home") },
    { path: "/services", label: t("nav.services") },
    { path: "/partners", label: t("nav.partner") },
    { path: "/assistant", label: t("nav.assistant") },
    { path: "/news", label: t("nav.news") },
  ];

  return (
    <nav className="top-nav">
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mr-auto group"
        aria-label="Tarifberater24"
      >
        <div className="w-7 h-7 rounded-full border border-[var(--color-dusk-violet)] flex items-center justify-center relative overflow-hidden animate-pulse-glow">
          <div className="w-3 h-3 rounded-full bg-[var(--color-dusk-violet)] opacity-80" />
          <div className="absolute inset-0 rounded-full border border-[var(--color-dusk-violet)] opacity-30 scale-150" />
        </div>
        <span
          className="font-bold text-white hidden sm:block"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          Tarifberater24
        </span>
      </button>

      {/* Desktop nav items */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="btn-ghost-nav transition-all duration-200"
              style={{
                background: isActive ? "var(--color-dusk-violet)" : "transparent",
                borderColor: isActive ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.4)",
                color: isActive ? "#fff" : "var(--color-pale-mist)",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Language Switcher + CTA + Auth */}
      <div className="ml-2 flex items-center gap-2">
        <LanguageSwitcher />

        <button
          onClick={() => navigate("/get-offer")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--color-dusk-violet)" }}
        >
          {t("nav.getOffer")}
        </button>

        {isAuthenticated ? (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
            style={{ background: "var(--color-dusk-violet)", color: "#fff" }}
            onClick={() => navigate("/profile")}
            title={user?.name ?? t("nav.profile")}
          >
            {(user?.name ?? "?")[0].toUpperCase()}
          </div>
        ) : (
          <a href={getLoginUrl()} className="btn-ghost-nav">
            {t("nav.login")}
          </a>
        )}
      </div>
    </nav>
  );
}
