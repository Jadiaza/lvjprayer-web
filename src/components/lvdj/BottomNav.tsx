import { Home, Radio, BookOpen, Music2, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { icon: Home, label: "Inicio", to: "/" },
  { icon: Radio, label: "Radio", to: "#" },
  { icon: BookOpen, label: "Biblia", to: "/biblia" },
  { icon: Music2, label: "Música", to: "/musica" },
  { icon: MoreHorizontal, label: "Más", to: "#" },
];

export const BottomNav = () => {
  const loc = useLocation();
  return (
  <nav className="fixed bottom-0 inset-x-0 z-50">
    <div className="mx-auto max-w-md">
      <div className="glass border-t border-[hsl(var(--gold)/0.2)] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end justify-around">
          {items.map((it) => {
            const active =
              it.to === "/" ? loc.pathname === "/" : it.to !== "#" && loc.pathname.startsWith(it.to);
            return (
              <Link key={it.label} to={it.to} className="flex flex-col items-center gap-1 px-2 py-1 min-w-[56px]">
                <it.icon className={`h-5 w-5 ${active ? "text-gold" : "text-foreground/55"}`} strokeWidth={active ? 2 : 1.6} />
                <span className={`text-[10px] ${active ? "text-gold font-medium" : "text-foreground/55"}`}>{it.label}</span>
                {active && <span className="h-0.5 w-5 rounded-full bg-gradient-gold -mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </nav>
  );
};