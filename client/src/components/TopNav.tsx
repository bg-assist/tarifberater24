import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const NAV_ITEMS = [
  { path: "/", label: "Начало" },
  { path: "/services", label: "Услуги" },
  { path: "/partners", label: "Partner" },
  { path: "/assistant", label: "Асистент" },
  { path: "/news", label: "Новини" },
];

export default function TopNav() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="top-nav">
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mr-auto group"
        aria-label="Tarifberater24"
      >
        <div className="w-7 h-7 rounded-full border border-[var(--color-dusk-violet)] flex items-center justify-center relative overflow-hidden animate-pulse-glow">
          <div className="w-3 h-3 rounded-full bg-[var(--color-dusk-violet)] opacity-80" />
          <div className="absolute inset-0 rounded-full border border-[var(--color-dusk-violet)] opacity-30 scale-150" />
        </div>
        <span
          className="font-bold text-white hidden sm:block"
          style={{ fontFamily: "var(--font-nbarchitekt)", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          Tarifberater24
        </span>
      </button>

      {/* Desktop nav items */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="btn-ghost-nav transition-all duration-200"
              style={{
                background: isActive ? "var(--color-dusk-violet)" : "transparent",
                borderColor: isActive ? "var(--color-dusk-violet)" : "rgba(255,255,255,0.4)",
                color: isActive ? "#fff" : "var(--color-pale-mist)",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Get Offer CTA */}
      <button
        onClick={() => navigate("/get-offer")}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "var(--color-dusk-violet)", marginLeft: "8px" }}
      >
        Angebot anfragen
      </button>

      {/* Auth */}
      <div className="ml-2 flex items-center gap-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{ background: "var(--color-dusk-violet)", color: "#fff" }}
              onClick={() => navigate("/profile")}
              title={user?.name ?? "Профил"}
            >
              {(user?.name ?? "?")[0].toUpperCase()}
            </div>
          </div>
        ) : (
          <a href={getLoginUrl()} className="btn-ghost-nav">
            Вход
          </a>
        )}
      </div>
    </nav>
  );
}
