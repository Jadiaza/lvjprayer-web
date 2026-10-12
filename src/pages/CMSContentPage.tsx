import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { getPublicCollection } from "@/lib/publicContent";

type ContentPageRecord = { id: string; title: string; slug: string; summary: string; body: string };

export default function CMSContentPage() {
  const { slug } = useParams();
  const [pages, setPages] = useState<ContentPageRecord[]>([]);
  useEffect(() => { getPublicCollection<ContentPageRecord>("pages").then(setPages).catch(() => setPages([])); }, []);
  const page = pages.find((item) => item.slug === slug);

  if (!page) return <main className="mx-auto max-w-3xl px-5 py-20 text-center"><span className="text-[9px] font-bold uppercase tracking-[.2em] text-primary">CONTENIDO LVJ</span><h1 className="mt-3 font-display text-3xl font-bold">Página no disponible</h1><p className="mt-2 text-sm text-muted-foreground">No encontramos una página publicada con esta dirección.</p><Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="h-4 w-4" /> Volver al inicio</Link></main>;

  return <main><PageIntro eyebrow="LA VOZ DE JESÚS" title={page.title} description={page.summary} /><article className="mx-auto max-w-3xl whitespace-pre-line px-5 py-10 text-sm leading-8 text-foreground sm:px-8">{page.body}</article></main>;
}
