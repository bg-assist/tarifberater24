import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Moon, Sun, Bell, Shield, Globe, ChevronRight, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const LANGUAGES = [
  { id: "bg", label: "Български", flag: "🇧🇬" },
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
] as const;

export default function Settings() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";
  const setDarkMode = (_v: boolean) => toggleTheme?.();
  const [language, setLanguage] = useState<"bg" | "en" | "de">("bg");
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => toast.success("Настройките са запазени."),
    onError: () => toast.error("Грешка при запазване."),
  });

  function handleSave() {
    if (!isAuthenticated) {
      toast.info("Влезте в профила си, за да запазите настройките.");
      return;
    }
    updateProfile.mutate({ language, darkMode, notificationsEnabled: notifications });
  }

  function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        onClick={() => onChange(!value)}
        className="premium-toggle"
        style={{
          background: value ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.1)",
          border: `1px solid ${value ? "var(--color-dusk-violet)" : "var(--color-ash-border)"}`,
        }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
          style={{ left: value ? "calc(100% - 22px)" : "2px" }}
        />
      </button>
    );
  }

  function SettingRow({
    icon: Icon,
    label,
    desc,
    children,
  }: {
    icon: React.ElementType;
    label: string;
    desc?: string;
    children: React.ReactNode;
  }) {
    return (
      <div
        className="premium-setting-row"
        style={{ borderColor: "var(--color-ash-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(52,55,85,0.3)", border: "1px solid rgba(52,55,85,0.5)" }}
        >
          <Icon size={15} style={{ color: "var(--color-pale-mist)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-white"
            style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 600 }}
          >
            {label}
          </div>
          {desc && (
            <div
              style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-smoke)" }}
            >
              {desc}
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }

  return (
    <main className="premium-settings-page premium-container">
      {/* Header */}
      <div className="premium-settings-heading animate-fade-in-up">
        <span className="premium-eyebrow">Конфигурация</span>
        <h1
          className="text-white"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 700 }}
        >
          Настройки
        </h1>
      </div>

      {/* Appearance */}
      <section className="premium-settings-section animate-fade-in-up delay-100">
        <h2
          className="mb-3"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-fog)" }}
        >
          Изглед
        </h2>
        <div className="premium-settings-panel">
          <SettingRow
            icon={darkMode ? Moon : Sun}
            label="Тъмен режим"
            desc="Cosmic void тема (препоръчително)"
          >
            <ToggleSwitch value={darkMode} onChange={setDarkMode} />
          </SettingRow>
        </div>
      </section>

      {/* Language */}
      <section className="premium-settings-section animate-fade-in-up delay-200">
        <h2
          className="mb-3"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-fog)" }}
        >
          Език
        </h2>
        <div className="premium-settings-panel">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className="premium-language-row"
              style={{ borderColor: "var(--color-ash-border)" }}
            >
              <span className="text-xl flex-shrink-0">{lang.flag}</span>
              <div
                className="flex-1 text-white"
                style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 600 }}
              >
                {lang.label}
              </div>
              {language === lang.id && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--color-dusk-violet)" }}
                >
                  <Check size={11} color="#fff" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="premium-settings-section animate-fade-in-up delay-300">
        <h2
          className="mb-3"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-fog)" }}
        >
          Известия
        </h2>
        <div className="premium-settings-panel">
          <SettingRow
            icon={Bell}
            label="Push известия"
            desc="Новини, оферти и напомняния"
          >
            <ToggleSwitch value={notifications} onChange={setNotifications} />
          </SettingRow>
          <SettingRow
            icon={Bell}
            label="Маркетинг имейли"
            desc="Специални оферти и промоции"
          >
            <ToggleSwitch value={marketingEmails} onChange={setMarketingEmails} />
          </SettingRow>
        </div>
      </section>

      {/* Privacy */}
      <section className="premium-settings-section animate-fade-in-up delay-400">
        <h2
          className="mb-3"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-fog)" }}
        >
          Поверителност
        </h2>
        <div className="premium-settings-panel">
          <SettingRow
            icon={Shield}
            label="Споделяне на данни"
            desc="Анонимни аналитични данни за подобряване на услугата"
          >
            <ToggleSwitch value={dataSharing} onChange={setDataSharing} />
          </SettingRow>
          <button
            className="premium-setting-row premium-setting-action"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(52,55,85,0.3)", border: "1px solid rgba(52,55,85,0.5)" }}
            >
              <Globe size={15} style={{ color: "var(--color-pale-mist)" }} />
            </div>
            <div className="flex-1">
              <div
                className="text-white"
                style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 600 }}
              >
                Политика за поверителност
              </div>
              <div
                style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-smoke)" }}
              >
                Прочетете как обработваме данните ви
              </div>
            </div>
            <ChevronRight size={14} style={{ color: "var(--color-ash-border)" }} />
          </button>
        </div>
      </section>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="premium-button premium-submit"
        disabled={updateProfile.isPending}
        style={{ fontSize: "14px" }}
      >
        {updateProfile.isPending ? "Запазване..." : "Запази настройките"}
      </button>

      {/* App version */}
      <p
        className="text-center mt-6"
        style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "10px", color: "var(--color-fog)", letterSpacing: "0.06em" }}
      >
        BG ASSIST GERMANY · v1.0.0 MVP · © 2025
      </p>
    </main>
  );
}
