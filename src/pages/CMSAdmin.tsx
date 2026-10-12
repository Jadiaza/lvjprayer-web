import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  AudioLines, CalendarDays, Check, ChevronRight, FileText, Film, Image,
  LayoutDashboard, ListMusic, LogOut, Music2, Palette, Plus, Radio,
  RefreshCw, Save, Settings2, Trash2, Users, Newspaper,
} from "lucide-react";
import { isNewsConnected, supabase } from "@/lib/newsClient";

type Field = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "url" | "date" | "time" | "number" | "color" | "select" | "json";
  required?: boolean;
  options?: string[];
  hint?: string;
};
type Module = {
  key: string;
  title: string;
  table: string;
  description: string;
  icon: typeof Radio;
  fields: Field[];
  sortBy?: string;
};

const modules: Module[] = [
  {
    key: "sources", title: "Fuentes RSS", table: "news_sources", description: "Administra feeds aprobados para la bandeja editorial de noticias.",
    icon: Newspaper, sortBy: "name",
    fields: [
      { key: "name", label: "Nombre de la fuente", required: true },
      { key: "feed_url", label: "URL RSS o Atom", kind: "url", required: true },
      { key: "region", label: "Sección", kind: "select", options: ["universal", "colombia", "local"] },
      { key: "is_enabled", label: "Feed activo", kind: "select", options: ["true", "false"] },
    ],
  },
  {
    key: "programs", title: "Programación", table: "programs", description: "Programas, horarios, presentadores y enlaces de escucha.",
    icon: CalendarDays, sortBy: "sort_order",
    fields: [
      { key: "title", label: "Nombre del programa", required: true },
      { key: "slug", label: "URL amigable", required: true },
      { key: "summary", label: "Descripción", kind: "textarea" },
      { key: "category", label: "Categoría" },
      { key: "host_name", label: "Presentador" },
      { key: "weekday", label: "Día", kind: "select", options: ["Todos los días", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] },
      { key: "start_time", label: "Hora de inicio", kind: "time" },
      { key: "end_time", label: "Hora de fin", kind: "time" },
      { key: "schedule_text", label: "Notas del horario", hint: "Opcional: frecuencia o notas adicionales." },
      { key: "stream_url", label: "Enlace de audio", kind: "url" },
      { key: "cover_url", label: "Imagen de portada", kind: "url" },
      { key: "sort_order", label: "Orden", kind: "number" },
      { key: "status", label: "Estado", kind: "select", options: ["draft", "published", "archived"] },
    ],
  },
  {
    key: "audio", title: "Audios y episodios", table: "audio_items", description: "Podcast, reflexiones, oraciones y contenidos para escuchar.",
    icon: AudioLines, sortBy: "updated_at",
    fields: [
      { key: "title", label: "Título", required: true },
      { key: "slug", label: "URL amigable", required: true },
      { key: "description", label: "Descripción", kind: "textarea" },
      { key: "artist_name", label: "Artista o voz" },
      { key: "category", label: "Categoría" },
      { key: "audio_url", label: "URL del audio", kind: "url", required: true },
      { key: "cover_url", label: "Imagen de portada", kind: "url" },
      { key: "duration_seconds", label: "Duración en segundos", kind: "number" },
      { key: "status", label: "Estado", kind: "select", options: ["draft", "published", "archived"] },
    ],
  },
  {
    key: "artists", title: "Artistas", table: "artists", description: "Perfiles de músicos y ministerios católicos.",
    icon: Users, sortBy: "name",
    fields: [
      { key: "name", label: "Nombre", required: true },
      { key: "slug", label: "URL amigable", required: true },
      { key: "bio", label: "Biografía", kind: "textarea" },
      { key: "image_url", label: "Imagen", kind: "url" },
      { key: "website_url", label: "Sitio web", kind: "url" },
      { key: "social_links", label: "Redes sociales (JSON)", kind: "json", hint: 'Ej.: {"instagram":"https://..."}' },
      { key: "status", label: "Estado", kind: "select", options: ["draft", "published", "archived"] },
    ],
  },
  {
    key: "videos", title: "Videos", table: "videos", description: "Videos, predicaciones y catequesis. Usa enlaces de YouTube o Vimeo.",
    icon: Film, sortBy: "updated_at",
    fields: [
      { key: "title", label: "Título", required: true },
      { key: "slug", label: "URL amigable", required: true },
      { key: "description", label: "Descripción", kind: "textarea" },
      { key: "category", label: "Categoría" },
      { key: "video_url", label: "Enlace de video", kind: "url", required: true },
      { key: "thumbnail_url", label: "Miniatura", kind: "url" },
      { key: "status", label: "Estado", kind: "select", options: ["draft", "published", "archived"] },
    ],
  },
  {
    key: "playlists", title: "Playlists", table: "playlists", description: "Colecciones y listas de música para la audiencia.",
    icon: ListMusic, sortBy: "updated_at",
    fields: [
      { key: "title", label: "Nombre", required: true },
      { key: "slug", label: "URL amigable", required: true },
      { key: "description", label: "Descripción", kind: "textarea" },
      { key: "cover_url", label: "Imagen de portada", kind: "url" },
      { key: "tracks", label: "Pistas (JSON)", kind: "json", hint: 'Lista de objetos con title, artist y url.' },
      { key: "status", label: "Estado", kind: "select", options: ["draft", "published", "archived"] },
    ],
  },
  {
    key: "pages", title: "Páginas y portada", table: "content_pages", description: "Textos y páginas editables que consume el sitio público.",
    icon: FileText, sortBy: "updated_at",
    fields: [
      { key: "title", label: "Título", required: true },
      { key: "slug", label: "Identificador de página", required: true },
      { key: "summary", label: "Resumen", kind: "textarea" },
      { key: "body", label: "Contenido", kind: "textarea" },
      { key: "status", label: "Estado", kind: "select", options: ["draft", "published", "archived"] },
    ],
  },
  {
    key: "media", title: "Biblioteca de medios", table: "media_assets", description: "Catálogo de imágenes, audios y videos mediante URL.",
    icon: Image, sortBy: "updated_at",
    fields: [
      { key: "title", label: "Nombre del recurso", required: true },
      { key: "asset_type", label: "Tipo", kind: "select", options: ["image", "audio", "video", "document"] },
      { key: "url", label: "URL del recurso", kind: "url", required: true },
      { key: "alt_text", label: "Texto alternativo / descripción" },
      { key: "status", label: "Estado", kind: "select", options: ["draft", "published", "archived"] },
    ],
  },
  {
    key: "themes", title: "Tiempos litúrgicos", table: "liturgical_themes", description: "Programa la identidad visual por fecha litúrgica.",
    icon: Palette, sortBy: "start_date",
    fields: [
      { key: "title", label: "Nombre de la celebración o tiempo", required: true },
      { key: "slug", label: "Identificador", required: true },
      { key: "season", label: "Tiempo litúrgico", kind: "select", options: ["Adviento", "Navidad", "Cuaresma", "Triduo Pascual", "Pascua", "Tiempo Ordinario", "Solemnidad"] },
      { key: "start_date", label: "Desde", kind: "date", required: true },
      { key: "end_date", label: "Hasta", kind: "date", required: true },
      { key: "primary_color", label: "Color principal", kind: "color" },
      { key: "accent_color", label: "Color de acento", kind: "color" },
      { key: "background_color", label: "Fondo", kind: "color" },
      { key: "image_url", label: "Imagen o arte de temporada", kind: "url" },
      { key: "status", label: "Estado", kind: "select", options: ["scheduled", "active", "inactive"] },
    ],
  },
  {
    key: "settings", title: "Ajustes del sitio", table: "site_settings", description: "Identidad, enlaces y opciones públicas del sitio.",
    icon: Settings2, sortBy: "key",
    fields: [
      { key: "key", label: "Clave del ajuste", required: true },
      { key: "value", label: "Valor (JSON)", kind: "json", required: true, hint: 'Ej.: "La Voz de Jesús" o {"facebook":"https://..."}' },
      { key: "is_public", label: "Visible en sitio (true/false)" },
    ],
  },
];

const statusLabel = (value: unknown) => {
  const status = String(value ?? "");
  return ({ published: "Publicado", draft: "Borrador", archived: "Archivado", active: "Activo", inactive: "Inactivo", scheduled: "Programado" } as Record<string, string>)[status] || status || "Sin estado";
};
const blankRecord = (module: Module): Record<string, string> => Object.fromEntries(module.fields.map((field) => [
  field.key,
  field.kind === "json" ? (field.key === "tracks" ? "[]" : "{}") : field.kind === "color" ? "#D8A23A" : field.key === "status" ? (field.options?.[0] || "draft") : "",
]));

export default function CMSAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [roleReady, setRoleReady] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeKey, setActiveKey] = useState("dashboard");
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  const activeModule = useMemo(() => modules.find((module) => module.key === activeKey) || null, [activeKey]);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!supabase || !session) { setRoleAllowed(false); setRoleReady(true); return () => { cancelled = true; }; }
    setRoleReady(false);
    void supabase.from("user_roles").select("role").eq("user_id", session.user.id).in("role", ["admin", "editor"]).then(({ data, error }) => {
      if (cancelled) return;
      setRoleAllowed(!error && (data ?? []).length > 0);
      setRoleReady(true);
    });
    return () => { cancelled = true; };
  }, [session]);

  const loadRows = useCallback(async () => {
    if (!supabase || !roleAllowed || !activeModule) { setRows([]); return; }
    setBusy(true);
    const client = supabase as any;
    let query = client.from(activeModule.table).select("*").limit(100);
    if (activeModule.sortBy === "sort_order") query = query.order("sort_order", { ascending: true });
    else query = query.order(activeModule.sortBy || "updated_at", { ascending: activeModule.sortBy === "key" || activeModule.sortBy === "name" || activeModule.sortBy === "start_date" });
    const { data, error } = await query;
    setBusy(false);
    if (error) { setRows([]); setNotice(error.message); return; }
    setRows(data ?? []);
  }, [activeModule, roleAllowed]);

  useEffect(() => { void loadRows(); }, [loadRows]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setNotice("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false); setPassword("");
    if (error) setNotice(error.message);
  };

  const editRow = (row: Record<string, any>) => {
    if (!activeModule) return;
    setEditingId(String(row.id ?? row.key));
    setDraft(Object.fromEntries(activeModule.fields.map((field) => {
      const value = row[field.key];
      if (field.kind === "json") return [field.key, JSON.stringify(value ?? (field.key === "tracks" ? [] : {}), null, 2)];
      if (field.kind === "date" && value) return [field.key, String(value).slice(0, 10)];
      return [field.key, value == null ? "" : String(value)];
    })));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !activeModule || !roleAllowed) return;
    const payload: Record<string, unknown> = {};
    for (const field of activeModule.fields) {
      const value = draft[field.key] ?? "";
      if (field.kind === "json") {
        try { payload[field.key] = JSON.parse(value || (field.key === "tracks" ? "[]" : "{}")); }
        catch { setNotice(`El campo «${field.label}» debe tener JSON válido.`); return; }
      } else if (field.kind === "number") payload[field.key] = value === "" ? null : Number(value);
      else if (field.key === "is_public" || field.key === "is_enabled") payload[field.key] = value.toLowerCase() === "true";
      else payload[field.key] = value === "" ? null : value;
    }
    payload.updated_at = new Date().toISOString();
    setBusy(true); setNotice("");
    const client = supabase as any;
    const query = editingId
      ? client.from(activeModule.table).update(payload).eq(activeModule.key === "settings" ? "key" : "id", editingId)
      : client.from(activeModule.table).insert(payload);
    const { error } = await query;
    setBusy(false);
    if (error) { setNotice(error.message); return; }
    setNotice(editingId ? "Cambios guardados." : "Contenido creado.");
    setDraft(blankRecord(activeModule)); setEditingId(null);
    await loadRows();
  };

  const removeRow = async (row: Record<string, any>) => {
    if (!supabase || !activeModule || !roleAllowed) return;
    const label = String(row.title || row.name || row.key || "este elemento");
    if (!window.confirm(`¿Eliminar «${label}»? Esta acción no se puede deshacer.`)) return;
    const client = supabase as any;
    const { error } = await client.from(activeModule.table).delete().eq(activeModule.key === "settings" ? "key" : "id", row.id ?? row.key);
    if (error) setNotice(error.message); else { setNotice("Elemento eliminado."); await loadRows(); }
  };

  const filteredRows = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  const countModules = modules.map((module) => ({ ...module, count: module.key === activeKey ? rows.length : undefined }));

  if (!ready) return <div className="p-12 text-center text-muted-foreground">Verificando sesión editorial…</div>;
  if (!isNewsConnected) return <main className="mx-auto max-w-2xl px-5 py-16"><h1 className="font-display text-3xl font-bold">Administración LVJ</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Configura VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en Vercel.</p></main>;
  if (!session) return <main className="mx-auto grid min-h-screen max-w-md content-center px-5 py-12"><Link to="/" className="text-xs text-primary">← La Voz de Jesús</Link><div className="mt-6 border border-border bg-card p-6"><span className="text-[9px] font-bold uppercase tracking-[.2em] text-primary">LVJ · ADMINISTRACIÓN</span><h1 className="mt-2 font-display text-3xl font-bold">Panel editorial</h1><p className="mt-2 text-sm text-muted-foreground">Gestiona el contenido y la identidad del sitio.</p><form onSubmit={signIn} className="mt-6 grid gap-4"><label className="grid gap-2 text-xs text-muted-foreground">Correo<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 border border-border bg-background px-3 text-foreground" /></label><label className="grid gap-2 text-xs text-muted-foreground">Contraseña<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 border border-border bg-background px-3 text-foreground" /></label><button disabled={busy} className="bg-gradient-lvj px-4 py-3 text-xs font-bold uppercase text-primary-foreground">{busy ? "Ingresando…" : "Iniciar sesión"}</button></form>{notice && <p role="alert" className="mt-4 text-xs text-destructive">{notice}</p>}</div></main>;
  if (!roleReady) return <p className="p-10 text-center text-muted-foreground">Verificando permisos editoriales…</p>;
  if (!roleAllowed) return <main className="mx-auto max-w-xl px-5 py-16 text-center"><h1 className="font-display text-3xl font-bold">Acceso no autorizado</h1><p className="mt-3 text-sm text-muted-foreground">La cuenta no tiene rol de editor o administrador.</p><button onClick={() => void supabase.auth.signOut()} className="mt-5 text-primary underline">Cerrar sesión</button></main>;

  const NavItem = ({ keyName, label, icon: Icon }: { keyName: string; label: string; icon: typeof Radio }) => (
    <button onClick={() => { setActiveKey(keyName); setEditingId(null); setNotice(""); }} className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition ${activeKey === keyName ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
      <Icon className="h-4 w-4 shrink-0" /><span className="flex-1">{label}</span>{activeKey === keyName && <ChevronRight className="h-3.5 w-3.5" />}
    </button>
  );

  return <main className="min-h-screen bg-background">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5"><img src="/images/lvj-emblema.png" className="h-8 w-8 rounded-full object-cover" alt="" /><div><div className="text-[9px] font-bold uppercase tracking-[.15em] text-primary">LVJ · CMS</div><div className="font-display text-sm font-bold">Administración</div></div></div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <NavItem keyName="dashboard" label="Resumen" icon={LayoutDashboard} />
        <div className="px-3 pb-1 pt-5 text-[9px] font-bold uppercase tracking-[.16em] text-muted-foreground">Publicaciones</div>
        <a href="/admin/noticias" className="flex items-center gap-3 px-3 py-2.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"><Newspaper className="h-4 w-4" />Noticias y fuentes</a>
        {countModules.slice(0, 8).map((module) => <NavItem key={module.key} keyName={module.key} label={module.title} icon={module.icon} />)}
        <div className="px-3 pb-1 pt-5 text-[9px] font-bold uppercase tracking-[.16em] text-muted-foreground">Sitio</div>
        {countModules.slice(8).map((module) => <NavItem key={module.key} keyName={module.key} label={module.title} icon={module.icon} />)}
      </nav>
      <div className="border-t border-border p-3"><a href="/" className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary">Ver sitio público ↗</a><button onClick={() => void supabase?.auth.signOut()} className="flex w-full items-center gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-primary"><LogOut className="h-4 w-4" />Cerrar sesión</button></div>
    </aside>
    <section className="min-h-screen lg:pl-64">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur sm:px-8"><div><span className="text-[9px] font-bold uppercase tracking-[.16em] text-primary">LA VOZ DE JESÚS</span><h1 className="font-display text-lg font-bold">{activeModule?.title || "Centro de publicación"}</h1></div><div className="flex items-center gap-3"><span className="hidden text-xs text-muted-foreground sm:block">{session.user.email}</span><button onClick={() => void loadRows()} title="Actualizar" className="border border-border p-2 text-muted-foreground hover:text-primary"><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} /></button><button onClick={() => void supabase?.auth.signOut()} title="Salir" className="border border-border p-2 text-muted-foreground hover:text-primary"><LogOut className="h-4 w-4" /></button></div></header>
      <div className="grid gap-6 p-5 sm:p-8">
        {notice && <div role="status" className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary"><Check className="h-4 w-4" />{notice}</div>}
        {activeKey === "dashboard" ? <div className="mx-auto w-full max-w-6xl space-y-7"><div><span className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">ESTUDIO EDITORIAL</span><h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Todo el sitio, en un solo panel.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Administra publicaciones, audio, programas, videos, artistas, playlists y la identidad litúrgica de La Voz de Jesús.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{modules.map((module) => { const Icon = module.icon; return <button key={module.key} onClick={() => setActiveKey(module.key)} className="group border border-border bg-card p-5 text-left transition hover:border-primary/60"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" /></div><h3 className="mt-4 font-display text-xl font-bold">{module.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{module.description}</p></button>; })}<a href="/admin/noticias" className="group border border-border bg-card p-5 transition hover:border-primary/60"><span className="grid h-10 w-10 place-items-center bg-primary/10 text-primary"><Newspaper className="h-5 w-5" /></span><h3 className="mt-4 font-display text-xl font-bold">Noticias y fuentes</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Revisa titulares sindicados y redacta noticias propias antes de publicarlas.</p></a></div><div className="border border-border bg-card p-5"><h3 className="font-display text-lg font-bold">Publicación responsable</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">El contenido externo llega como propuesta para revisión; no se publica automáticamente. Los recursos de audio y video se administran mediante enlaces para cuidar espacio y rendimiento.</p></div></div>
        : activeModule && <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"><section className="min-w-0"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs text-muted-foreground">{activeModule.description}</p><p className="mt-1 text-[10px] text-muted-foreground">Mostrando hasta 100 elementos.</p></div><div className="flex gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar…" className="h-9 w-48 border border-border bg-card px-3 text-xs" /><button onClick={() => { setDraft(blankRecord(activeModule)); setEditingId(null); }} className="inline-flex items-center gap-2 bg-gradient-lvj px-3 py-2 text-xs font-bold text-primary-foreground"><Plus className="h-4 w-4" /> Nuevo</button></div></div><div className="space-y-2">{filteredRows.map((row) => <article key={row.id ?? row.key} className="flex items-center justify-between gap-4 border border-border bg-card p-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-primary">{statusLabel(row.status ?? (row.is_enabled === true ? "active" : row.is_enabled === false ? "inactive" : undefined))}</span>{activeModule.key === "themes" && <span className="text-[10px] text-muted-foreground">{row.start_date} — {row.end_date}</span>}</div><h3 className="mt-1 truncate font-display text-lg font-semibold">{row.title || row.name || row.key}</h3><p className="truncate text-[10px] text-muted-foreground">{row.summary || row.description || row.url || row.stream_url || row.audio_url || row.video_url || row.slug || ""}</p></div><div className="flex shrink-0 gap-3"><button onClick={() => editRow(row)} className="text-xs font-semibold text-primary underline">Editar</button><button onClick={() => void removeRow(row)} aria-label="Eliminar" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></div></article>)}{!filteredRows.length && <div className="border border-border px-5 py-12 text-center"><p className="font-display text-xl font-bold">{busy ? "Cargando…" : "Aún no hay contenido"}</p><p className="mt-1 text-xs text-muted-foreground">Crea el primer elemento o ajusta la búsqueda.</p></div>}</div></section>
          <aside className="h-fit border border-border bg-card p-5"><div className="flex items-start justify-between gap-3"><div><span className="text-[9px] font-bold uppercase tracking-[.16em] text-primary">EDITOR DE CONTENIDO</span><h2 className="mt-1 font-display text-2xl font-bold">{editingId ? "Editar" : "Crear"} {activeModule.title.toLowerCase()}</h2></div>{editingId && <button onClick={() => { setEditingId(null); setDraft(blankRecord(activeModule)); }} className="text-xs text-primary underline">Cancelar</button>}</div><form onSubmit={save} className="mt-5 grid gap-3">{activeModule.fields.map((field) => <label key={field.key} className="grid gap-1 text-[10px] font-semibold text-muted-foreground">{field.label}{field.hint && <span className="font-normal">{field.hint}</span>}{field.kind === "textarea" || field.kind === "json" ? <textarea required={field.required} rows={field.kind === "json" ? 4 : 3} value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} className="border border-border bg-background px-3 py-2 text-xs text-foreground" /> : field.kind === "select" ? <select required={field.required} value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} className="h-10 border border-border bg-background px-2 text-xs text-foreground">{field.options?.map((option) => <option key={option} value={option}>{statusLabel(option)}</option>)}</select> : <input required={field.required} type={field.kind || "text"} value={draft[field.key] ?? ""} onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })} className={`h-10 border border-border bg-background px-3 text-xs text-foreground ${field.kind === "color" ? "p-1" : ""}`} />}</label>)}<button disabled={busy} className="mt-2 inline-flex items-center justify-center gap-2 bg-gradient-lvj px-4 py-3 text-xs font-bold uppercase text-primary-foreground"><Save className="h-4 w-4" />{busy ? "Guardando…" : "Guardar"}</button></form>{activeModule.key === "themes" && <div className="mt-5 border border-border p-3"><div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Vista previa de color</div><div className="mt-2 flex gap-2"><span className="h-8 flex-1" style={{ backgroundColor: draft.primary_color || "#D8A23A" }} /><span className="h-8 flex-1" style={{ backgroundColor: draft.accent_color || "#5AA0BE" }} /><span className="h-8 flex-1 border border-border" style={{ backgroundColor: draft.background_color || "#0A1220" }} /></div><p className="mt-2 text-[10px] text-muted-foreground">Al publicar, el sitio usará el tema que corresponda a la fecha.</p></div>}</aside>
        </div>}
      </div>
      <nav className="sticky bottom-0 z-10 flex gap-1 overflow-x-auto border-t border-border bg-card p-2 lg:hidden">{[["dashboard","Resumen",LayoutDashboard],...modules.map((module) => [module.key,module.title,module.icon] as [string,string,typeof Radio])].map(([key,label,Icon]) => <button key={key} onClick={() => setActiveKey(key)} className={`grid min-w-[76px] place-items-center gap-1 px-2 py-1 text-[9px] ${activeKey === key ? "text-primary" : "text-muted-foreground"}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
    </section>
  </main>;
}
