import { ArrowUpRight, Facebook, Instagram, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublicSettings } from "@/lib/publicContent";

const secureLink = (value: unknown, fallback: string) => typeof value === "string" && /^https:\/\//i.test(value) ? value : fallback;

const Footer = () => {
  const settings = usePublicSettings();
  const socials = settings.social_links && typeof settings.social_links === "object" ? settings.social_links as Record<string, unknown> : {};
  const description = typeof settings.footer_description === "string" ? settings.footer_description : "Emisora católica que acompaña tu día con música, oración, formación y esperanza.";
  const logoUrl = typeof settings.logo_url === "string" && /^https:\/\//i.test(settings.logo_url) ? settings.logo_url : "/images/lvj-emblema.png";
  const brandName = typeof settings.brand_name === "string" ? settings.brand_name : "LA VOZ DE JESÚS";

  return <footer className="border-t border-border bg-[#071020]">
    <div className="mx-auto grid max-w-[1440px] gap-9 px-5 py-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
      <div>
        <Link to="/" className="flex items-center gap-3">
          <img src={logoUrl} alt="" className="h-12 w-12 object-contain" />
          <span className="font-display text-sm font-bold tracking-[.15em] text-foreground">{brandName}</span>
        </Link>
        <p className="mt-4 max-w-sm text-xs leading-6 text-muted-foreground">{description}</p>
        <div className="mt-5 flex gap-2">
          <a aria-label="Facebook de La Voz de Jesús" href={secureLink(socials.facebook, "https://facebook.com/lavozdejesus.col/")} target="_blank" rel="noreferrer" className="rounded border border-border p-2 text-muted-foreground transition-colors hover:text-primary"><Facebook className="h-4 w-4" /></a>
          <a aria-label="Instagram de La Voz de Jesús" href={secureLink(socials.instagram, "https://www.instagram.com/lavozdejesus.co/")} target="_blank" rel="noreferrer" className="rounded border border-border p-2 text-muted-foreground transition-colors hover:text-primary"><Instagram className="h-4 w-4" /></a>
          <a aria-label="WhatsApp de La Voz de Jesús" href={secureLink(socials.whatsapp, "https://api.whatsapp.com/send?phone=573028375008")} target="_blank" rel="noreferrer" className="rounded border border-border p-2 text-muted-foreground transition-colors hover:text-primary"><MessageCircle className="h-4 w-4" /></a>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">Explora LVJ</h2>
        <div className="grid gap-3 text-xs text-muted-foreground">
          <Link to="/shows-schedule" className="hover:text-foreground">Programación</Link>
          <Link to="/noticias" className="hover:text-foreground">Reflexiones y actualidad</Link>
          <Link to="/audios" className="hover:text-foreground">Audios y podcasts</Link>
          <Link to="/artistas" className="hover:text-foreground">Artistas</Link>
          <Link to="/videos-elementor" className="hover:text-foreground">Videos y predicaciones</Link>
          <Link to="/charts-elementor" className="hover:text-foreground">Alabanzas y playlists</Link>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">Conversemos</h2>
        <p className="text-xs leading-6 text-muted-foreground">¿Tienes una intención de oración, un testimonio o una pregunta?</p>
        <Link to="/contacts" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-foreground hover:text-primary">Escríbenos <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        <a href="https://play.google.com/store/apps/details?id=com.jadiaza.lvjesus" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><Mail className="h-3.5 w-3.5" /> Descarga nuestra aplicación</a>
      </div>
    </div>
    <div className="border-t border-border/70 px-5 py-4 text-center text-[10px] tracking-wide text-muted-foreground">© {new Date().getFullYear()} LVJ MEDIA · Una voz de fe, siempre contigo.</div>
  </footer>;
};

export default Footer;
