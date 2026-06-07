import { Bell, Radio, ChevronDown, User, Search } from "lucide-react";
import { Logo } from "./Logo";

const links = ["Inicio", "Radio", "Capilla", "Evangelio", "Comunidad", "Programación", "Contacto"];

export const Navbar = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="glass border-b border-[hsl(var(--gold)/0.15)]">
        <div className="container flex items-center justify-between h-[76px] gap-6">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l, i) => (
              <a
                key={l}
                href="#"
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0 ? "text-gold" : "text-foreground/70 hover:text-gold"
                }`}
              >
                {l}
                {i === 0 && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-px w-6 bg-gradient-gold" />
                )}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="hidden md:flex h-10 w-10 items-center justify-center rounded-full text-foreground/60 hover:text-gold hover:bg-white/5 transition">
              <Search className="h-4 w-4" />
            </button>
            <button className="relative h-10 w-10 flex items-center justify-center rounded-full text-foreground/60 hover:text-gold hover:bg-white/5 transition">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold ring-2 ring-background" />
            </button>
            <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 h-10 text-sm font-semibold text-primary-foreground shadow-gold hover:scale-[1.02] transition relative">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
              </span>
              <Radio className="h-4 w-4" /> En Vivo
            </button>
            <button className="flex items-center gap-2 rounded-full glass pl-1 pr-3 h-10 hover:border-[hsl(var(--gold)/0.4)] transition">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold to-gold-deep flex items-center justify-center">
                <User className="h-4 w-4 text-navy-deep" />
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-foreground/60" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};