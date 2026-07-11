/**
 * PublicOfferForm — no login required.
 * Used on Home page and /angebot landing page.
 * Submits via leads.submit (publicProcedure) → DB + HubSpot CRM.
 */
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, Zap, Shield, Wifi, Smartphone, Landmark, FileText, Scale, MapPin } from "lucide-react";

export type OfferCategory =
  | "energy" | "insurance" | "internet" | "mobile"
  | "banking" | "tax" | "legal" | "relocation" | "other";

const CATEGORIES: { id: OfferCategory; label: string; icon: React.ElementType; color: string }[] = [
  { id: "energy",     label: "Ток / Газ",          icon: Zap,        color: "#f59e0b" },
  { id: "insurance",  label: "Застраховка",         icon: Shield,     color: "#7c6af7" },
  { id: "internet",   label: "Интернет",            icon: Wifi,       color: "#06b6d4" },
  { id: "mobile",     label: "Мобилен договор",     icon: Smartphone, color: "#10b981" },
  { id: "banking",    label: "Банкиране / Кредит",  icon: Landmark,   color: "#3b82f6" },
  { id: "tax",        label: "Данъчна декларация",  icon: FileText,   color: "#8b5cf6" },
  { id: "legal",      label: "Правна помощ",        icon: Scale,      color: "#ec4899" },
  { id: "relocation", label: "Преместване",         icon: MapPin,     color: "#f97316" },
];

interface Props {
  defaultCategory?: OfferCategory;
  compact?: boolean; // true = modal/sidebar mode, false = full page mode
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  details: string;
  category: OfferCategory;
  consent: boolean;
}

const EMPTY: FormState = {
  firstName: "", lastName: "", email: "", phone: "",
  city: "", details: "", category: "energy", consent: false,
};

export default function PublicOfferForm({ defaultCategory = "energy", compact = false }: Props) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, category: defaultCategory });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [done, setDone] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; opacity: number; vy: number }[]>([]);
  const rafRef = useRef<number | null>(null);

  const mutation = trpc.leads.submit.useMutation({
    onSuccess: () => {
      setDone(true);
      spawnConfetti();
    },
    onError: (err) => {
      setErrors({ email: err.message });
    },
  });

  function spawnConfetti() {
    const colors = ["#f59e0b", "#7c6af7", "#10b981", "#3b82f6", "#ec4899"];
    const initial = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 40 + Math.random() * 20,
      y: 50,
      color: colors[i % colors.length],
      opacity: 1,
      vy: -(Math.random() * 5 + 2),
    }));
    setParticles(initial);
    let frame = 0;
    const animate = () => {
      frame++;
      setParticles(prev => prev.map(p => ({ ...p, y: p.y + p.vy * 0.5 + frame * 0.03, opacity: Math.max(0, p.opacity - 0.02) })).filter(p => p.opacity > 0));
      if (frame < 80) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  function set(field: keyof FormState, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.firstName.trim().length < 2) e.firstName = "Минимум 2 символа";
    if (form.lastName.trim().length < 2) e.lastName = "Минимум 2 символа";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Невалиден имейл";
    if (form.phone.trim().length < 6) e.phone = "Невалиден телефон";
    if (form.city.trim().length < 2) e.city = "Въведи град";
    if (!form.consent) e.consent = "Необходимо е съгласие";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      category: form.category,
      details: form.details.trim() || undefined,
      urgency: "diesen_monat",
      affiliateConsent: form.consent,
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "white", fontSize: 14, fontFamily: "inherit", outline: "none",
    transition: "border-color 150ms ease-out", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
    color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase",
    fontFamily: "var(--font-nbarchitekt)",
  };
  const errorStyle: React.CSSProperties = { color: "#f87171", fontSize: 11, marginTop: 4 };

  /* ── SUCCESS ── */
  if (done) {
    return (
      <div style={{ position: "relative", textAlign: "center", padding: compact ? "24px 16px" : "48px 24px" }}>
        {/* Confetti */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {particles.map(p => (
            <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: 8, height: 8, borderRadius: "50%", background: p.color, opacity: p.opacity }} />
          ))}
        </div>

        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <CheckCircle2 size={28} style={{ color: "#10b981" }} />
        </div>

        <h3 style={{ color: "white", fontSize: compact ? 18 : 22, fontWeight: 700, fontFamily: "var(--font-nbarchitekt)", marginBottom: 8 }}>
          Запитването е изпратено! 🎉
        </h3>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          Нашият екип ще се свърже с теб на <strong style={{ color: "white" }}>{form.email}</strong> до <strong style={{ color: "white" }}>24 часа</strong>.
        </p>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", textAlign: "left", marginBottom: 20 }}>
          {[
            { icon: "✅", text: "Запитването е получено", done: true },
            { icon: "📞", text: "Консултант ще се свърже с теб", done: false },
            { icon: "📄", text: "Получаваш персонализирана оферта", done: false },
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <span style={{ fontSize: 14 }}>{step.icon}</span>
              <span style={{ fontSize: 12, color: step.done ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}>{step.text}</span>
              {step.done && <span style={{ marginLeft: "auto", fontSize: 10, color: "#10b981", fontWeight: 700 }}>ГОТОВО</span>}
            </div>
          ))}
        </div>

        <button
          onClick={() => { setDone(false); setForm({ ...EMPTY, category: defaultCategory }); }}
          style={{ padding: "10px 24px", borderRadius: 10, background: "rgba(124,106,247,0.2)", border: "1px solid rgba(124,106,247,0.4)", color: "#a78bfa", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          Ново запитване
        </button>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Category selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Категория</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = form.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => set("category", cat.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                  fontWeight: active ? 700 : 400,
                  background: active ? `${cat.color}25` : "rgba(255,255,255,0.05)",
                  border: active ? `1.5px solid ${cat.color}80` : "1px solid rgba(255,255,255,0.08)",
                  color: active ? cat.color : "rgba(255,255,255,0.5)",
                  transition: "all 150ms ease-out",
                  transform: active ? "scale(1.04)" : "scale(1)",
                }}
              >
                <Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Име</label>
          <input
            style={{ ...inputStyle, borderColor: errors.firstName ? "#f87171" : "rgba(255,255,255,0.1)" }}
            placeholder="Иван"
            value={form.firstName}
            onChange={e => set("firstName", e.target.value)}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = errors.firstName ? "#f87171" : "rgba(255,255,255,0.1)")}
          />
          {errors.firstName && <p style={errorStyle}>{errors.firstName}</p>}
        </div>
        <div>
          <label style={labelStyle}>Фамилия</label>
          <input
            style={{ ...inputStyle, borderColor: errors.lastName ? "#f87171" : "rgba(255,255,255,0.1)" }}
            placeholder="Иванов"
            value={form.lastName}
            onChange={e => set("lastName", e.target.value)}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = errors.lastName ? "#f87171" : "rgba(255,255,255,0.1)")}
          />
          {errors.lastName && <p style={errorStyle}>{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Имейл</label>
        <input
          type="email"
          style={{ ...inputStyle, borderColor: errors.email ? "#f87171" : "rgba(255,255,255,0.1)" }}
          placeholder="ivan@example.com"
          value={form.email}
          onChange={e => set("email", e.target.value)}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)")}
          onBlur={e => (e.currentTarget.style.borderColor = errors.email ? "#f87171" : "rgba(255,255,255,0.1)")}
        />
        {errors.email && <p style={errorStyle}>{errors.email}</p>}
      </div>

      {/* Phone + City */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Телефон</label>
          <input
            style={{ ...inputStyle, borderColor: errors.phone ? "#f87171" : "rgba(255,255,255,0.1)" }}
            placeholder="+49 151 ..."
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = errors.phone ? "#f87171" : "rgba(255,255,255,0.1)")}
          />
          {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
        </div>
        <div>
          <label style={labelStyle}>Град</label>
          <input
            style={{ ...inputStyle, borderColor: errors.city ? "#f87171" : "rgba(255,255,255,0.1)" }}
            placeholder="Berlin"
            value={form.city}
            onChange={e => set("city", e.target.value)}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = errors.city ? "#f87171" : "rgba(255,255,255,0.1)")}
          />
          {errors.city && <p style={errorStyle}>{errors.city}</p>}
        </div>
      </div>

      {/* Details */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Допълнителни детайли <span style={{ color: "rgba(255,255,255,0.25)", textTransform: "none" }}>(по желание)</span></label>
        <textarea
          rows={3}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
          placeholder={form.category === "energy" ? "Напр. живея в 2-стаен апартамент, сегашен доставчик е Vattenfall..." : "Допълнителна информация..."}
          value={form.details}
          onChange={e => set("details", e.target.value)}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
        />
      </div>

      {/* Consent */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={e => set("consent", e.target.checked)}
            style={{ marginTop: 2, accentColor: "#7c6af7", width: 15, height: 15, flexShrink: 0 }}
          />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
            Съгласен/на съм с{" "}
            <a href="/agb" target="_blank" style={{ color: "#a78bfa" }}>Общите условия</a>{" "}
            и{" "}
            <a href="/datenschutz" target="_blank" style={{ color: "#a78bfa" }}>Политиката за поверителност</a>.
            Разрешавам на Tarifberater24 да ме свърже с партньорски доставчици.
          </span>
        </label>
        {errors.consent && <p style={{ ...errorStyle, marginTop: 6 }}>{errors.consent}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={mutation.isPending}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12,
          background: mutation.isPending ? "rgba(124,106,247,0.5)" : "linear-gradient(135deg, #7c6af7 0%, #6d5ce7 100%)",
          border: "none", color: "white", fontSize: 15, fontWeight: 700,
          cursor: mutation.isPending ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: mutation.isPending ? "none" : "0 4px 20px rgba(124,106,247,0.4)",
          transition: "all 160ms ease-out",
          fontFamily: "var(--font-nbarchitekt)",
        }}
        onMouseEnter={e => { if (!mutation.isPending) { e.currentTarget.style.boxShadow = "0 6px 28px rgba(124,106,247,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,106,247,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}
        onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
        onMouseUp={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
      >
        {mutation.isPending
          ? <><Loader2 size={16} className="animate-spin" /> Изпращане…</>
          : "Получи безплатна оферта →"
        }
      </button>

      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>
        🔒 Данните ти са защитени съгласно DSGVO · Без задължение · Безплатно
      </p>
    </form>
  );
}
