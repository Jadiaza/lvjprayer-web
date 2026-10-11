import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import hero2 from "@/assets/hero-2.jpg";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";

const articles = [
  { image: article2, category: "REFLEXIÓN", title: "La oración: abrir el corazón para escuchar a Dios", date: "Contenido de muestra", excerpt: "Un momento de silencio puede convertirse en el comienzo de una conversación que renueva la esperanza." },
  { image: article3, category: "COMUNIDAD", title: "La fe se vive en comunidad y se comparte con alegría", date: "Contenido de muestra", excerpt: "Historias, encuentros y gestos sencillos que nos ayudan a caminar juntos." },
  { image: hero2, category: "MÚSICA", title: "Alabanzas para acompañar tu día y elevar el corazón", date: "Selección editorial", excerpt: "Una selección de música cristiana para tus momentos de oración y encuentro." },
];

const ArticlesGrid = () => (
  <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
    <div className="mb-8 flex items-end justify-between gap-5">
      <div><span className="text-[9px] font-bold uppercase tracking-[.2em] text-primary">PALABRA Y COMUNIDAD</span><h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Voces que inspiran</h2></div>
      <Link to="/blog-sidebar" className="hidden items-center gap-2 pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground hover:text-primary sm:flex">Ver actualidad <ArrowUpRight className="h-3.5 w-3.5" /></Link>
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      {articles.map((article) => <article key={article.title} className="group overflow-hidden border border-border bg-card transition-colors hover:border-primary/50">
        <Link to="/blog-sidebar" className="relative block aspect-[16/10] overflow-hidden"><img src={article.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute bottom-3 left-3 bg-background/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-primary">{article.category}</span></Link>
        <div className="p-5"><div className="mb-3 flex items-center gap-1.5 text-[9px] text-muted-foreground"><CalendarDays className="h-3 w-3" />{article.date}</div><h3 className="font-display text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">{article.title}</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">{article.excerpt}</p><Link to="/blog-sidebar" className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.1em] text-primary">Leer más <ArrowUpRight className="h-3 w-3" /></Link></div>
      </article>)}
    </div>
  </section>
);

export default ArticlesGrid;
