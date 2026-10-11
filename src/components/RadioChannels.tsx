import { BookOpenText, CalendarHeart, Headphones, HeartHandshake, Music2 } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { title: "La Palabra", detail: "Reflexiones para tu camino", href: "/blog-sidebar", icon: BookOpenText },
  { title: "Programación", detail: "Acompáñanos cada día", href: "/shows-schedule", icon: CalendarHeart },
  { title: "Alabanzas", detail: "Música para orar", href: "/charts-elementor", icon: Music2 },
  { title: "Comunidad", detail: "Oramos y caminamos juntos", href: "/contacts", icon: HeartHandshake },
];

const RadioChannels = () => (
  <section className="relative isolate overflow-hidden border-y border-border bg-[#0a1629]">
    <div className="absolute inset-0 -z-10 opacity-20"><img src="/images/lvj-emblema.png" alt="" className="absolute -right-24 -top-44 h-[500px] w-[500px] object-contain" /></div>
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><span className="text-[9px] font-bold uppercase tracking-[.2em] text-primary">ENCUENTRA TU MOMENTO</span><h2 className="mt-2 font-display text-3xl font-bold text-foreground">Una radio, muchas formas de encontrarnos</h2></div><Link to="/videos-elementor" className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground hover:text-primary">Ver todos los contenidos ↗</Link></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map(({ title, detail, href, icon: Icon }) => <Link key={title} to={href} className="group flex min-h-24 items-center gap-4 border border-white/10 bg-background/55 px-4 py-4 transition-all hover:border-primary/70 hover:bg-background/85"><span className="grid h-11 w-11 shrink-0 place-items-center border border-primary/40 text-primary"><Icon className="h-5 w-5" /></span><span className="min-w-0"><strong className="block font-display text-lg font-semibold text-foreground group-hover:text-primary">{title}</strong><small className="mt-1 block text-[10px] text-muted-foreground">{detail}</small></span><Headphones className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-primary" /></Link>)}
      </div>
    </div>
  </section>
);

export default RadioChannels;
