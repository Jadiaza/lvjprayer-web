import { Church, Heart, Mic2, HandHeart, Users, BookOpen, CalendarRange, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  { icon: Church, label: "Capilla\nVirtual", to: "#" },
  { icon: Heart, label: "Rosario", to: "#" },
  { icon: Mic2, label: "Podcast", to: "#" },
  { icon: HandHeart, label: "Peticiones", to: "#" },
  { icon: Users, label: "Comunidad", to: "#" },
  { icon: BookOpen, label: "Biblia", to: "/biblia" },
  { icon: CalendarRange, label: "Programa", to: "#" },
  { icon: Gift, label: "Donar", to: "#" },
];

export const QuickAccess = ({ compact = false }: { compact?: boolean }) => (
  <div>
    <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/90 mb-3 px-1">
      Accesos Rápidos
    </div>
    <div
      className={`grid gap-2.5 ${
        compact ? "grid-cols-3" : "grid-cols-4 md:grid-cols-8"
      }`}
    >
      {(compact ? items.slice(0, 6) : items).map((it) => (
        <Link
          key={it.label}
          to={it.to}
          className="group relative aspect-square rounded-2xl glass gold-border flex flex-col items-center justify-center gap-1.5 p-1.5 hover:bg-[hsl(var(--gold)/0.08)] active:scale-95 transition"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-radial-gold opacity-0 group-hover:opacity-60 transition" />
          <it.icon className="relative h-6 w-6 text-gold" strokeWidth={1.6} />
          <span className="relative text-[10px] leading-tight text-center text-foreground/85 font-medium whitespace-pre-line">
            {it.label}
          </span>
        </Link>
      ))}
    </div>
  </div>
);