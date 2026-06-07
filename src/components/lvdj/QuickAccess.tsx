import {
  Heart, Mic2, HandHeart, Users, CalendarRange, Gift, BookMarked, Video,
} from "lucide-react";

const items = [
  { icon: Heart, label: "Rosario", desc: "Reza los misterios" },
  { icon: Mic2, label: "Podcast", desc: "Episodios bajo demanda" },
  { icon: HandHeart, label: "Peticiones", desc: "Oración en cadena" },
  { icon: Users, label: "Comunidad", desc: "Únete a fieles" },
  { icon: CalendarRange, label: "Programación", desc: "Semana completa" },
  { icon: Gift, label: "Donaciones", desc: "Sostén la misión" },
  { icon: BookMarked, label: "Recursos", desc: "Catequesis y libros" },
  { icon: Video, label: "Videos", desc: "Misas y conferencias" },
];

export const QuickAccess = () => (
  <section className="container py-20">
    <div className="text-center mb-12">
      <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Explora</div>
      <h2 className="font-display text-4xl md:text-5xl">Accesos Rápidos</h2>
      <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
        Todo lo que necesitas para vivir tu fe, al alcance de un toque.
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <button
          key={it.label}
          className="group relative overflow-hidden rounded-2xl glass p-6 text-left hover:border-[hsl(var(--gold)/0.5)] hover:-translate-y-0.5 transition-all"
        >
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-radial-gold opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold/20 to-transparent border border-[hsl(var(--gold)/0.3)] flex items-center justify-center mb-5 group-hover:bg-gradient-gold transition">
              <it.icon className="h-5 w-5 text-gold group-hover:text-navy-deep transition" />
            </div>
            <div className="font-display text-xl">{it.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{it.desc}</div>
          </div>
        </button>
      ))}
    </div>
  </section>
);