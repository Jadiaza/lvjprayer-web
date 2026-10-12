import { useEffect, useState } from "react";

export type PublicProgram = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  host_name: string | null;
  weekday: string;
  start_time: string | null;
  end_time: string | null;
  schedule_text: string | null;
  stream_url: string | null;
  cover_url: string | null;
  sort_order: number;
};
export type PublicAudio = {
  id: string; title: string; slug: string; description: string; artist_name: string | null;
  category: string; audio_url: string; cover_url: string | null; duration_seconds: number | null;
};
export type PublicArtist = {
  id: string; name: string; slug: string; bio: string; image_url: string | null; website_url: string | null;
  social_links: Record<string, string>;
};
export type PublicVideo = {
  id: string; title: string; slug: string; description: string; category: string;
  video_url: string; thumbnail_url: string | null;
};
export type PublicPlaylist = {
  id: string; title: string; slug: string; description: string; cover_url: string | null;
  tracks: Array<{ title: string; artist?: string; url?: string }>;
};
export type LiturgicalTheme = {
  id: string; title: string; slug: string; season: string;
  primary_color: string; accent_color: string; background_color: string; image_url: string | null;
  start_date: string; end_date: string;
};

const apiBase = (import.meta.env.VITE_PUBLIC_CONTENT_API as string | undefined)
  || "https://lavozdejesus.co/api/contenido.php";
const cache = new Map<string, { expires: number; promise: Promise<unknown[]> }>();

export function getPublicCollection<T>(type: string): Promise<T[]> {
  const cached = cache.get(type);
  if (cached && cached.expires > Date.now()) return cached.promise as Promise<T[]>;

  const promise = fetch(`${apiBase}?tipo=${encodeURIComponent(type)}`, {
    headers: { Accept: "application/json" },
    credentials: "omit",
  }).then(async (response) => {
    if (!response.ok) throw new Error(`CMS content API returned ${response.status}`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("CMS content API returned an invalid response");
    return data as T[];
  }).catch((error) => {
    cache.delete(type);
    throw error;
  });

  cache.set(type, { expires: Date.now() + 60_000, promise });
  return promise as Promise<T[]>;
}

export function usePublicSettings(): Record<string, unknown> {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  useEffect(() => {
    getPublicCollection<{ key: string; value: unknown }>("settings")
      .then((rows) => setSettings(Object.fromEntries(rows.map((row) => [row.key, row.value]))))
      .catch(() => setSettings({}));
  }, []);
  return settings;
}
