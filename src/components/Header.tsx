import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Radio, ChevronRight } from "lucide-react";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Noticias", href: "/noticias" },
  { label: "Programación", href: "/shows-schedule" },
  { label: "Videos", href: "/videos-elementor" },
  { label: "Alabanzas", href: "/charts-elementor" },
  { label: "Contacto", href: "/contacts" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-3" aria-label="La Voz de Jesús, inicio">
          <img src="/images/lvj-emblema.png" alt="" className="h-12 w-12 object-contain" />
          <span className="grid leading-none">
            <strong className="font-display text-[15px] font-bold tracking-[.16em] text-foreground">LA VOZ <span className="text-primary">DE JESÚS</span></strong>
            <small className="mt-1.5 text-[9px] tracking-[.2em] text-muted-foreground">RADIO CATÓLICA · COLOMBIA</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navegación principal">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === "/"} className={({ isActive }) => `px-3 py-2 text-[11px] font-semibold uppercase tracking-[.09em] transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.12em] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Al aire</span>
          <a href="#luna-player" className="inline-flex h-10 items-center gap-2 rounded-sm bg-gradient-lvj px-4 text-[10px] font-bold uppercase tracking-[.1em] text-primary-foreground transition-opacity hover:opacity-90"><Radio className="h-3.5 w-3.5" /> Escuchar <ChevronRight className="h-3 w-3" /></a>
        </div>

        <button className="rounded border border-border p-2 text-foreground xl:hidden" type="button" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-background px-4 pb-4 pt-2 xl:hidden" aria-label="Navegación móvil">
          {navItems.map((item) => <NavLink key={item.href} to={item.href} end={item.href === "/"} onClick={closeMenu} className={({ isActive }) => `block border-b border-border/70 px-3 py-3 text-xs font-semibold uppercase tracking-[.1em] ${isActive ? "text-primary" : "text-muted-foreground"}`}>{item.label}</NavLink>)}
          <a href="#luna-player" onClick={closeMenu} className="mt-3 flex items-center justify-center gap-2 rounded-sm bg-gradient-lvj px-4 py-3 text-xs font-bold uppercase text-primary-foreground"><Radio className="h-4 w-4" /> Escuchar en vivo</a>
        </nav>
      )}
    </header>
  );
};

export default Header;
