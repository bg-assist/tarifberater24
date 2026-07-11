import { useLocation } from "wouter";
import { Home, Grid3X3, MessageCircle, Newspaper, User } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Начало", Icon: Home },
  { path: "/services", label: "Услуги", Icon: Grid3X3 },
  { path: "/assistant", label: "Асистент", Icon: MessageCircle },
  { path: "/news", label: "Новини", Icon: Newspaper },
  { path: "/profile", label: "Профил", Icon: User },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="bottom-nav md:hidden">
      {NAV_ITEMS.map(({ path, label, Icon }) => {
        const isActive = location === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-200"
            style={{ color: isActive ? "var(--color-ghost-white)" : "var(--color-smoke)" }}
            aria-label={label}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2 : 1.5}
              style={{ color: isActive ? "var(--color-dusk-violet)" : undefined }}
            />
            <span
              style={{
                fontFamily: "var(--font-nbarchitekt)",
                fontSize: "9px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: isActive ? "var(--color-ghost-white)" : "var(--color-smoke)",
              }}
            >
              {label}
            </span>
            {isActive && (
              <span
                className="absolute bottom-0 w-8 h-0.5 rounded-full"
                style={{ background: "var(--color-dusk-violet)" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
