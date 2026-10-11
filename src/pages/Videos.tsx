import { ArrowUpRight, Play, Video } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";
import hostImage from "@/assets/article-2.jpg";
import worshipImage from "@/assets/hero-2.jpg";
import communityImage from "@/assets/article-3.jpg";
import scriptureImage from "@/assets/hero-1.jpg";

const videos = [
  { title: "Evangelio del día: una palabra para tu camino", category: "Evangelio", image: scriptureImage, length: "Reflexión" },
  { title: "Santo Rosario: un momento para orar juntos", category: "Oración", image: "/images/lvj-emblema.png", length: "Oración guiada" },
  { title: "Alabanza y música católica en comunidad", category: "Música", image: worshipImage, length: "Música" },
  { title: "Voces de fe: servir con alegría", category: "Testimonios", image: hostImage, length: "Testimonio" },
  { title: "La Iglesia que acompaña a quienes más lo necesitan", category: "Comunidad", image: communityImage, length: "Comunidad" },
  { title: "Conoce más sobre nuestra fe católica", category: "Formación", image: scriptureImage, length: "Catequesis" },
];

const Videos = () => <main>
  <PageIntro eyebrow="VIDEOS · AUDIOVISUAL" title="Fe para mirar, escuchar y compartir" description="Reflexiones, oración, formación y momentos de comunidad en una galería para toda la familia." />
  <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Tarjetas y temas de demostración. Los videos oficiales de LVJ se enlazarán aquí al definir el canal o archivo audiovisual de la emisora.</SampleContentNote></div>
  <section className="mx-auto max-w-[1440px] px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
    <div className="mb-6 flex items-center gap-3"><Video className="h-5 w-5 text-primary" /><div><h2 className="font-display text-2xl font-semibold text-foreground">Galería de contenidos</h2><p className="mt-1 text-[10px] text-muted-foreground">Una selección de temas católicos para la comunidad LVJ.</p></div></div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{videos.map((video) => <article key={video.title} className="group overflow-hidden border border-border bg-card"><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${video.title} católico`)}`} target="_blank" rel="noreferrer" aria-label={`Buscar: ${video.title}`} className="relative block aspect-video overflow-hidden bg-[#0a1629]"><img src={video.image} alt="" className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${String(video.image).includes("lvj-emblema") ? "object-contain p-12" : ""}`} /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" /><span className="absolute left-3 top-3 bg-background/85 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.13em] text-primary">{video.category}</span><span className="absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-[.1em] text-white/85">{video.length}</span><span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110"><Play className="ml-0.5 h-4 w-4 fill-current" /></span></a><div className="flex items-start justify-between gap-4 p-4"><h3 className="font-display text-lg font-semibold leading-snug text-foreground">{video.title}</h3><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${video.title} católico`)}`} target="_blank" rel="noreferrer" aria-label="Buscar contenido" className="mt-1 shrink-0 text-muted-foreground hover:text-primary"><ArrowUpRight className="h-4 w-4" /></a></div></article>)}</div>
  </section>
</main>;

export default Videos;
