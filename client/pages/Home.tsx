import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Shield, Landmark, Zap, Smartphone, FileText, MessageCircle,
  TrendingUp, ArrowRight, ChevronRight, Bell, Car, Scale
} from "lucide-react";

const SERVICE_CARDS = [
  {
    id: "insurance",
    icon: Shield,
    label: "Застраховки",
    desc: "Kfz, Haftpflicht, Hausrat",
    path: "/insurance",
    color: "#343755",
  },
  {
    id: "banking",
    icon: Landmark,
    label: "Банкиране",
    desc: "Сметки, преводи, кредити",
    path: "/services",
    color: "#2a3060",
  },
  {
    id: "utilities",
    icon: Zap,
    label: "Комунални",
    desc: "Ток, газ, интернет",
    path: "/services",
    color: "#1e3a5f",
  },
  {
    id: "telecom",
    icon: Smartphone,
    label: "Телеком",
    desc: "Мобилни договори",
    path: "/services",
    color: "#2d2060",
  },
  {
    id: "documents",
    icon: FileText,
    label: "Документи",
    desc: "Анмелдунг, виза, разрешения",
    path: "/services",
    color: "#1a3a2a",
  },
  {
    id: "assistant",
    icon: MessageCircle,
    label: "AI Асистент",
    desc: "Помощ 24/7 на български",
    path: "/assistant",
    color: "#3a2a1a",
  },
];

const QUICK_ACTIONS = [
  { icon: Car, label: "Сравни застраховки", path: "/insurance" },
  { icon: Scale, label: "Правна помощ", path: "/assistant" },
  { icon: TrendingUp, label: "Финансов съвет", path: "/assistant" },
  { icon: Bell, label: "Новини", path: "/news" },
];

const RECENT_ACTIVITY = [
  { type: "insurance", title: "Оферта за Kfz-Versicherung", desc: "ADAC — 42€/месец", time: "Преди 2 ч.", status: "active" },
  { type: "news", title: "Нови данъчни правила 2025", desc: "Промени в Steuererklärung", time: "Вчера", status: "info" },
  { type: "contract", title: "Договор за ток", desc: "Vattenfall — подновен", time: "Преди 3 дни", status: "success" },
];

// Cosmic portal SVG
function CosmicPortal() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outer glow ring */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: 180, height: 180,
          border: "1px solid rgba(52,55,85,0.6)",
          boxShadow: "0 0 40px 8px rgba(52,55,85,0.3), inset 0 0 40px 8px rgba(52,55,85,0.1)",
        }}
      />
      {/* Middle ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 140, height: 140,
          border: "1px solid rgba(52,55,85,0.4)",
          animation: "orbit 20s linear infinite",
        }}
      />
      {/* Inner core */}
      <div
        className="absolute rounded-full"
        style={{
          width: 80, height: 80,
          background: "radial-gradient(circle, rgba(52,55,85,0.8) 0%, rgba(0,0,0,0) 70%)",
          border: "1px solid rgba(52,55,85,0.8)",
        }}
      />
      {/* BG letters */}
      <div
        className="relative z-10 font-bold text-white"
        style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "28px", letterSpacing: "0.2em" }}
      >
        BG
      </div>
      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: "var(--color-dusk-violet)",
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animation: `particle-drift ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const greeting = isAuthenticated && user?.name
    ? `Здравей, ${user.name.split(" ")[0]}!`
    : "Здравей!";

  return (
    <div className="container py-8">
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-fade-in-up">
        <div className="flex-1 text-center md:text-left">
          <div className="tag-pill inline-block mb-4">Вашият дигитален асистент в Германия</div>
          <h1
            className="text-white mb-4"
            style={{
              fontFamily: "var(--font-nbarchitekt)",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {greeting}
            <br />
            <span style={{ color: "var(--color-pale-mist)" }}>
              Управлявайте живота си
            </span>
            <br />
            <span style={{ color: "var(--color-dusk-violet)" }}>
              в Германия лесно.
            </span>
          </h1>
          <p
            className="mb-6"
            style={{
              fontFamily: "var(--font-times)",
              fontSize: "16px",
              lineHeight: 1.88,
              color: "var(--color-pale-mist)",
              maxWidth: 480,
            }}
          >
            Застраховки, банкиране, комунални услуги, документи и правна помощ —
            всичко на едно място, на български.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {isAuthenticated ? (
              <button
                className="btn-pill-primary"
                onClick={() => navigate("/services")}
              >
                Разгледай услугите →
              </button>
            ) : (
              <>
                <a href={getLoginUrl()} className="btn-pill-primary">
                  Започни безплатно
                </a>
                <button
                  className="btn-ghost-nav"
                  onClick={() => navigate("/onboarding")}
                  style={{ padding: "6px 18px", fontSize: "12px" }}
                >
                  Научи повече
                </button>
              </>
            )}
          </div>
        </div>

        {/* Portal visual */}
        <div className="flex-shrink-0 animate-fade-in delay-300">
          <CosmicPortal />
        </div>
      </section>

      <hr className="hairline mb-10" />

      {/* SERVICES GRID */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-white"
            style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            Услуги
          </h2>
          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--color-pale-mist)", fontFamily: "var(--font-nbarchitekt)" }}
          >
            Всички <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICE_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => navigate(card.path)}
                className="ghost-card text-left group cursor-pointer animate-fade-in-up"
                style={{
                  animationDelay: `${i * 0.07}s`,
                  padding: "16px",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${card.color}80`, border: `1px solid ${card.color}` }}
                >
                  <Icon size={18} color="#fff" strokeWidth={1.5} />
                </div>
                <div
                  className="text-white font-bold mb-1"
                  style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px" }}
                >
                  {card.label}
                </div>
                <div
                  style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-smoke)", lineHeight: 1.4 }}
                >
                  {card.desc}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mb-12">
        <h2
          className="text-white mb-4"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          Бързи действия
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_ACTIONS.map(({ icon: Icon, label, path }, i) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="frosted-panel flex items-center gap-2 px-3 py-3 text-left group animate-fade-in-up"
              style={{ animationDelay: `${0.3 + i * 0.06}s` }}
            >
              <Icon size={16} style={{ color: "var(--color-pale-mist)", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "var(--font-nbarchitekt)",
                  fontSize: "11px",
                  color: "var(--color-pale-mist)",
                  lineHeight: 1.3,
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="animate-fade-in-up delay-400">
        <h2
          className="text-white mb-4"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          Скорошна активност
        </h2>
        <div className="ghost-card" style={{ padding: 0, overflow: "hidden" }}>
          {RECENT_ACTIVITY.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 border-b last:border-b-0 group cursor-pointer hover:bg-white/5 transition-colors"
              style={{ borderColor: "var(--color-ash-border)" }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: item.status === "active" ? "var(--color-dusk-violet)"
                    : item.status === "success" ? "#10b981"
                    : "var(--color-fog)",
                }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-white truncate"
                  style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 600 }}
                >
                  {item.title}
                </div>
                <div
                  className="truncate"
                  style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-smoke)" }}
                >
                  {item.desc}
                </div>
              </div>
              <div
                className="flex-shrink-0 flex items-center gap-2"
                style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "10px", color: "var(--color-fog)" }}
              >
                {item.time}
                <ChevronRight size={12} style={{ color: "var(--color-ash-border)" }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
