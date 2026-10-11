import { ArrowRight, CalendarDays, Clock3, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsHighlights } from "@/pages/News";
import HeroCarousel from "@/components/HeroCarousel";
import RadioChannels from "@/components/RadioChannels";
import { SampleContentNote } from "@/components/PageIntro";

const todayPrograms = [
  { time: "06:00", title: "Al despertar con María", kind: "Oración de la mañana" },
  { time: "08:00", title: "La Palabra de hoy", kind: "Evangelio y reflexión" },
  { time: "12:00", title: "El Ángelus", kind: "Oración en comunidad" },
  { time: "20:00", title: "Santo Rosario", kind: "Misterios y peticiones" },
];

const Index = () => (
  <main>
    <HeroCarousel />
    <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Los programas y publicaciones de esta portada son ejemplos católicos; se reemplazarán por la programación y el contenido oficial de La Voz de Jesús.</SampleContentNote></div>
    <RadioChannels />
    <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-12 lg:py-20">
      <div className="self-center"><span className="text-[9px] font-bold uppercase tracking-[.2em] text-primary">ACOMPAÑAMIENTO PARA CADA DÍA</span><h2 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">La fe también se escucha.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">Encuentra momentos de oración, reflexiones del Evangelio y música católica para compartir en familia y comunidad.</p><Link to="/shows-schedule" className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-primary">Conoce la programación <ArrowRight className="h-3.5 w-3.5" /></Link></div>
      <div className="border border-border bg-card p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-4"><div><span className="text-[9px] font-bold uppercase tracking-[.18em] text-primary">EN LA EMISORA</span><h3 className="mt-1 font-display text-2xl font-semibold text-foreground">Programación destacada</h3></div><CalendarDays className="h-5 w-5 text-primary" /></div>
        <div className="divide-y divide-border">{todayPrograms.map((program) => <div key={program.time} className="flex items-center gap-4 py-3.5"><span className="w-12 shrink-0 font-display text-base font-semibold text-primary">{program.time}</span><div className="min-w-0 flex-1"><strong className="block truncate text-sm text-foreground">{program.title}</strong><small className="mt-1 block text-[10px] text-muted-foreground">{program.kind}</small></div><Clock3 className="h-3.5 w-3.5 text-muted-foreground" /></div>)}</div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4"><span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[.12em] text-muted-foreground"><Radio className="h-3.5 w-3.5 text-emerald-400" /> Parrilla de muestra</span><Link to="/shows-schedule" className="text-[10px] font-bold uppercase tracking-[.1em] text-primary">Semana completa →</Link></div>
      </div>
    </section>
    <NewsHighlights />
    <section className="border-y border-border bg-[#0a1629]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center lg:px-12">
        <div><span className="text-[9px] font-bold uppercase tracking-[.2em] text-primary">ESTAMOS PARA ACOMPAÑARTE</span><h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">Compartamos una intención de oración.</h2><p className="mt-2 text-xs text-muted-foreground">Escríbenos por WhatsApp y caminemos juntos en la fe.</p></div>
        <a href="https://api.whatsapp.com/send?phone=573028375008&amp;text=Hola%2C%20escucho%20La%20Voz%20de%20Jes%C3%BAs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-primary/60 px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-primary hover:bg-primary hover:text-primary-foreground">Contactar a LVJ <ArrowRight className="h-3.5 w-3.5" /></a>
      </div>
    </section>
  </main>
);

export default Index;
