/**
 * /angebot — Public landing page for Facebook ad traffic.
 * No login required. Optimized for Bulgarian immigrants in Germany.
 * Default category: energy (Ток/Газ) for pilot launch.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import PublicOfferForm, { OfferCategory } from "@/components/PublicOfferForm";
import { Zap, Shield, Wifi, Smartphone, Landmark, FileText, Scale, MapPin, Star, CheckCircle2, ArrowLeft } from "lucide-react";

const TRUST_STATS = [
  { value: "100%", label: "Безплатна консултация" },
  { value: "24ч",  label: "Отговор от консултант" },
  { value: "DSGVO", label: "Защита на данните" },
];

const BENEFITS = [
  "Сравняваме оферти от водещи германски доставчици",
  "Консултация на български — без езикова бариера",
  "Без скрити такси, без задължение",
  "Помагаме с подписване и смяна на договор",
];

const CATEGORY_TABS: { id: OfferCategory; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "energy",     label: "Ток / Газ",         icon: Zap,        desc: "Намери най-евтиния доставчик на ток или газ в Германия" },
  { id: "insurance",  label: "Застраховка",        icon: Shield,     desc: "Kfz, Haftpflicht, Hausrat — сравни и спести" },
  { id: "internet",   label: "Интернет",           icon: Wifi,       desc: "Намери най-добрия интернет план за твоя адрес" },
  { id: "mobile",     label: "Телефон",            icon: Smartphone, desc: "Мобилни договори с най-добра цена" },
  { id: "banking",    label: "Банка / Кредит",     icon: Landmark,   desc: "Открий сметка или кандидатствай за кредит" },
  { id: "tax",        label: "Данъчна декларация", icon: FileText,   desc: "Steuererklärung — върни данъците си" },
  { id: "legal",      label: "Правна помощ",       icon: Scale,      desc: "Правни въпроси на български" },
  { id: "relocation", label: "Преместване",        icon: MapPin,     desc: "Помощ при преместване в Германия" },
];

export default function Angebot() {
  const [, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState<OfferCategory>("energy");

  const activeCat = CATEGORY_TABS.find(c => c.id === activeCategory)!;
  const ActiveIcon = activeCat.icon;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-void)", paddingBottom: 80 }}>

      {/* Back nav */}
      <div style={{ padding: "16px 20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-nbarchitekt)" }}
        >
          <ArrowLeft size={14} /> Начало
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>

        {/* HERO */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 20, padding: "5px 16px", marginBottom: 20,
          }}>
            <Zap size={13} style={{ color: "#f59e0b" }} />
            <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-nbarchitekt)", letterSpacing: "0.05em" }}>
              БЕЗПЛАТНА ОФЕРТА — БЕЗ ЗАДЪЛЖЕНИЕ
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-nbarchitekt)",
            fontSize: "clamp(26px, 5vw, 46px)",
            fontWeight: 700, lineHeight: 1.15,
            color: "white", marginBottom: 16,
          }}>
            Спести от сметките си<br />
            <span style={{ color: "var(--color-dusk-violet)" }}>в Германия</span>
          </h1>
          <p style={{
            fontFamily: "var(--font-times)",
            fontSize: 16, lineHeight: 1.8,
            color: "rgba(255,255,255,0.55)",
            maxWidth: 520, margin: "0 auto 28px",
          }}>
            Сравняваме оферти за ток, застраховки, интернет и още —
            на <strong style={{ color: "white" }}>български</strong>, безплатно, без задължение.
          </p>

          {/* Trust stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginBottom: 8 }}>
            {TRUST_STATS.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: 20, fontWeight: 700, color: "white" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT: Category tabs + Form */}
        <div className="angebot-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* LEFT: Category tabs + Benefits */}
          <div>
            {/* Category tabs */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Избери услуга
              </p>
              <div className="angebot-categories" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {CATEGORY_TABS.map(cat => {
                  const Icon = cat.icon;
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      className="angebot-category"
                      onClick={() => setActiveCategory(cat.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                        background: active ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.03)",
                        border: active ? "1px solid rgba(212,175,55,0.36)" : "1px solid rgba(255,255,255,0.06)",
                        textAlign: "left", transition: "all 150ms ease-out",
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                        background: active ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={15} style={{ color: active ? "var(--premium-gold-soft)" : "rgba(255,255,255,0.4)" }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "white" : "rgba(255,255,255,0.55)" }}>
                          {cat.label}
                        </div>
                        {active && (
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.4, marginTop: 2 }}>
                            {cat.desc}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Benefits */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px" }}>
              <p style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Защо Tarifberater24?
              </p>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < BENEFITS.length - 1 ? 10 : 0 }}>
                  <CheckCircle2 size={14} style={{ color: "#10b981", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex" }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={13} style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                Доверено от стотици българи в Германия
              </span>
            </div>
          </div>

          {/* RIGHT: Form card */}
          <div className="angebot-sticky" style={{
            background: "linear-gradient(145deg, #11100b 0%, #0a0c0f 100%)",
            border: "1px solid rgba(212,175,55,0.22)",
            borderRadius: 20, padding: "28px 24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            position: "sticky", top: 20,
          }}>
            {/* Form header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ActiveIcon size={16} style={{ color: "var(--premium-gold-soft)" }} />
              </div>
              <div>
                <h3 style={{ color: "white", fontWeight: 700, fontFamily: "var(--font-nbarchitekt)", fontSize: 15, margin: 0 }}>
                  {activeCat.label}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0 }}>Безплатна оферта · Без задължение</p>
              </div>
            </div>

            <PublicOfferForm defaultCategory={activeCategory} compact />
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA — shown only on small screens */}
      <style>{`
        @media (max-width: 640px) {
          .angebot-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .angebot-sticky { position: static !important; min-width: 0; padding: 22px 18px !important; }
          .angebot-categories { display: grid !important; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px !important; }
          .angebot-category { min-width: 0; padding: 10px !important; }
          .angebot-category > div:last-child { min-width: 0; }
        }
      `}</style>
    </div>
  );
}
