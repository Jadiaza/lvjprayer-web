import { useEffect, useState } from "react";
import { ArrowUpRight, Music2, Users } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";
import { getPublicCollection, type PublicArtist } from "@/lib/publicContent";

export default function Artists() {
  const [artists, setArtists] = useState<PublicArtist[]>([]);
  useEffect(() => { getPublicCollection<PublicArtist>("artists").then(setArtists).catch(() => setArtists([])); }, []);

  return <main>
    <PageIntro eyebrow="ARTISTAS · MÚSICA CATÓLICA" title="Voces que anuncian esperanza" description="Conoce a los músicos y ministerios que ponen sus talentos al servicio de la fe." />
    {artists.length === 0 && <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Los perfiles aparecerán aquí cuando se publiquen desde el panel editorial.</SampleContentNote></div>}
    <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mb-6 flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><div><h2 className="font-display text-2xl font-bold">Artistas y ministerios</h2><p className="text-xs text-muted-foreground">Perfiles seleccionados por La Voz de Jesús.</p></div></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{artists.map((artist) => <article key={artist.id} className="overflow-hidden border border-border bg-card"><div className="aspect-[4/3] bg-secondary">{artist.image_url ? <img loading="lazy" src={artist.image_url} alt={artist.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-primary"><Music2 className="h-12 w-12" /></div>}</div><div className="p-5"><h3 className="font-display text-2xl font-bold">{artist.name}</h3><p className="mt-2 line-clamp-4 text-xs leading-6 text-muted-foreground">{artist.bio}</p><div className="mt-4 flex flex-wrap gap-4">{artist.website_url && <a href={artist.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">Sitio oficial <ArrowUpRight className="h-3 w-3" /></a>}{Object.entries(artist.social_links || {}).map(([label, url]) => /^https:\/\//.test(url) && <a key={label} href={url} target="_blank" rel="noreferrer" className="text-[10px] font-semibold capitalize text-muted-foreground hover:text-primary">{label} ↗</a>)}</div></div></article>)}</div>
      {artists.length > 0 && <div className="mt-8 flex items-center gap-3 border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground"><Music2 className="h-4 w-4 shrink-0 text-primary" />Escucha sus canciones y selecciones en <a className="font-bold text-primary underline" href="/charts-elementor">Alabanzas y playlists</a>.</div>}
    </section>
  </main>;
}
