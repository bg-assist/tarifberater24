import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Car, FileText, Shield, Settings, LogOut, ChevronRight, User } from "lucide-react";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" });
}

function formatAmount(cents: number | null | undefined) {
  if (!cents) return "—";
  return `${(cents / 100).toFixed(2)} €`;
}

export default function Profile() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const { data: vehicles } = trpc.vehicles.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: contracts } = trpc.contracts.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: quotes } = trpc.insurance.quotes.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "rgba(52,55,85,0.3)", border: "1px solid var(--color-dusk-violet)" }}
        >
          <User size={28} style={{ color: "var(--color-pale-mist)" }} />
        </div>
        <h2
          className="text-white mb-2"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "20px", fontWeight: 700 }}
        >
          Вашият профил
        </h2>
        <p
          className="mb-6"
          style={{ fontFamily: "var(--font-times)", fontSize: "15px", color: "var(--color-pale-mist)", lineHeight: 1.7, maxWidth: 400 }}
        >
          Влезте в профила си, за да видите вашите данни, автомобили и договори.
        </p>
        <a href={getLoginUrl() ?? "/"} className="btn-pill-primary">
          Вход / Регистрация
        </a>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* User card */}
      <div className="ghost-card mb-6 animate-fade-in-up" style={{ padding: "24px" }}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ background: "var(--color-dusk-violet)", color: "#fff", fontFamily: "var(--font-nbarchitekt)" }}
          >
            {(user?.name ?? "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "18px" }}
            >
              {user?.name ?? "Потребител"}
            </div>
            <div
              style={{ fontFamily: "var(--font-times)", fontSize: "13px", color: "var(--color-pale-mist)" }}
            >
              {user?.email ?? "—"}
            </div>
            <div className="tag-pill inline-block mt-2" style={{ fontSize: "9px" }}>
              BG Assist Member
            </div>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="btn-ghost-nav flex items-center gap-1"
            style={{ padding: "6px 12px", fontSize: "10px", flexShrink: 0 }}
          >
            <Settings size={12} /> Настройки
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-up delay-100">
        {[
          { label: "Автомобили", value: vehicles?.length ?? 0, icon: Car },
          { label: "Договори", value: contracts?.length ?? 0, icon: FileText },
          { label: "Оферти", value: quotes?.length ?? 0, icon: Shield },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="ghost-card text-center"
            style={{ padding: "16px 8px" }}
          >
            <Icon size={18} style={{ color: "var(--color-pale-mist)", margin: "0 auto 8px" }} />
            <div
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "22px" }}
            >
              {value}
            </div>
            <div
              style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "10px", color: "var(--color-fog)", textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Vehicles */}
      <section className="mb-6 animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-white"
            style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            Автомобили
          </h2>
          <button
            onClick={() => navigate("/insurance")}
            className="btn-ghost-nav"
            style={{ padding: "3px 10px", fontSize: "10px" }}
          >
            + Добави
          </button>
        </div>
        {vehicles && vehicles.length > 0 ? (
          <div className="ghost-card" style={{ padding: 0, overflow: "hidden" }}>
            {vehicles.map((v, i) => (
              <div
                key={v.id}
                className="flex items-center gap-4 px-5 py-4 border-b last:border-b-0"
                style={{ borderColor: "var(--color-ash-border)" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(52,55,85,0.3)", border: "1px solid rgba(52,55,85,0.6)" }}
                >
                  <Car size={16} color="#fff" />
                </div>
                <div className="flex-1">
                  <div
                    className="text-white font-bold"
                    style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px" }}
                  >
                    {v.make} {v.model} ({v.year})
                  </div>
                  <div
                    style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-smoke)" }}
                  >
                    {v.licensePlate ?? "Без номер"} · {v.fuelType}
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: "var(--color-ash-border)" }} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="ghost-card text-center py-6"
            style={{ color: "var(--color-fog)", fontFamily: "var(--font-times)", fontSize: "14px" }}
          >
            Нямате добавени автомобили.{" "}
            <button
              onClick={() => navigate("/insurance")}
              style={{ color: "var(--color-pale-mist)", textDecoration: "underline" }}
            >
              Добавете сега
            </button>
          </div>
        )}
      </section>

      {/* Contracts */}
      <section className="mb-6 animate-fade-in-up delay-300">
        <h2
          className="text-white mb-3"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          Активни договори
        </h2>
        {contracts && contracts.length > 0 ? (
          <div className="ghost-card" style={{ padding: 0, overflow: "hidden" }}>
            {contracts.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 px-5 py-4 border-b last:border-b-0"
                style={{ borderColor: "var(--color-ash-border)" }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: c.status === "active" ? "#10b981" : "var(--color-fog)" }}
                />
                <div className="flex-1">
                  <div
                    className="text-white font-bold"
                    style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "13px" }}
                  >
                    {c.provider}
                  </div>
                  <div
                    style={{ fontFamily: "var(--font-times)", fontSize: "12px", color: "var(--color-smoke)" }}
                  >
                    {c.notes ?? c.type} · {formatAmount(c.monthlyAmount)}/мес
                  </div>
                </div>
                <div
                  style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "10px", color: "var(--color-fog)" }}
                >
                  до {formatDate(c.endDate)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="ghost-card text-center py-6"
            style={{ color: "var(--color-fog)", fontFamily: "var(--font-times)", fontSize: "14px" }}
          >
            Нямате активни договори.
          </div>
        )}
      </section>

      {/* Logout */}
      <div className="animate-fade-in-up delay-400">
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border transition-all hover:bg-red-500/10"
          style={{
            borderColor: "rgba(239,68,68,0.3)",
            color: "rgba(239,68,68,0.8)",
            fontFamily: "var(--font-nbarchitekt)",
            fontSize: "13px",
          }}
        >
          <LogOut size={16} /> Изход
        </button>
      </div>
    </div>
  );
}
