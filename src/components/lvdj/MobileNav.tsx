import { Home, Radio, Church, BookOpen, Users } from "lucide-react";

const items = [
  { icon: Home, label: "Inicio", active: true },
  { icon: Radio, label: "Radio" },
  { icon: Church, label: "Capilla", center: true },
  { icon: BookOpen, label: "Evangelio" },
  { icon: Users, label: "Comunidad" },
];

export const MobileNav = () => (
  <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50">
    <div className="glass border-t border-[hsl(var(--gold)/0.2)] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-end justify-around">
        {items.map((it) => (
          <button key={it.label} className="flex flex-col items-center gap-1 px-2 py-1 min-w-[56px]">
            {it.center ? (
              <div className="-mt-7 h-14 w-14 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center border-4 border-background">
                <it.icon className="h-6 w-6 text-navy-deep" />
              </div>
            ) : (
              <it.icon className={`h-5 w-5 ${it.active ? "text-gold" : "text-foreground/60"}`} />
            )}
            <span className={`text-[10px] ${it.active ? "text-gold" : "text-foreground/60"}`}>{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  </nav>
);