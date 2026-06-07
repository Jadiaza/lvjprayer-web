import { Radio, BookOpen, CalendarClock, ArrowUpRight } from "lucide-react";
import mic from "@/assets/microphone.jpg";
import bible from "@/assets/bible.jpg";
import rosary from "@/assets/rosary.jpg";

const cards = [
  {
    icon: Radio,
    tag: "Radio en Vivo",
    title: "Santa Misa Matutina",
    meta: "Padre Antonio Rivera · Ahora",
    img: mic,
  },
  {
    icon: BookOpen,
    tag: "Evangelio del Día",
    title: "Mateo 6, 25-34",
    meta: "«No se preocupen por su vida»",
    img: bible,
  },
  {
    icon: CalendarClock,
    tag: "Próximo Programa",
    title: "Santo Rosario",
    meta: "Hoy · 18:00 hrs",
    img: rosary,
  },
];

export const FeatureCards = () => (
  <section className="container py-20">
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((c) => (
        <article
          key={c.tag}
          className="group relative overflow-hidden rounded-3xl glass hover:border-[hsl(var(--gold)/0.5)] transition-all duration-500 hover:-translate-y-1"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={c.img} alt={c.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 glass rounded-full px-3 py-1.5">
              <c.icon className="h-3.5 w-3.5 text-gold" />
              <span className="text-[11px] uppercase tracking-widest">{c.tag}</span>
            </div>
          </div>
          <div className="p-6 pt-5">
            <h3 className="font-display text-2xl leading-tight">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.meta}</p>
            <div className="mt-5 flex items-center justify-between">
              <button className="text-sm font-medium text-gold inline-flex items-center gap-1.5 group/btn">
                Acceder
                <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition" />
              </button>
              <div className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gradient-gold transition">
                <c.icon className="h-4 w-4 text-gold group-hover:text-navy-deep transition" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);