import { useLocation } from "wouter";
import {
  Shield, Landmark, Zap, Smartphone, FileText, MessageCircle,
  Car, Home, Heart, Briefcase, Scale, GraduationCap,
  ChevronRight
} from "lucide-react";

const CATEGORIES = [
  {
    id: "insurance",
    title: "Застраховки",
    tag: "Versicherungen",
    items: [
      { icon: Car, label: "Кфц застраховка", desc: "Kfz-Versicherung — задължителна и допълнителна", path: "/insurance" },
      { icon: Home, label: "Домашно имущество", desc: "Hausratversicherung — защита на вещите", path: "/insurance" },
      { icon: Heart, label: "Здравна застраховка", desc: "Krankenversicherung — GKV или PKV", path: "/insurance" },
      { icon: Shield, label: "Лична отговорност", desc: "Haftpflichtversicherung — задължителна", path: "/insurance" },
    ],
  },
  {
    id: "banking",
    title: "Банкиране",
    tag: "Banking",
    items: [
      { icon: Landmark, label: "Банкова сметка", desc: "Girokonto — онлайн и традиционни банки", path: "/assistant" },
      { icon: Briefcase, label: "Данъци", desc: "Steuererklärung — помощ при подаване", path: "/assistant" },
      { icon: Scale, label: "Кредити", desc: "Kredit — сравнение на условия", path: "/assistant" },
    ],
  },
  {
    id: "utilities",
    title: "Комунални услуги",
    tag: "Versorgung",
    items: [
      { icon: Zap, label: "Електричество", desc: "Strom — сравнение на доставчици", path: "/assistant" },
      { icon: Zap, label: "Газ", desc: "Gas — договори и цени", path: "/assistant" },
      { icon: Smartphone, label: "Интернет", desc: "DSL / Glasfaser — най-добри оферти", path: "/assistant" },
    ],
  },
  {
    id: "telecom",
    title: "Телекомуникации",
    tag: "Telekommunikation",
    items: [
      { icon: Smartphone, label: "Мобилен договор", desc: "Handyvertrag — Telekom, Vodafone, O2", path: "/assistant" },
      { icon: Smartphone, label: "Предплатена карта", desc: "Prepaid SIM — без договор", path: "/assistant" },
    ],
  },
  {
    id: "documents",
    title: "Документи и бюрокрация",
    tag: "Dokumente",
    items: [
      { icon: FileText, label: "Анмелдунг", desc: "Anmeldung — регистрация на адрес", path: "/assistant" },
      { icon: FileText, label: "Разрешение за пребиваване", desc: "Aufenthaltserlaubnis — процедура", path: "/assistant" },
      { icon: GraduationCap, label: "Признаване на дипломи", desc: "Anerkennung — процес и изисквания", path: "/assistant" },
    ],
  },
  {
    id: "legal",
    title: "Правна помощ",
    tag: "Rechtsberatung",
    items: [
      { icon: Scale, label: "Трудово право", desc: "Arbeitsrecht — права и задължения", path: "/assistant" },
      { icon: Scale, label: "Наемно право", desc: "Mietrecht — наем, депозит, изгонване", path: "/assistant" },
      { icon: MessageCircle, label: "AI правен съветник", desc: "Задайте въпрос на нашия асистент", path: "/assistant" },
    ],
  },
];

export default function Services() {
  const [, navigate] = useLocation();

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="tag-pill inline-block mb-3">12 категории услуги</div>
        <h1
          className="text-white"
          style={{
            fontFamily: "var(--font-nbarchitekt)",
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Всички услуги
        </h1>
        <p
          className="mt-2"
          style={{ fontFamily: "var(--font-times)", fontSize: "15px", color: "var(--color-pale-mist)", lineHeight: 1.7 }}
        >
          Намерете помощ за всяка стъпка от живота ви в Германия.
        </p>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat, ci) => (
        <section key={cat.id} className="mb-10 animate-fade-in-up" style={{ animationDelay: `${ci * 0.08}s` }}>
          <div className="flex items-center gap-3 mb-4">
            <h2
              className="text-white"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              {cat.title}
            </h2>
            <span className="tag-pill" style={{ fontSize: "9px" }}>{cat.tag}</span>
          </div>
          <div className="ghost-card" style={{ padding: 0, overflow: "hidden" }}>
            {cat.items.map((item, ii) => {
              const Icon = item.icon;
              return (
                <button
                  key={ii}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-4 px-5 py-4 border-b last:border-b-0 text-left hover:bg-white/5 transition-colors group"
                  style={{ borderColor: "var(--color-ash-border)" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(52,55,85,0.3)", border: "1px solid rgba(52,55,85,0.6)" }}
                  >
                    <Icon size={16} color="#fff" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-white"
                      style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 600 }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-smoke)" }}
                    >
                      {item.desc}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--color-ash-border)", flexShrink: 0 }} className="group-hover:text-white transition-colors" />
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
