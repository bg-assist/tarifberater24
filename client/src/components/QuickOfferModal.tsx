/**
 * QuickOfferModal — 1-click offer submission for authenticated users.
 * Pre-fills contact data from user profile. Single confirmation step.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { X, Loader2, CheckCircle2, Sparkles } from "lucide-react";

export type OfferCategory =
  | "insurance" | "energy" | "internet" | "mobile"
  | "banking" | "tax" | "legal" | "relocation" | "other";

const CATEGORY_LABELS: Record<OfferCategory, string> = {
  insurance:  "Застраховка",
  energy:     "Ток / Газ",
  internet:   "Интернет",
  mobile:     "Мобилен договор",
  banking:    "Банкиране / Кредит",
  tax:        "Данъчна декларация",
  legal:      "Правна помощ",
  relocation: "Преместване",
  other:      "Друго",
};

interface Props {
  open: boolean;
  onClose: () => void;
  defaultCategory?: OfferCategory;
}

export default function QuickOfferModal({ open, onClose, defaultCategory = "insurance" }: Props) {
  const { user } = useAuth();
  const [category, setCategory] = useState<OfferCategory>(defaultCategory);
  const [details, setDetails]   = useState("");
  const [done, setDone]         = useState(false);

  const mutation = trpc.leads.quickOffer.useMutation({
    onSuccess: () => setDone(true),
  });

  function handleSubmit() {
    mutation.mutate({ category, details: details || undefined, urgency: "diesen_monat" });
  }

  function handleClose() {
    setDone(false);
    setDetails("");
    setCategory(defaultCategory);
    onClose();
  }

  if (!open) return null;

  const overlay: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  };
  const card: React.CSSProperties = {
    background: "#111228", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20, padding: "36px 32px", maxWidth: 420, width: "100%",
    position: "relative",
  };

  return (
    <div style={overlay} onClick={handleClose}>
      <div style={card} onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} style={{ position: "absolute", top: 16, right: 16, color: "var(--color-fog)" }}>
          <X size={18} />
        </button>

        {done ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: "#10b981" }} />
            <h3 className="text-white text-lg font-bold mb-2" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
              Запитването е изпратено!
            </h3>
            <p className="text-sm opacity-60 mb-6">Нашият екип ще се свърже с теб до 24 часа.</p>
            <button onClick={handleClose} className="btn-pill-primary w-full">Затвори</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} style={{ color: "var(--color-dusk-violet)" }} />
              <h3 className="text-white font-bold" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: 16 }}>
                Бързо запитване
              </h3>
            </div>

            {user && (
              <div className="mb-5 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs opacity-50 mb-1" style={{ fontFamily: "var(--font-nbarchitekt)" }}>Изпращач</p>
                <p className="text-white text-sm font-semibold">{user.name}</p>
                <p className="text-xs opacity-40">{user.email}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs mb-2 opacity-60" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
                Категория
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as OfferCategory)}
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", outline: "none" }}
              >
                {(Object.entries(CATEGORY_LABELS) as [OfferCategory, string][]).map(([k, v]) => (
                  <option key={k} value={k} style={{ background: "#111228" }}>{v}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs mb-2 opacity-60" style={{ fontFamily: "var(--font-nbarchitekt)" }}>
                Допълнителни детайли (по желание)
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                rows={3}
                placeholder="Напр. VW Golf 2020, пълна каско…"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white resize-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", outline: "none", color: "white" }}
              />
            </div>

            {mutation.error && (
              <p className="text-xs text-red-400 mb-4">{mutation.error.message}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--color-dusk-violet)" }}
            >
              {mutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Изпращане…</> : "Изпрати запитване →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
