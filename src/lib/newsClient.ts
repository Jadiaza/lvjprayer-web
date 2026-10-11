import { createClient } from "@supabase/supabase-js";

export type NewsRegion = "universal" | "colombia" | "local";
export type NewsStatus = "draft" | "review" | "published" | "archived";

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  region: NewsRegion;
  community: string | null;
  author_name: string;
  image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  status: NewsStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsFeedItem = {
  id: string;
  source_name: string;
  source_url: string;
  title: string;
  excerpt: string;
  region: NewsRegion;
  source_published_at: string | null;
  imported_at: string;
  reviewed_at: string | null;
  converted_news_id: string | null;
};

const hostingApi = import.meta.env.MODE === "hosting";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

// The public hosting build reads news through PHP; only the Vercel admin uses Supabase JS.
export const isNewsConnected = hostingApi || Boolean(supabaseUrl && supabaseKey);
export const supabase = !hostingApi && supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const sampleNews: NewsItem[] = [
  { id: "sample-1", slug: "la-iglesia-camina-con-esperanza", title: "La Iglesia camina con esperanza y sirve a las comunidades", summary: "Una reflexion de muestra sobre la mision evangelizadora y el servicio fraterno.", body: "Contenido de demostracion. El equipo editorial de La Voz de Jesus podra publicar aqui noticias propias y reflexiones aprobadas.", category: "Iglesia", region: "universal", community: null, author_name: "Redaccion LVJ", image_url: "/images/lvj-emblema.png", source_name: null, source_url: null, status: "published", published_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "sample-2", slug: "comunidades-locales-lvj", title: "Las comunidades locales comparten sus iniciativas de fe", summary: "Espacio demostrativo para encuentros, obras solidarias y actividades de las comunidades cercanas.", body: "Contenido de demostracion para la futura seccion de noticias locales.", category: "Comunidad", region: "local", community: "Comunidades LVJ", author_name: "Redaccion LVJ", image_url: null, source_name: null, source_url: null, status: "published", published_at: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function getPublishedNews(): Promise<NewsItem[]> {
  if (hostingApi) {
    const response = await fetch("/api/noticias.php", {
      headers: { accept: "application/json" },
      credentials: "same-origin",
    });
    if (!response.ok) throw new Error(`News API returned ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("News API response is invalid");
    return data as NewsItem[];
  }

  if (!supabase) return sampleNews;
  const { data, error } = await supabase.from("news_items").select("*").eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NewsItem[];
}

export function makeNewsSlug(title: string) {
  return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}