import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Landmark, MessageCircle, Zap, ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = [
  {
    icon: Shield,
    title: "Застраховки без стрес",
    subtitle: "Намерете най-добрата застраховка за вашия автомобил, дом или здраве.",
    desc: "Сравняваме оферти от водещи германски застрахователи и ви помагаме да изберете правилното покритие на правилната цена.",
    color: "#343755",
    accent: "Kfz · Haftpflicht · Hausrat · Kranken",
  },
  {
    icon: Landmark,
    title: "Банкиране и финанси",
    subtitle: "Управлявайте парите си умно в Германия.",
    desc: "Отворете банкова сметка, разберете данъчната система и получете персонализирани финансови съвети — всичко на български.",
    color: "#2a3060",
    accent: "Konto · Steuer · Kredit · SEPA",
  },
  {
    icon: Zap,
    title: "Комунални услуги",
    subtitle: "Ток, газ, интернет — лесно и изгодно.",
    desc: "Помагаме ви да намерите и сключите договори за комунални услуги, да разберете сметките си и да спестите пари.",
    color: "#1e3a5f",
    accent: "Strom · Gas · Internet · Wasser",
  },
  {
    icon: MessageCircle,
    title: "AI Асистент 24/7",
    subtitle: "Вашият личен асистент на български.",
    desc: "Задавайте въпроси за застраховки, банкиране, документи или правни теми и получавайте точни отговори мигновено.",
    color: "#3a2a1a",
    accent: "Анмелдунг · Виза · Arbeitsrecht · Mietrecht",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [, navigate] = useLocation();
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "var(--color-void-black)" }}
    >
      {/* Background aurora */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          left: "-10%",
          width: "60%",
          height: "60%",
          background: `radial-gradient(ellipse, ${current.color}22 0%, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Skip button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 btn-ghost-nav"
        style={{ fontSize: "10px" }}
      >
        Пропусни
      </button>

      {/* Step indicators */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? 24 : 6,
              height: 6,
              background: i === step ? "var(--color-dusk-violet)" : "var(--color-ash-border)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="container flex flex-col items-center text-center max-w-lg px-8"
        key={step}
        style={{ animation: "fadeInUp 0.5s var(--ease-out) both" }}
      >
        {/* Icon portal */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8 relative"
          style={{
            background: `${current.color}30`,
            border: `1px solid ${current.color}80`,
            boxShadow: `0 0 40px 8px ${current.color}20`,
          }}
        >
          <Icon size={36} color="#fff" strokeWidth={1.5} />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `1px solid ${current.color}40`,
              transform: "scale(1.3)",
              animation: "pulse-glow 3s ease infinite",
            }}
          />
        </div>

        {/* Tag */}
        <div className="tag-pill mb-4">{current.accent}</div>

        {/* Title */}
        <h1
          className="text-white mb-3"
          style={{
            fontFamily: "var(--font-nbarchitekt)",
            fontSize: "clamp(22px, 5vw, 32px)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {current.title}
        </h1>

        {/* Subtitle */}
        <p
          className="mb-4"
          style={{
            fontFamily: "var(--font-nbarchitekt)",
            fontSize: "14px",
            color: "var(--color-pale-mist)",
            lineHeight: 1.6,
          }}
        >
          {current.subtitle}
        </p>

        {/* Description */}
        <p
          className="mb-10"
          style={{
            fontFamily: "var(--font-times)",
            fontSize: "15px",
            lineHeight: 1.88,
            color: "var(--color-smoke)",
          }}
        >
          {current.desc}
        </p>

        {/* Navigation */}
        <div className="flex items-center gap-4 w-full justify-center">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="btn-ghost-nav flex items-center gap-1"
              style={{ padding: "8px 16px", fontSize: "12px" }}
            >
              <ArrowLeft size={14} /> Назад
            </button>
          )}
          <button
            onClick={() => isLast ? navigate("/") : setStep(s => s + 1)}
            className="btn-pill-primary flex items-center gap-2"
            style={{ padding: "10px 28px", fontSize: "14px" }}
          >
            {isLast ? "Започни сега" : "Напред"}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Step counter */}
        <p
          className="mt-6"
          style={{
            fontFamily: "var(--font-nbarchitekt)",
            fontSize: "10px",
            color: "var(--color-fog)",
            letterSpacing: "0.1em",
          }}
        >
          {step + 1} / {STEPS.length}
        </p>
      </div>
    </div>
  );
}
