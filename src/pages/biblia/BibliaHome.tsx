import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Columns3,
  CalendarCheck2,
  Star,
  StickyNote,
  Bookmark,
  ListTree,
  UserRound,
  MapPin,
  Map as MapIcon,
  History,
  Headphones,
  Settings2,
  Download,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BibliaLayout } from "./BibliaLayout";
import { getMeta } from "@/features/biblia/db";
import { libroById } from "@/features/biblia/books";

interface Tile {
  to: string;
  label: string;
  icon: LucideIcon;
  ready?: boolean;
}

const tiles: Tile[] = [
  { to: "/biblia/leer", label: "Leer Biblia", icon: BookOpen, ready: true },
  { to: "/biblia/buscar", label: "Buscar", icon: Search },
  { to: "/biblia/comparar", label: "Comparar versiones", icon: Columns3 },
  { to: "/biblia/planes", label: "Plan de lectura", icon: CalendarCheck2 },
  { to: "/biblia/favoritos", label: "Favoritos", icon: Star },
  { to: "/biblia/notas", label: "Notas", icon: StickyNote },
  { to: "/biblia/marcadores", label: "Marcadores", icon: Bookmark },
  { to: "/biblia/concordancia", label: "Concordancia", icon: ListTree },
  { to: "/biblia/personajes", label: "Personajes", icon: UserRound },
  { to: "/biblia/lugares", label: "Lugares", icon: MapPin },
  { to: "/biblia/mapas", label: "Mapas", icon: MapIcon },
  { to: "/biblia/cronologias", label: "Cronologías", icon: History },
  { to: "/biblia/audio", label: "Audio Biblia", icon: Headphones },
  { to: "/biblia/configuracion", label: "Configuración", icon: Settings2 },
];

export default function BibliaHome() {
  const [continuar, setContinuar] = useState<{
    libroId: number;
    capitulo: number;
  } | null>(null);
  const [importada, setImportada] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const last = await getMeta<{ libroId: number; capitulo: number }>("ultimaLectura");
      if (last) setContinuar(last);
      const done = await getMeta<boolean>("importDone");
      setImportada(!!done);
    })();
  }, []);

  const libroCont = continuar ? libroById(continuar.libroId) : null;

  return (
    <BibliaLayout title="Biblia">
      {/* Banner bienvenida */}
      <section className="relative overflow-hidden rounded-3xl glass gold-border p-6 mb-5">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-30" />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-[0.28em] text-gold/90 mb-2">
            Palabra de Dios
          </div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight">
            Biblia <span className="gold-text italic">Straubinger</span>
          </h1>
          <p className="text-foreground/75 text-sm mt-2 max-w-md">
            Lee, estudia y medita la Palabra con las notas del Monseñor Juan Straubinger.
          </p>
        </div>
      </section>

      {/* Continuar lectura */}
      {libroCont ? (
        <Link
          to={`/biblia/leer?libro=${libroCont.id}&cap=${continuar!.capitulo}`}
          className="block glass gold-border rounded-2xl p-4 mb-4 hover:bg-[hsl(var(--gold)/0.06)] transition"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-1">
                Continuar lectura
              </div>
              <div className="font-display text-xl">
                {libroCont.nombre} {continuar!.capitulo}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gold" />
          </div>
        </Link>
      ) : (
        <Link
          to={importada ? "/biblia/leer" : "/biblia/importar"}
          className="block glass gold-border rounded-2xl p-4 mb-4 hover:bg-[hsl(var(--gold)/0.06)] transition"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-1">
                {importada ? "Empieza a leer" : "Primer paso"}
              </div>
              <div className="font-display text-xl">
                {importada ? "Abrir la Biblia" : "Importar la Biblia"}
              </div>
              <div className="text-xs text-foreground/60 mt-1">
                {importada
                  ? "Elige un libro y comienza."
                  : "Carga el texto Straubinger y sus notas."}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gold" />
          </div>
        </Link>
      )}

      {/* Importador */}
      <Link
        to="/biblia/importar"
        className="flex items-center justify-between gap-3 glass rounded-2xl px-4 py-3 mb-6 border border-[hsl(var(--gold)/0.2)]"
      >
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-gold/10 flex items-center justify-center">
            <Download className="h-4 w-4 text-gold" />
          </span>
          <div>
            <div className="text-sm font-medium">Importador Straubinger</div>
            <div className="text-[11px] text-foreground/55">
              {importada ? "Biblia cargada localmente" : "Cargar Biblia y comentarios"}
            </div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-gold/70" />
      </Link>

      {/* Accesos */}
      <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold/90 mb-3 px-1">
        Módulos
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={`group relative aspect-square rounded-2xl glass gold-border flex flex-col items-center justify-center gap-1.5 p-2 hover:bg-[hsl(var(--gold)/0.08)] active:scale-95 transition ${
              t.ready ? "" : "opacity-90"
            }`}
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-radial-gold opacity-0 group-hover:opacity-60 transition" />
            <t.icon className="relative h-6 w-6 text-gold" strokeWidth={1.6} />
            <span className="relative text-[10px] leading-tight text-center text-foreground/85 font-medium">
              {t.label}
            </span>
            {!t.ready && (
              <span className="absolute top-1.5 right-1.5 text-[8px] uppercase tracking-wider text-gold/70">
                Pronto
              </span>
            )}
          </Link>
        ))}
      </div>
    </BibliaLayout>
  );
}