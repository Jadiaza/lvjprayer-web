import { useMemo, useState } from "react";
import { ArrowUpRight, Headphones, Music2, Play } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";

const songs = [
  { title: "Pescador de hombres", artist: "Cesáreo Gabaráin", category: "Cantos de fe", note: "Misión y seguimiento" },
  { title: "Nadie te ama como yo", artist: "Martín Valverde", category: "Alabanza", note: "Amor de Dios" },
  { title: "Alma misionera", artist: "Canto católico", category: "Cantos de fe", note: "Servicio y misión" },
  { title: "Santa María del camino", artist: "Canto mariano", category: "Marianos", note: "Caminar con María" },
  { title: "Ven, Espíritu Santo", artist: "Canto de oración", category: "Alabanza", note: "Oración" },
  { title: "Dios está aquí", artist: "Canto de adoración", category: "Alabanza", note: "Adoración" },
];
const filters = ["Todos", "Alabanza", "Marianos", "Cantos de fe"];

const Charts = () => {
  const [filter, setFilter] = useState("Todos");
  const visible = useMemo(() => filter === "Todos" ? songs : songs.filter((song) => song.category === filter), [filter]);
  return <main>
    <PageIntro eyebrow="MÚSICA · ALABANZA" title="Cantos para elevar el corazón" description="Una selección de música católica, cantos de oración y alabanzas para acompañar cada momento." />
    <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Selección musical de muestra, no un ranking de reproducciones. La lista oficial se definirá con el equipo de LVJ.</SampleContentNote></div>
    <section className="mx-auto max-w-[1440px] px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
      <div className="relative mb-7 overflow-hidden border border-primary/25 bg-[#0a1629] p-6 sm:p-8"><img src="/images/lvj-emblema.png" alt="" className="absolute -right-10 -top-20 h-64 w-64 opacity-15" /><div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.18em] text-primary"><Music2 className="h-3.5 w-3.5" /> Selección editorial</span><h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Música para orar y agradecer</h2><p className="mt-2 max-w-xl text-xs leading-6 text-muted-foreground">Cantos católicos que nos recuerdan el amor de Dios y la alegría de caminar en comunidad.</p></div><a href="#luna-player" className="inline-flex shrink-0 items-center gap-2 self-start border border-primary/60 px-4 py-3 text-[9px] font-bold uppercase tracking-[.12em] text-primary hover:bg-primary hover:text-primary-foreground md:self-center"><Headphones className="h-4 w-4" /> Escuchar la emisora</a></div></div>
      <div className="mb-5 flex flex-wrap gap-2">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`border px-3 py-2 text-[9px] font-bold uppercase tracking-[.1em] ${filter === item ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"}`}>{item}</button>)}</div>
      <div className="overflow-hidden border border-border"><div className="hidden grid-cols-[55px_1fr_1fr_150px] gap-4 bg-secondary/70 px-5 py-3 text-[8px] font-bold uppercase tracking-[.14em] text-muted-foreground sm:grid"><span>#</span><span>Canto</span><span>Artista / referencia</span><span>Escuchar</span></div>{visible.map((song, index) => <article key={song.title} className="grid gap-3 border-t border-border bg-card px-4 py-4 sm:grid-cols-[55px_1fr_1fr_150px] sm:items-center sm:gap-4 sm:px-5"><span className="font-display text-xl font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span><div><h3 className="font-display text-lg font-semibold text-foreground">{song.title}</h3><small className="text-[9px] text-muted-foreground">{song.note}</small></div><span className="text-xs text-muted-foreground">{song.artist}</span><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.title} ${song.artist} católico`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.1em] text-primary"><Play className="h-3.5 w-3.5" /> Buscar música <ArrowUpRight className="h-3 w-3" /></a></article>)}</div>
    </section>
  </main>;
};

export default Charts;
