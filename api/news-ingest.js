import { XMLParser } from "fast-xml-parser";

const defaultFeeds = [
  { name: "ACI Prensa · Noticias", url: "https://www.aciprensa.com/rss/news", region: "universal" },
  { name: "ACI Prensa · Vaticano", url: "https://www.aciprensa.com/rss/news/vaticano", region: "universal" },
  { name: "ACI Prensa · Evangelio", url: "https://www.aciprensa.com/rss/evangelio", region: "universal" },
];
const allowedHosts = new Set(["www.aciprensa.com", "aciprensa.com", "www.vaticannews.va", "vaticannews.va", "www.elcatolicismo.com.co", "elcatolicismo.com.co", "diocesismonteria.org", "www.diocesismonteria.org"]);
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", removeNSPrefix: true, htmlEntities: true });

function text(value) {
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  if (value && typeof value === "object" && "#text" in value) return text(value["#text"]);
  return "";
}
function stripMarkup(value) {
  return text(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, " ").trim().slice(0, 420);
}
function normalizeItems(xml, feed) {
  const root = parser.parse(xml);
  const rawItems = root?.rss?.channel?.item ?? root?.RDF?.item ?? root?.feed?.entry ?? [];
  return (Array.isArray(rawItems) ? rawItems : [rawItems]).slice(0, 30).flatMap((entry) => {
    const rawLink = entry.link;
    const link = typeof rawLink === "string" ? rawLink : rawLink?.["@_href"] || rawLink?.[0]?.["@_href"] || "";
    const sourceUrl = text(link || entry.guid || entry.id);
    const title = stripMarkup(entry.title);
    if (!title || !sourceUrl.startsWith("https://")) return [];
    try { if (!allowedHosts.has(new URL(sourceUrl).hostname)) return []; } catch { return []; }
    const date = text(entry.pubDate || entry.published || entry.updated);
    const parsedDate = date && Number.isFinite(Date.parse(date)) ? new Date(date).toISOString() : null;
    return [{ source_name: feed.name, source_url: sourceUrl, title: title.slice(0, 240), excerpt: stripMarkup(entry.description || entry.summary || entry.content || ""), region: feed.region, source_published_at: parsedDate }];
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  const secret = process.env.CRON_SECRET;
  const authorization = req.headers.authorization || "";
  if (!secret || authorization !== `Bearer ${secret}`) return res.status(401).json({ error: "unauthorized" });
  const projectUrl = process.env.SUPABASE_URL;
  const serverKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!projectUrl || !serverKey) return res.status(503).json({ error: "missing_supabase_server_environment" });

  let feeds = defaultFeeds;
  if (process.env.NEWS_FEEDS) {
    try { feeds = JSON.parse(process.env.NEWS_FEEDS); }
    catch { return res.status(500).json({ error: "NEWS_FEEDS must be a JSON array" }); }
  }
  const results = [];
  for (const feed of feeds) {
    try {
      const url = new URL(feed.url);
      if (url.protocol !== "https:" || !allowedHosts.has(url.hostname)) throw new Error("Feed host is not approved");
      const response = await fetch(url, { headers: { accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" }, signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error(`Feed returned ${response.status}`);
      const xml = await response.text();
      const rows = normalizeItems(xml, feed);
      if (rows.length) {
        const authHeaders = { apikey: serverKey };
        if (!serverKey.startsWith("sb_")) authHeaders.authorization = `Bearer ${serverKey}`;
        const saved = await fetch(`${projectUrl}/rest/v1/news_feed_items?on_conflict=source_url`, {
          method: "POST",
          headers: { ...authHeaders, "content-type": "application/json", prefer: "resolution=ignore-duplicates,return=minimal" },
          body: JSON.stringify(rows),
        });
        if (!saved.ok) throw new Error(`Supabase returned ${saved.status}: ${(await saved.text()).slice(0, 240)}`);
      }
      results.push({ source: feed.name, received: rows.length });
    } catch (error) {
      results.push({ source: feed.name || "unknown", error: error instanceof Error ? error.message : "unknown_error" });
    }
  }
  return res.status(200).json({ ok: results.every((result) => !result.error), results, reviewed_before_publication: true });
}