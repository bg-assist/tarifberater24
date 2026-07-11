import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Mail, CheckCircle2, Loader2, RefreshCw } from "lucide-react";

interface Props { children: React.ReactNode; soft?: boolean; }

export default function EmailVerificationGate({ children, soft = false }: Props) {
  const { isAuthenticated } = useAuth();
  const [resent, setResent] = useState(false);
  const { data, isLoading } = trpc.auth.emailVerified.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30_000 });
  const resend = trpc.auth.sendVerificationEmail.useMutation({ onSuccess: () => setResent(true) });

  if (!isAuthenticated || isLoading || data?.verified) return <>{children}</>;

  if (soft) {
    return (
      <>
        <div className="w-full px-4 py-2.5 flex items-center gap-3" style={{ background: "rgba(52,55,85,0.3)", borderBottom: "1px solid rgba(52,55,85,0.5)" }}>
          <Mail size={14} style={{ color: "var(--color-dusk-violet)", flexShrink: 0 }} />
          <span className="flex-1 text-white opacity-70" style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: 11 }}>
            Потвърди имейл адреса си, за да активираш акаунта.
          </span>
          {resent ? (
            <span className="text-xs flex items-center gap-1" style={{ color: "#10b981" }}><CheckCircle2 size={11} /> Изпратено</span>
          ) : (
            <button onClick={() => resend.mutate()} disabled={resend.isPending} className="text-xs flex items-center gap-1 hover:opacity-80 disabled:opacity-40" style={{ color: "var(--color-dusk-violet)", fontFamily: "var(--font-nbarchitekt)" }}>
              {resend.isPending ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Изпрати отново
            </button>
          )}
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-sm w-full" style={{ background: "rgba(17,18,40,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "48px 32px" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(52,55,85,0.4)", border: "2px solid var(--color-dusk-violet)" }}>
          <Mail size={24} style={{ color: "var(--color-dusk-violet)" }} />
        </div>
        <h2 className="text-white text-xl font-bold mb-3" style={{ fontFamily: "var(--font-nbarchitekt)" }}>Потвърди имейла си</h2>
        <p className="text-sm opacity-60 mb-8 leading-relaxed">Провери входящата поща за имейл от Tarifberater24 и кликни линка за потвърждение.</p>
        {resent ? (
          <div className="flex items-center justify-center gap-2 py-3 rounded-xl mb-4 text-sm" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>
            <CheckCircle2 size={15} /> Имейлът е изпратен!
          </div>
        ) : (
          <button onClick={() => resend.mutate()} disabled={resend.isPending} className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50" style={{ background: "var(--color-dusk-violet)" }}>
            {resend.isPending ? <><Loader2 size={15} className="animate-spin" /> Изпращане…</> : <><RefreshCw size={15} /> Изпрати отново</>}
          </button>
        )}
      </div>
    </div>
  );
}
