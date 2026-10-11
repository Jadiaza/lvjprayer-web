import { useMemo, useState } from "react";
import { ArrowRight, BookOpenText, CalendarDays, Search } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";
import hero1 from "@/assets/hero-1.jpg";

const posts = [
  { category: "Evangelio", title: "La Palabra de Dios ilumina nuestras decisiones cotidianas", excerpt: "Una pausa para escuchar el Evangelio y preguntarnos cómo llevar su mensaje a la vida de cada día.", image: article2, date: "Reflexión de muestra" },
  { category: "Oración", title: "El Santo Rosario: contemplar a Jesús con María", excerpt: "Recorrer los misterios del Rosario puede ayudarnos a hacer silencio, agradecer y poner nuestras intenciones ante Dios.", image: "/images/lvj-emblema.png", date: "Guía de oración" },
  { category: "Comunidad", title: "La fe se fortalece cuando caminamos juntos", excerpt: "La escucha, el servicio y la oración compartida hacen visible el cuidado fraterno en nuestras comunidades.", image: article3, date: "Vida de comunidad" },
  { category: "Formación", title: "Los sacramentos acompañan las etapas de la vida cristiana", excerpt: "Un recorrido introductorio por los signos de gracia que celebramos como Iglesia Católica.", image: hero1, date: "Catequesis de muestra" },
];
const categories = ["Todos", "Evangelio", "Oración", "Comunidad", "Formación"];

const Blog = () => {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => posts.filter((post) => (category === "Todos" || post.category === category) && `${post.title} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase())), [category, query]);

  return <main>
    <PageIntro eyebrow="BLOG · FE Y VIDA" title="Reflexiones para caminar con esperanza" description="Evangelio, oración y vida de Iglesia en un espacio para aprender, compartir y crecer en la fe." />
    <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Artículos de demostración. Las reflexiones y noticias reales de LVJ se administrarán desde el panel de contenidos.</SampleContentNote></div>
    <div className="mx-auto grid max-w-[1440px] gap-9 px-5 py-9 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-12 lg:py-12">
      <section>
        <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-sm border px-3 py-2 text-[9px] font-bold uppercase tracking-[.1em] transition-colors ${category === item ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>{item}</button>)}</div><label className="flex h-9 items-center gap-2 border border-border px-3"><Search className="h-3.5 w-3.5 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar artículos" className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground sm:w-40" /></label></div>
        <div className="space-y-5">{visible.map((post) => <article key={post.title} className="grid overflow-hidden border border-border bg-card sm:grid-cols-[220px_1fr]"><img src={post.image} alt="" className="h-48 w-full object-cover sm:h-full" /><div className="p-5 sm:p-6"><div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.12em] text-primary"><span>{post.category}</span><span className="text-border">·</span><span className="flex items-center gap-1 text-muted-foreground"><CalendarDays className="h-3 w-3" />{post.date}</span></div><h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-foreground">{post.title}</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">{post.excerpt}</p><button type="button" className="mt-4 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.12em] text-primary">Leer reflexión <ArrowRight className="h-3.5 w-3.5" /></button></div></article>)}{visible.length === 0 && <p className="border border-border p-8 text-center text-sm text-muted-foreground">No encontramos artículos con esos filtros.</p>}</div>
      </section>
      <aside className="space-y-5">
        <div className="border border-border bg-card p-5"><h2 className="font-display text-xl font-semibold text-foreground">Evangelio y oración</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">Regálate unos minutos de silencio para leer la Palabra y presentar tus intenciones.</p><a href="https://www.vaticannews.va/es/evangelio-de-hoy.html" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.1em] text-primary">Evangelio del día <BookOpenText className="h-3.5 w-3.5" /></a></div>
        <div className="relative overflow-hidden border border-primary/25 bg-[#0a1629] p-5"><img src="/images/lvj-emblema.png" alt="" className="absolute -right-8 -top-9 h-28 w-28 opacity-25" /><span className="relative text-[9px] font-bold uppercase tracking-[.16em] text-primary">Una pausa de fe</span><p className="relative mt-3 font-display text-xl leading-snug text-foreground">“Permanezcan en mi amor.”</p><span className="relative mt-2 block text-[10px] text-muted-foreground">Juan 15, 9</span></div>
        <div className="border border-border p-5"><h2 className="font-display text-lg font-semibold text-foreground">Temas</h2><div className="mt-3 grid gap-2">{categories.slice(1).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className="flex justify-between border-b border-border/70 py-2 text-left text-xs text-muted-foreground hover:text-primary"><span>{item}</span><span>→</span></button>)}</div></div>
      </aside>
    </div>
  </main>;
};

export default Blog;
