import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [, navigate] = useLocation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token"));
  }, []);

  const mutation = trpc.auth.verifyEmail.useMutation();

  useEffect(() => {
    if (token) mutation.mutate({ token });
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#0a0b1a" }}>
      <div style={{ background: "#111228", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "48px 32px", maxWidth: 400, width: "100%", textAlign: "center" }}>
        {!token || mutation.isPending ? (
          <>
            <Loader2 size={40} className="animate-spin mx-auto mb-4" style={{ color: "var(--color-dusk-violet)" }} />
            <p className="text-white font-bold mb-2" style={{ fontFamily: "var(--font-nbarchitekt)" }}>Проверка…</p>
            <p className="text-sm opacity-50">Потвърждаваме имейл адреса ти.</p>
          </>
        ) : mutation.isSuccess ? (
          <>
            <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: "#10b981" }} />
            <h2 className="text-white text-xl font-bold mb-3" style={{ fontFamily: "var(--font-nbarchitekt)" }}>Имейлът е потвърден! ✅</h2>
            <p className="text-sm opacity-60 mb-8">Акаунтът ти е активиран. Можеш да използваш всички функции.</p>
            <button onClick={() => navigate("/")} className="w-full py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: "var(--color-dusk-violet)" }}>
              Към началната страница →
            </button>
          </>
        ) : (
          <>
            <XCircle size={40} className="mx-auto mb-4" style={{ color: "#ef4444" }} />
            <h2 className="text-white text-xl font-bold mb-3" style={{ fontFamily: "var(--font-nbarchitekt)" }}>Невалиден линк</h2>
            <p className="text-sm opacity-60 mb-8">Линкът е изтекъл или вече е използван. Влез и поискай нов.</p>
            <button onClick={() => navigate("/")} className="w-full py-3.5 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ background: "rgba(52,55,85,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Обратно
            </button>
          </>
        )}
      </div>
    </div>
  );
}
