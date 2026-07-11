import { useTranslation } from "react-i18next";
import type { Language } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language as Language;

  const toggle = () => {
    i18n.changeLanguage(current === "bg" ? "de" : "bg");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-150 active:scale-95 text-sm font-medium text-white/80 hover:text-white"
      title={current === "bg" ? "Auf Deutsch wechseln" : "Смени на Български"}
      aria-label="Switch language"
    >
      <span className="text-base leading-none">
        {current === "bg" ? "🇧🇬" : "🇩🇪"}
      </span>
      <span className="hidden sm:inline text-xs uppercase tracking-wide">
        {current === "bg" ? "BG" : "DE"}
      </span>
    </button>
  );
}
