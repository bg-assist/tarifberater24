import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import bg from "../locales/bg";
import de from "../locales/de";

const savedLang = typeof window !== "undefined"
  ? localStorage.getItem("tarifberater24_lang") || "bg"
  : "bg";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      bg: { translation: bg },
      de: { translation: de },
    },
    lng: savedLang,
    fallbackLng: "bg",
    interpolation: { escapeValue: false },
  });

// Persist language choice
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("tarifberater24_lang", lng);
  }
});

export default i18n;
export type Language = "bg" | "de";
