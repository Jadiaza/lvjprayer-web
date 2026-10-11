import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, Search } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";
import { getPublishedNews, isNewsConnected, sampleNews, type NewsItem, type NewsRegion } from "@/lib/newsClient";

const regions: { label: string; value: "all" | NewsRegion }[] = [
  { label: "Todas", value: "all" }, { label: "Iglesia universal", value: "universal" }, { label: "Colombia", value: "colombia" }, { label: "Comunidades LVJ", value: "local" },
];
const dateLabel = (value: string | null) => value ? new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(new Date(value)) : "Actualidad";

function usePublishedNews() {
  const [items, setItems] = useState<NewsItem[]>(isNewsConnected ? [] : sampleNews);
  const [loading, setLoading] = useState(isNewsConnected);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isNewsConnected) return;
    getPublishedNews().then(setItems).catch(() => setError("No pudimos cargar las noticias ahora. Intenta de nuevo más tarde.")).finally(() => setLoading(false));
  }, []);
  return { items, loading, error };
}

export function NewsHighlights() {
  const { items } = usePublishedNews();
  const latest = items.slice(0, 3);
  return <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
    <div className="mb-7 flex items-end justify-between gap-4"><div><span className="text-[9px] font-bold uppercase tracking-[.2em] text-primary">IGLESIA · COLOMBIA · COMUNIDAD</span><h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Noticias con esperanza</h2></div><Link to="/noticias" className="text-[10px] font-bold uppercase tracking-[.12em] text-primary">Todas las noticias ↗</Link></div>
    <div className="grid gap-4 md:grid-cols-3">{latest.map((item) => <Link key={item.id} to={`/noticias/${item.slug}`} className="group overflow-hidden border border-border bg-card hover:border-primary/60"><div className="aspect-[16/9] overflow-hidden bg-[#0a1629]"><img src={item.image_url || "/images/lvj-emblema.png"} alt="" className={`h-full w-full ${item.image_url ? "object-cover" : "object-contain p-12"}`} /></div><div className="p-5"><span className="text-[9px] font-bold uppercase tracking-[.14em] text-primary">{item.region === "local" ? item.community || "Comunidad LVJ" : item.region === "colombia" ? "Colombia" : item.category}</span><h3 className="mt-2 font-display text-xl font-semibold leading-snug text-foreground group-hover:text-primary">{item.title}</h3><p className="mt-2 line-clamp-3 text-xs leading-6 text-muted-foreground">{item.summary}</p></div></Link>)}{latest.length === 0 && <p className="border border-border p-5 text-sm text-muted-foreground md:col-span-3">Las próximas noticias de LVJ aparecerán aquí.</p>}</div>
  </section>;
}

const News = () => {
  const { slug } = useParams();
  const { items, loading, error } = usePublishedNews();
  const [region, setRegion] = useState<"all" | NewsRegion>("all");
  const [query, setQuery] = useState("");
  const article = slug ? items.find((item) => item.slug === slug) : null;
  const filtered = useMemo(() => items.filter((item) => (region === "all" || item.region === region) && `${item.title} ${item.summary} ${item.community || ""}`.toLowerCase().includes(query.toLowerCase())), [items, region, query]);

  if (slug) return <main>
    {article ? <><PageIntro eyebrow={`${article.category} · ${article.region === "local" ? article.community || "Comunidad LVJ" : article.region === "colombia" ? "Colombia" : "Iglesia"}`} title={article.title} description={article.summary} /><article className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12"><div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />{dateLabel(article.published_at)}</span><span>Por {article.author_name}</span></div>{article.image_url && <img src={article.image_url} alt="" className="mb-7 max-h-[440px] w-full object-cover" />}<div className="whitespace-pre-line text-sm leading-8 text-foreground">{article.body || article.summary}</div>{article.source_url && <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">Fuente consultada: {article.source_name || "Medio original"} · <a className="text-primary underline" href={article.source_url} target="_blank" rel="noreferrer">Ver publicación original <ArrowUpRight className="inline h-3 w-3" /></a></p>}<Link to="/noticias" className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-primary"><ArrowLeft className="h-4 w-4" /> Volver a noticias</Link></article></> : <div className="mx-auto max-w-3xl px-5 py-16 text-center"><h1 className="font-display text-3xl font-bold">Noticia no encontrada</h1><Link to="/noticias" className="mt-5 inline-block text-primary">Ver noticias</Link></div>}
  </main>;

  return <main>
    <PageIntro eyebrow="ACTUALIDAD · IGLESIA · COMUNIDAD" title="Noticias con esperanza" description="Información de la Iglesia y las comunidades locales, revisada y compartida por La Voz de Jesús." />
    {!isNewsConnected && <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Vista de demostración. Conecta Supabase para mostrar publicaciones reales de LVJ.</SampleContentNote></div>}
    {error && <p role="alert" className="mx-auto max-w-[1440px] px-5 pt-5 text-sm text-destructive sm:px-8 lg:px-12">{error}</p>}
    <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2">{regions.map((item) => <button key={item.value} onClick={() => setRegion(item.value)} className={`border px-3 py-2 text-[9px] font-bold uppercase tracking-[.08em] ${region === item.value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{item.label}</button>)}</div><label className="flex h-10 items-center gap-2 border border-border px-3"><Search className="h-4 w-4 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar noticias" className="bg-transparent text-sm outline-none" /></label></div>
      {loading ? <p className="py-12 text-center text-sm text-muted-foreground">Cargando noticias…</p> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <article key={item.id} className="overflow-hidden border border-border bg-card"><Link to={`/noticias/${item.slug}`} className="group block"><div className="aspect-[16/9] overflow-hidden bg-[#0a1629]"><img src={item.image_url || "/images/lvj-emblema.png"} alt="" className={`h-full w-full transition-transform group-hover:scale-[1.02] ${item.image_url ? "object-cover" : "object-contain p-12"}`} /></div><div className="p-5"><div className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[.12em] text-primary"><span>{item.region === "local" ? item.community || "Comunidad LVJ" : item.region === "colombia" ? "Colombia" : item.category}</span><span className="font-medium normal-case text-muted-foreground">{dateLabel(item.published_at)}</span></div><h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-foreground group-hover:text-primary">{item.title}</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">{item.summary}</p><span className="mt-4 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[.1em] text-primary">Leer noticia <ArrowUpRight className="h-3 w-3" /></span></div></Link></article>)}{filtered.length === 0 && <p className="border border-border p-8 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">Aún no hay noticias publicadas en esta sección.</p>}</div>}
    </section>
  </main>;
};

export default News;