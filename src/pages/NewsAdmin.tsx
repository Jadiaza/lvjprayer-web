import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, LogOut, Newspaper, RefreshCw, Save, Send, Trash2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { isNewsConnected, makeNewsSlug, supabase, type NewsFeedItem, type NewsItem, type NewsRegion, type NewsStatus } from "@/lib/newsClient";

const emptyDraft = { title: "", slug: "", summary: "", body: "", category: "Iglesia", region: "universal" as NewsRegion, community: "", author_name: "Redacción LVJ", image_url: "", source_name: "", source_url: "", status: "draft" as NewsStatus };

const NewsAdmin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [roleReady, setRoleReady] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [inbox, setInbox] = useState<NewsFeedItem[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!supabase || !session) {
      setRoleAllowed(false);
      setRoleReady(true);
      return () => { cancelled = true; };
    }
    setRoleReady(false);
    void supabase.from("user_roles").select("role").eq("user_id", session.user.id).in("role", ["admin", "editor"]).then(({ data, error }) => {
      if (cancelled) return;
      setRoleAllowed(!error && (data ?? []).length > 0);
      setRoleReady(true);
    });
    return () => { cancelled = true; };
  }, [session]);
  const loadContent = useCallback(async () => {
    if (!supabase || !roleAllowed) return;
    setBusy(true);
    const [newsResult, inboxResult] = await Promise.all([
      supabase.from("news_items").select("*").order("updated_at", { ascending: false }),
      supabase.from("news_feed_items").select("*").is("converted_news_id", null).order("imported_at", { ascending: false }).limit(80),
    ]);
    if (newsResult.error) setNotice(`Noticias: ${newsResult.error.message}`); else setItems((newsResult.data ?? []) as NewsItem[]);
    if (inboxResult.error) setNotice(`Bandeja RSS: ${inboxResult.error.message}`); else setInbox((inboxResult.data ?? []) as NewsFeedItem[]);
    setBusy(false);
  }, [session, roleAllowed]);

  useEffect(() => { void loadContent(); }, [loadContent]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true); setNotice("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setNotice(error.message);
    setPassword("");
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !roleAllowed) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const status = (submitter?.dataset.status || draft.status) as NewsStatus;
    const canPublish = roleAllowed;
    if (!canPublish && status === "published") { setNotice("Solo un editor o administrador puede publicar."); return; }
    const slug = draft.slug.trim() || makeNewsSlug(draft.title);
    const existing = editingId ? items.find((item) => item.id === editingId) : undefined;
    const payload = { ...draft, status, slug, community: draft.community || null, image_url: draft.image_url || null, source_name: draft.source_name || null, source_url: draft.source_url || null, published_at: status === "published" ? existing?.published_at || new Date().toISOString() : null, updated_at: new Date().toISOString() };
    setBusy(true); setNotice("");
    const result = editingId ? await supabase.from("news_items").update(payload).eq("id", editingId) : await supabase.from("news_items").insert(payload);
    setBusy(false);
    if (result.error) { setNotice(result.error.message); return; }
    setNotice(status === "published" ? "Noticia publicada." : "Borrador guardado."); setDraft(emptyDraft); setEditingId(null); await loadContent();
  };

  const edit = (item: NewsItem) => {
    setEditingId(item.id);
    setDraft({ title: item.title, slug: item.slug, summary: item.summary, body: item.body, category: item.category, region: item.region, community: item.community || "", author_name: item.author_name, image_url: item.image_url || "", source_name: item.source_name || "", source_url: item.source_url || "", status: item.status });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (item: NewsItem) => {
    if (!supabase || !roleAllowed || !window.confirm(`¿Eliminar "${item.title}"?`)) return;
    const { error } = await supabase.from("news_items").delete().eq("id", item.id);
    if (error) setNotice(error.message); else { setNotice("Noticia eliminada."); await loadContent(); }
  };

  const importFeedItem = async (item: NewsFeedItem) => {
    if (!supabase || !roleAllowed) return;
    const result = await supabase.from("news_items").insert({ title: item.title, slug: `${makeNewsSlug(item.title)}-${item.id.slice(0, 6)}`, summary: item.excerpt, body: "", category: "Iglesia", region: item.region, author_name: "Redacción LVJ", source_name: item.source_name, source_url: item.source_url, status: "draft" }).select("id").single();
    if (result.error) { setNotice(result.error.message); return; }
    await supabase.from("news_feed_items").update({ converted_news_id: result.data.id, reviewed_at: new Date().toISOString() }).eq("id", item.id);
    setNotice("Titular enviado a borradores. Redacta una nota propia y conserva la atribución."); await loadContent();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!supabase || !file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { setNotice("Usa una imagen JPG, PNG o WebP de máximo 5 MB."); return; }
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${session?.user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("news-media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) { setNotice(error.message); return; }
    const { data } = supabase.storage.from("news-media").getPublicUrl(path);
    setDraft((current) => ({ ...current, image_url: data.publicUrl })); setNotice("Imagen cargada.");
  };

  if (!ready) return <p className="p-10 text-center text-muted-foreground">Verificando sesión.</p>;
  if (!isNewsConnected) return <main className="mx-auto max-w-2xl px-5 py-16"><h1 className="font-display text-3xl font-bold">Panel de noticias LVJ</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Configura VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en el proyecto de Vercel. Después ejecuta supabase/news-schema.sql en el editor SQL del proyecto.</p><Link className="mt-6 inline-flex text-primary" to="/noticias">Volver al sitio público</Link></main>;
  if (!session) return <main className="mx-auto max-w-md px-5 py-16"><Link to="/" className="text-xs text-primary">← La Voz de Jesús</Link><div className="mt-7 border border-border bg-card p-6"><span className="text-[9px] font-bold uppercase tracking-[.2em] text-primary">ÁREA EDITORIAL</span><h1 className="mt-2 font-display text-3xl font-bold">Noticias LVJ</h1><p className="mt-2 text-sm text-muted-foreground">Inicia sesión con una cuenta autorizada.</p><form onSubmit={login} className="mt-6 grid gap-4"><label className="grid gap-2 text-xs text-muted-foreground">Correo<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 border border-border bg-background px-3 text-foreground" /></label><label className="grid gap-2 text-xs text-muted-foreground">Contraseña<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 border border-border bg-background px-3 text-foreground" /></label><button disabled={busy} className="bg-gradient-lvj px-4 py-3 text-xs font-bold uppercase text-primary-foreground">{busy ? "Ingresando." : "Iniciar sesión"}</button></form>{notice && <p role="alert" className="mt-4 text-xs text-destructive">{notice}</p>}</div></main>;
  if (!roleReady) return <p className="p-10 text-center text-muted-foreground">Verificando permisos editoriales...</p>;
  if (!roleAllowed) return <main className="mx-auto max-w-xl px-5 py-16 text-center"><h1 className="font-display text-3xl font-bold">Acceso no autorizado</h1><p className="mt-3 text-sm text-muted-foreground">La cuenta inició sesión, pero no tiene rol editorial en Supabase.</p><button onClick={() => void supabase.auth.signOut()} className="mt-5 text-primary underline">Cerrar sesión</button></main>;

  return <main className="min-h-screen bg-background"><header className="border-b border-border bg-card"><div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><Newspaper className="h-5 w-5 text-primary" /><div><span className="text-[9px] font-bold uppercase tracking-[.15em] text-primary">LVJ · EDITORIAL</span><h1 className="font-display text-xl font-bold">Administrar noticias</h1></div></div><div className="flex items-center gap-4 text-xs"><Link to="/noticias" className="text-muted-foreground hover:text-primary">Ver sitio</Link><button onClick={() => void supabase?.auth.signOut()} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"><LogOut className="h-4 w-4" /> Salir</button></div></div></header>
    <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-7"><div className="flex items-center justify-between"><div><h2 className="font-display text-2xl font-bold">Bandeja de fuentes</h2><p className="mt-1 text-xs text-muted-foreground">Titulares externos pendientes de revisión. No se publican automáticamente.</p></div><button disabled={busy} onClick={() => void loadContent()} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs"><RefreshCw className="h-3.5 w-3.5" /> Actualizar</button></div><div className="space-y-3">{inbox.map((item) => <article key={item.id} className="border border-border bg-card p-4"><div className="flex flex-wrap justify-between gap-2"><span className="text-[9px] font-bold uppercase tracking-[.12em] text-primary">{item.source_name} · {item.region}</span><time className="text-[10px] text-muted-foreground">{item.source_published_at ? new Date(item.source_published_at).toLocaleDateString("es-CO") : "Fecha no indicada"}</time></div><h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.excerpt}</p><div className="mt-3 flex flex-wrap gap-4"><a href={item.source_url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary underline">Abrir fuente original</a><button onClick={() => void importFeedItem(item)} className="text-[10px] font-bold text-foreground underline">Crear borrador LVJ</button></div></article>)}{inbox.length === 0 && <p className="border border-border p-6 text-sm text-muted-foreground">La bandeja está vacía. La sincronización de fuentes requiere configurar las variables de Vercel.</p>}</div>
      <div><h2 className="mb-3 font-display text-2xl font-bold">Publicaciones y borradores</h2><div className="space-y-2">{items.map((item) => <article key={item.id} className="flex items-start justify-between gap-3 border border-border bg-card p-3"><div className="min-w-0"><span className={`text-[8px] font-bold uppercase tracking-[.12em] ${item.status === "published" ? "text-emerald-400" : "text-primary"}`}>{item.status === "published" ? "Publicado" : item.status === "review" ? "En revisión" : item.status === "archived" ? "Archivado" : "Borrador"} · {item.region}</span><h3 className="mt-1 truncate text-sm font-semibold">{item.title}</h3><small className="text-[10px] text-muted-foreground">{item.category}</small></div><div className="flex shrink-0 gap-2"><button aria-label="Editar noticia" onClick={() => edit(item)} className="text-xs text-primary underline">Editar</button><button aria-label="Eliminar noticia" onClick={() => void remove(item)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></div></article>)}{items.length === 0 && <p className="border border-border p-4 text-xs text-muted-foreground">Aún no hay publicaciones.</p>}</div></div>
      </section>

      <aside className="h-fit border border-border bg-card p-5"><div className="flex items-center justify-between"><div><span className="text-[9px] font-bold uppercase tracking-[.16em] text-primary">EDITOR</span><h2 className="mt-1 font-display text-2xl font-bold">{editingId ? "Editar noticia" : "Nueva noticia"}</h2></div>{editingId && <button onClick={() => { setEditingId(null); setDraft(emptyDraft); }} className="text-xs text-primary underline">Cancelar</button>}</div><form onSubmit={save} className="mt-5 grid gap-3"><label className="grid gap-1 text-[10px] font-semibold text-muted-foreground">Titular<input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: editingId ? draft.slug : makeNewsSlug(e.target.value) })} className="h-10 border border-border bg-background px-3 text-sm text-foreground" /></label><label className="grid gap-1 text-[10px] font-semibold text-muted-foreground">URL amigable<input required value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: makeNewsSlug(e.target.value) })} className="h-9 border border-border bg-background px-3 text-xs text-foreground" /></label><label className="grid gap-1 text-[10px] font-semibold text-muted-foreground">Resumen<textarea required rows={3} value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} className="border border-border bg-background px-3 py-2 text-sm text-foreground" /></label><label className="grid gap-1 text-[10px] font-semibold text-muted-foreground">Nota de LVJ<textarea rows={8} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="border border-border bg-background px-3 py-2 text-sm text-foreground" placeholder="Redacta el contenido propio de LVJ y revisa los datos antes de publicar." /></label><div className="grid grid-cols-2 gap-3"><label className="grid gap-1 text-[10px] text-muted-foreground">Sección<select value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value as NewsRegion })} className="h-10 border border-border bg-background px-2 text-xs text-foreground"><option value="universal">Iglesia universal</option><option value="colombia">Colombia</option><option value="local">Comunidad local</option></select></label><label className="grid gap-1 text-[10px] text-muted-foreground">Estado<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as NewsStatus })} className="h-10 border border-border bg-background px-2 text-xs text-foreground"><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicar ahora</option><option value="archived">Archivar</option></select></label></div>{draft.region === "local" && <label className="grid gap-1 text-[10px] text-muted-foreground">Comunidad<input value={draft.community} onChange={(e) => setDraft({ ...draft, community: e.target.value })} className="h-10 border border-border bg-background px-3 text-sm text-foreground" placeholder="Parroquia, municipio o grupo" /></label>}<label className="grid gap-1 text-[10px] text-muted-foreground">Categoría<input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="h-10 border border-border bg-background px-3 text-sm text-foreground" /></label><label className="grid gap-1 text-[10px] text-muted-foreground">Autor<input value={draft.author_name} onChange={(e) => setDraft({ ...draft, author_name: e.target.value })} className="h-10 border border-border bg-background px-3 text-sm text-foreground" /></label><label className="grid gap-1 text-[10px] text-muted-foreground">Fuente citada<input value={draft.source_name} onChange={(e) => setDraft({ ...draft, source_name: e.target.value })} className="h-10 border border-border bg-background px-3 text-sm text-foreground" /></label><label className="grid gap-1 text-[10px] text-muted-foreground">Enlace original<input type="url" value={draft.source_url} onChange={(e) => setDraft({ ...draft, source_url: e.target.value })} className="h-10 border border-border bg-background px-3 text-xs text-foreground" placeholder="https://" /></label><label className="grid gap-1 text-[10px] text-muted-foreground">Imagen (JPG/PNG/WebP, 5 MB)<span className="flex items-center gap-2"><ImagePlus className="h-4 w-4 text-primary" /><input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} className="min-w-0 text-[10px]" /></span></label>{draft.image_url && <img src={draft.image_url} alt="Vista previa" className="max-h-36 w-full object-cover" />}<div className="grid grid-cols-2 gap-2"><button disabled={busy} type="submit" data-status="draft" className="inline-flex justify-center gap-2 border border-border px-3 py-3 text-[10px] font-bold uppercase"><Save className="h-3.5 w-3.5" /> Guardar borrador</button><button disabled={busy} type="submit" data-status="published" className="inline-flex justify-center gap-2 bg-gradient-lvj px-3 py-3 text-[10px] font-bold uppercase text-primary-foreground"><Send className="h-3.5 w-3.5" /> Publicar</button></div></form>{notice && <p role="status" className="mt-4 text-xs text-muted-foreground">{notice}</p>}</aside>
    </div></main>;
};

export default NewsAdmin;