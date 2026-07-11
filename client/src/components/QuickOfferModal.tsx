/**
 * QuickOfferModal — 1-click offer submission for authenticated users.
 * Pre-fills contact data from user profile. Polished success animation.
 */
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { X, Loader2, CheckCircle2, Sparkles, Send, Zap } from "lucide-react";

export type OfferCategory =
  | "insurance" | "energy" | "internet" | "mobile"
  | "banking" | "tax" | "legal" | "relocation" | "other";

const CATEGORY_LABELS: Record<OfferCategory, { label: string; emoji: string }> = {
  insurance:  { label: "Застраховка",        emoji: "🛡️" },
  energy:     { label: "Ток / Газ",           emoji: "⚡" },
  internet:   { label: "Интернет",            emoji: "🌐" },
  mobile:     { label: "Мобилен договор",     emoji: "📱" },
  banking:    { label: "Банкиране / Кредит",  emoji: "🏦" },
  tax:        { label: "Данъчна декларация",  emoji: "📋" },
  legal:      { label: "Правна помощ",        emoji: "⚖️" },
  relocation: { label: "Преместване",         emoji: "🏠" },
  other:      { label: "Друго",               emoji: "💬" },
};

interface Props {
  open: boolean;
  onClose: () => void;
  defaultCategory?: OfferCategory;
}

/* ─── Confetti particle ─────────────────────────────────────── */
interface Particle { id: number; x: number; y: number; vx: number; vy: number; color: string; size: number; opacity: number; rotation: number; }

const CONFETTI_COLORS = ["#7c6af7", "#a78bfa", "#10b981", "#34d399", "#f59e0b", "#60a5fa"];

function useConfetti(active: boolean) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setParticles([]); return; }

    const initial: Particle[] = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 45,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 6 + 3),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 6 + 4,
      opacity: 1,
      rotation: Math.random() * 360,
    }));
    setParticles(initial);

    let frame = 0;
    const animate = () => {
      frame++;
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx * 0.6,
            y: p.y + p.vy * 0.6 + frame * 0.04,
            vy: p.vy + 0.18,
            opacity: Math.max(0, p.opacity - 0.018),
            rotation: p.rotation + p.vx * 3,
          }))
          .filter(p => p.opacity > 0)
      );
      if (frame < 90) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active]);

  return particles;
}

/* ─── Component ─────────────────────────────────────────────── */
export default function QuickOfferModal({ open, onClose, defaultCategory = "insurance" }: Props) {
  const { user } = useAuth();
  const [category, setCategory] = useState<OfferCategory>(defaultCategory);
  const [details, setDetails]   = useState("");
  const [done, setDone]         = useState(false);
  const [visible, setVisible]   = useState(false);
  const [btnScale, setBtnScale] = useState(1);

  const particles = useConfetti(done);

  const mutation = trpc.leads.quickOffer.useMutation({
    onSuccess: () => setDone(true),
  });

  // Animate modal in/out
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => { setDone(false); setDetails(""); setCategory(defaultCategory); }, 280);
      return () => clearTimeout(t);
    }
  }, [open, defaultCategory]);

  function handleSubmit() {
    setBtnScale(0.96);
    setTimeout(() => setBtnScale(1), 150);
    mutation.mutate({ category, details: details || undefined, urgency: "diesen_monat" });
  }

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  if (!open) return null;

  /* ── Styles ── */
  const overlay: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    opacity: visible ? 1 : 0,
    transition: "opacity 250ms cubic-bezier(0.23,1,0.32,1)",
  };
  const card: React.CSSProperties = {
    background: "linear-gradient(145deg, #13142e 0%, #0f1024 100%)",
    border: "1px solid rgba(124,106,247,0.2)",
    borderRadius: 24,
    padding: "36px 32px",
    maxWidth: 440,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
    transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(16px)",
    transition: "transform 280ms cubic-bezier(0.23,1,0.32,1)",
  };

  return (
    <div style={overlay} onClick={handleClose}>
      <div style={card} onClick={e => e.stopPropagation()}>

        {/* Ambient glow */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{ position: "absolute", top: 16, right: 16, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 160ms ease-out" }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
        >
          <X size={15} />
        </button>

        {/* ── SUCCESS STATE ── */}
        {done ? (
          <div className="text-center py-6" style={{ position: "relative" }}>
            {/* Confetti canvas */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
              {particles.map(p => (
                <div key={p.id} style={{
                  position: "absolute",
                  left: `${p.x}%`, top: `${p.y}%`,
                  width: p.size, height: p.size,
                  background: p.color,
                  borderRadius: p.size > 7 ? "2px" : "50%",
                  opacity: p.opacity,
                  transform: `rotate(${p.rotation}deg)`,
                  transition: "none",
                }} />
              ))}
            </div>

            {/* Pulsing check icon */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "pulse-success 1.8s ease-in-out infinite",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(16,185,129,0.15)",
                  border: "2px solid rgba(16,185,129,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CheckCircle2 size={28} style={{ color: "#10b981" }} />
                </div>
              </div>
            </div>

            <h3 style={{ color: "white", fontSize: 20, fontWeight: 700, fontFamily: "var(--font-nbarchitekt)", marginBottom: 8 }}>
              Запитването е изпратено! 🎉
            </h3>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
              Получихме твоето запитване за
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(124,106,247,0.15)", border: "1px solid rgba(124,106,247,0.3)", borderRadius: 20, padding: "4px 14px", marginBottom: 20 }}>
              <span style={{ fontSize: 15 }}>{CATEGORY_LABELS[category].emoji}</span>
              <span style={{ color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>{CATEGORY_LABELS[category].label}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>
              Нашият екип ще се свърже с теб до <strong style={{ color: "rgba(255,255,255,0.7)" }}>24 часа</strong>.
            </p>

            {/* Timeline steps */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
              {[
                { icon: "✅", text: "Запитването е получено", done: true },
                { icon: "📞", text: "Консултант ще се свърже с теб", done: false },
                { icon: "📄", text: "Получаваш персонализирана оферта", done: false },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ fontSize: 14 }}>{step.icon}</span>
                  <span style={{ fontSize: 12, color: step.done ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)" }}>{step.text}</span>
                  {step.done && <span style={{ marginLeft: "auto", fontSize: 10, color: "#10b981", fontWeight: 600 }}>ГОТОВО</span>}
                </div>
              ))}
            </div>

            <button
              onClick={handleClose}
              style={{ width: "100%", padding: "13px 0", borderRadius: 12, background: "rgba(124,106,247,0.2)", border: "1px solid rgba(124,106,247,0.4)", color: "#a78bfa", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 160ms ease-out" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,106,247,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,106,247,0.2)"; }}
            >
              Затвори
            </button>
          </div>
        ) : (
          /* ── FORM STATE ── */
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(124,106,247,0.2)", border: "1px solid rgba(124,106,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={16} style={{ color: "#a78bfa" }} />
              </div>
              <div>
                <h3 style={{ color: "white", fontWeight: 700, fontFamily: "var(--font-nbarchitekt)", fontSize: 16, margin: 0 }}>Бързо запитване</h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0 }}>Отговор до 24 часа</p>
              </div>
            </div>

            {/* User card */}
            {user && (
              <div style={{ marginBottom: 20, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #7c6af7, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>{(user.name ?? "U")[0].toUpperCase()}</span>
                </div>
                <div>
                  <p style={{ color: "white", fontSize: 13, fontWeight: 600, margin: 0 }}>{user.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0 }}>{user.email}</p>
                </div>
                <div style={{ marginLeft: "auto", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, padding: "2px 8px" }}>
                  <span style={{ color: "#10b981", fontSize: 10, fontWeight: 600 }}>ВЕРИФИЦИРАН</span>
                </div>
              </div>
            )}

            {/* Category pills */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10, fontFamily: "var(--font-nbarchitekt)", letterSpacing: "0.05em" }}>
                КАТЕГОРИЯ
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(Object.entries(CATEGORY_LABELS) as [OfferCategory, { label: string; emoji: string }][]).map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() => setCategory(k)}
                    style={{
                      padding: "5px 11px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                      fontWeight: category === k ? 700 : 400,
                      background: category === k ? "rgba(124,106,247,0.25)" : "rgba(255,255,255,0.05)",
                      border: category === k ? "1px solid rgba(124,106,247,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      color: category === k ? "#c4b5fd" : "rgba(255,255,255,0.5)",
                      transition: "all 150ms ease-out",
                      transform: category === k ? "scale(1.03)" : "scale(1)",
                    }}
                  >
                    {v.emoji} {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontFamily: "var(--font-nbarchitekt)", letterSpacing: "0.05em" }}>
                ДОПЪЛНИТЕЛНИ ДЕТАЙЛИ <span style={{ color: "rgba(255,255,255,0.25)" }}>(по желание)</span>
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                rows={3}
                placeholder="Напр. VW Golf 2020, пълна каско…"
                style={{
                  width: "100%", borderRadius: 12, padding: "10px 14px",
                  fontSize: 13, color: "white", resize: "none", outline: "none",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "inherit", lineHeight: 1.5,
                  transition: "border-color 150ms ease-out",
                  boxSizing: "border-box",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,106,247,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {mutation.error && (
              <p style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>{mutation.error.message}</p>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 12,
                background: mutation.isPending
                  ? "rgba(124,106,247,0.4)"
                  : "linear-gradient(135deg, #7c6af7 0%, #6d5ce7 100%)",
                border: "none", color: "white", fontSize: 14, fontWeight: 700,
                cursor: mutation.isPending ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transform: `scale(${btnScale})`,
                transition: "transform 160ms cubic-bezier(0.23,1,0.32,1), opacity 160ms ease-out, background 200ms ease-out",
                opacity: mutation.isPending ? 0.7 : 1,
                boxShadow: mutation.isPending ? "none" : "0 4px 20px rgba(124,106,247,0.4)",
              }}
              onMouseEnter={e => { if (!mutation.isPending) e.currentTarget.style.boxShadow = "0 6px 28px rgba(124,106,247,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = mutation.isPending ? "none" : "0 4px 20px rgba(124,106,247,0.4)"; }}
            >
              {mutation.isPending
                ? <><Loader2 size={16} className="animate-spin" /> Изпращане…</>
                : <><Send size={15} /> Изпрати запитване</>
              }
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>
              🔒 Данните ти са защитени съгласно DSGVO
            </p>
          </>
        )}

        {/* Keyframe injection */}
        <style>{`
          @keyframes pulse-success {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.85; }
          }
        `}</style>
      </div>
    </div>
  );
}
