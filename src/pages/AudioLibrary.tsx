import { useEffect, useMemo, useState } from "react";
import { AudioLines, Search } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";
import { getPublicCollection, type PublicAudio } from "@/lib/publicContent";

export default function AudioLibrary() {
  const [items, setItems] = useState<PublicAudio[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => { getPublicCollection<PublicAudio>("audio").then(setItems).catch(() => setItems([])); }, []);
  const categories = useMemo(() => ["Todos", ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const [category, setCategory] = useState("Todos");
  const filtered = items.filter((item) => (category === "Todos" || category === item.category) && `${item.title} ${item.artist_name || ""} ${item.description}`.toLowerCase().includes(query.toLowerCase()));

  return <main>
    <PageIntro eyebrow="AUDIOS · PODCASTS" title="Escucha y comparte la fe" description="Reflexiones, oraciones y episodios para acompañar tu día desde cualquier lugar." />
    {items.length === 0 && <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Los episodios aparecerán aquí al publicarse desde el panel editorial.</SampleContentNote></div>}
    <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><AudioLines className="h-5 w-5 text-primary" /><div><h2 className="font-display text-2xl font-bold">Biblioteca de audio</h2><p className="text-xs text-muted-foreground">Episodios publicados por LVJ.</p></div></div><label className="flex h-10 items-center gap-2 border border-border px-3"><Search className="h-4 w-4 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar audios" className="w-40 bg-transparent text-sm outline-none" /></label></div>
      <div className="mb-5 flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`border px-3 py-2 text-[9px] font-bold uppercase tracking-widest ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{item}</button>)}</div>
      <div className="grid gap-3 sm:grid-cols-2">{filtered.map((item) => <article key={item.id} className="flex gap-4 border border-border bg-card p-4">{item.cover_url ? <img loading="lazy" src={item.cover_url} alt="" className="h-20 w-20 shrink-0 object-cover" /> : <div className="grid h-20 w-20 shrink-0 place-items-center bg-secondary text-primary"><AudioLines className="h-7 w-7" /></div>}<div className="min-w-0 flex-1"><span className="text-[9px] font-bold uppercase tracking-widest text-primary">{item.category}</span><h3 className="truncate font-display text-lg font-bold">{item.title}</h3><p className="truncate text-[10px] text-muted-foreground">{item.artist_name || item.description}</p><audio controls preload="none" src={item.audio_url} className="mt-2 h-8 max-w-full" aria-label={`Reproducir ${item.title}`} /></div></article>)}</div>
      {filtered.length === 0 && items.length > 0 && <p className="border border-border p-8 text-center text-sm text-muted-foreground">No encontramos audios para esa búsqueda.</p>}
    </section>
  </main>;
}
