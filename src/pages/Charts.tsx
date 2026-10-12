import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Headphones, ListMusic, Music2, Play } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";
import { getPublicCollection, type PublicAudio, type PublicPlaylist } from "@/lib/publicContent";

const examples = [
  { id: "pescador", title: "Pescador de hombres", artist: "Cesáreo Gabaráin", category: "Cantos de fe", note: "Misión y seguimiento" },
  { id: "nadie", title: "Nadie te ama como yo", artist: "Martín Valverde", category: "Alabanza", note: "Amor de Dios" },
  { id: "alma", title: "Alma misionera", artist: "Canto católico", category: "Cantos de fe", note: "Servicio y misión" },
  { id: "maria", title: "Santa María del camino", artist: "Canto mariano", category: "Marianos", note: "Caminar con María" },
  { id: "espiritu", title: "Ven, Espíritu Santo", artist: "Canto de oración", category: "Alabanza", note: "Oración" },
  { id: "dios", title: "Dios está aquí", artist: "Canto de adoración", category: "Alabanza", note: "Adoración" },
];

const Charts = () => {
  const [filter, setFilter] = useState("Todos");
  const [tab, setTab] = useState<"songs" | "playlists">("songs");
  const [audio, setAudio] = useState<PublicAudio[]>([]);
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([]);
  useEffect(() => {
    getPublicCollection<PublicAudio>("audio").then(setAudio).catch(() => setAudio([]));
    getPublicCollection<PublicPlaylist>("playlists").then(setPlaylists).catch(() => setPlaylists([]));
  }, []);

  const songs = audio.length
    ? audio.map((item) => ({ id: item.id, title: item.title, artist: item.artist_name || "La Voz de Jesús", category: item.category, note: item.description, url: item.audio_url }))
    : examples;
  const filters = ["Todos", ...Array.from(new Set(songs.map((song) => song.category).filter(Boolean)))];
  const visible = useMemo(() => filter === "Todos" ? songs : songs.filter((song) => song.category === filter), [filter, audio]);

  return <main>
    <PageIntro eyebrow="MÚSICA · ALABANZA" title="Cantos para elevar el corazón" description="Música católica y listas de reproducción para acompañar cada momento." />
    {audio.length === 0 && playlists.length === 0 && <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Los ejemplos se reemplazarán por audios y playlists publicados desde el panel editorial.</SampleContentNote></div>}
    <section className="mx-auto max-w-[1440px] px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
      <div className="relative mb-7 overflow-hidden border border-primary/25 bg-[#0a1629] p-6 sm:p-8"><img src="/images/lvj-emblema.png" alt="" className="absolute -right-10 -top-20 h-64 w-64 opacity-15" /><div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center"><div><span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.18em] text-primary"><Music2 className="h-3.5 w-3.5" /> Música LVJ</span><h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">Música para orar y agradecer</h2><p className="mt-2 max-w-xl text-xs leading-6 text-muted-foreground">Cantos católicos, episodios y colecciones publicadas por el equipo editorial.</p></div><a href="#luna-player" className="inline-flex shrink-0 items-center gap-2 self-start border border-primary/60 px-4 py-3 text-[9px] font-bold uppercase tracking-[.12em] text-primary hover:bg-primary hover:text-primary-foreground md:self-center"><Headphones className="h-4 w-4" /> Escuchar la emisora</a></div></div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2"><button type="button" onClick={() => setTab("songs")} className={`inline-flex items-center gap-2 border px-3 py-2 text-[9px] font-bold uppercase tracking-[.1em] ${tab === "songs" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}><Music2 className="h-3.5 w-3.5" /> Audios</button><button type="button" onClick={() => setTab("playlists")} className={`inline-flex items-center gap-2 border px-3 py-2 text-[9px] font-bold uppercase tracking-[.1em] ${tab === "playlists" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}><ListMusic className="h-3.5 w-3.5" /> Playlists</button></div>{tab === "songs" && <div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`border px-3 py-2 text-[9px] font-bold uppercase tracking-[.1em] ${filter === item ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"}`}>{item}</button>)}</div>}</div>
      {tab === "songs" ? <div className="overflow-hidden border border-border"><div className="hidden grid-cols-[55px_1fr_1fr_150px] gap-4 bg-secondary/70 px-5 py-3 text-[8px] font-bold uppercase tracking-[.14em] text-muted-foreground sm:grid"><span>#</span><span>Audio</span><span>Artista / categoría</span><span>Escuchar</span></div>{visible.map((song, index) => <article key={song.id} className="grid gap-3 border-t border-border bg-card px-4 py-4 sm:grid-cols-[55px_1fr_1fr_150px] sm:items-center sm:gap-4 sm:px-5"><span className="font-display text-xl font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span><div><h3 className="font-display text-lg font-semibold text-foreground">{song.title}</h3><small className="text-[9px] text-muted-foreground">{song.note || song.category}</small></div><span className="text-xs text-muted-foreground">{song.artist} · {song.category}</span>{"url" in song && song.url ? <audio controls preload="none" src={song.url} className="h-9 max-w-full" aria-label={`Reproducir ${song.title}`} /> : <span className="text-[9px] text-muted-foreground">Disponible en la emisora</span>}</article>)}{visible.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">Aún no hay audios en esta categoría.</p>}</div>
        : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{playlists.map((playlist) => <article key={playlist.id} className="overflow-hidden border border-border bg-card"><div className="aspect-video bg-[#0a1629]">{playlist.cover_url ? <img loading="lazy" src={playlist.cover_url} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-primary"><ListMusic className="h-12 w-12" /></div>}</div><div className="p-4"><h3 className="font-display text-xl font-bold">{playlist.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{playlist.description}</p><p className="mt-3 text-[9px] font-bold uppercase tracking-widest text-primary">{playlist.tracks?.length || 0} pistas</p><div className="mt-3 space-y-2">{playlist.tracks?.slice(0, 5).map((track, index) => <div key={`${playlist.id}-${index}`} className="flex items-center justify-between gap-3 border-t border-border pt-2 text-xs"><span className="truncate">{track.title}{track.artist ? ` · ${track.artist}` : ""}</span>{track.url && <a href={track.url} target="_blank" rel="noreferrer" aria-label={`Reproducir ${track.title}`} className="text-primary"><Play className="h-3.5 w-3.5" /></a>}</div>)}</div></div></article>)}{playlists.length === 0 && <p className="border border-border p-8 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">Aún no hay playlists publicadas.</p>}</div>}
      <p className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground"><ArrowUpRight className="h-3.5 w-3.5 text-primary" />Las listas se ordenan editorialmente; las posiciones no representan cifras de reproducciones.</p>
    </section>
  </main>;
};

export default Charts;
