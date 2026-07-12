import { useLocation } from "wouter";
import { Bot, House, LayoutGrid, Newspaper, UserRound } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Start", Icon: House },
  { path: "/services", label: "Services", Icon: LayoutGrid },
  { path: "/assistant", label: "Assistent", Icon: Bot },
  { path: "/news", label: "News", Icon: Newspaper },
  { path: "/profile", label: "Profil", Icon: UserRound },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  return (
    <nav className="premium-bottom-nav md:hidden" aria-label="Mobile Navigation">
      {NAV_ITEMS.map(({ path, label, Icon }) => {
        const active = location === path || (path !== "/" && location.startsWith(path));
        return <button key={path} onClick={()=>navigate(path)} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined} aria-label={label}>
          <span className="premium-bottom-icon"><Icon size={18} strokeWidth={active ? 2 : 1.55}/></span><small>{label}</small>
        </button>;
      })}
    </nav>
  );
}
