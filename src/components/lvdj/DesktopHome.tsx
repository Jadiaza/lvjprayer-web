import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { RadioCard } from "./RadioCard";
import { QuickAccess } from "./QuickAccess";
import { GospelCard } from "./GospelCard";
import { ProgramCard } from "./ProgramCard";
import { Footer } from "./Footer";
import monstrance from "@/assets/monstrance-hero.jpg";
import cathedral from "@/assets/cathedral-bg.jpg";
import { Clock, Play } from "lucide-react";

const links = ["Inicio", "Radio", "Capilla", "Evangelio", "Comunidad", "Programación", "Contacto"];

const schedule = [
  { time: "05:00", title: "Liturgia de las Horas", host: "Comunidad Monástica", live: false },
  { time: "06:30", title: "Santa Misa Matutina", host: "Padre Antonio Rivera", live: true },
  { time: "10:00", title: "Caminos de Fe", host: "Diácono Luis Pérez", live: false },
  { time: "12:00", title: "Ángelus y Reflexión", host: "Padre Joaquín", live: false },
  { time: "15:00", title: "Hora de la Misericordia", host: "Adoradores", live: false },
  { time: "18:00", title: "Santo Rosario", host: "Familias en Oración", live: false },
  { time: "20:00", title: "Voces de Esperanza", host: "Padre Mateo Suárez", live: false },
];

export const DesktopHome = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    {/* Top nav */}
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
          <button className="relative h-10 w-10 rounded-full glass gold-border flex items-center justify-center hover:text-gold transition">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold ring-2 ring-background" />
          </button>
        </div>
      </div>
    </header>

    <main className="pt-[76px]">
      {/* Hero with centered monstrance */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={cathedral} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="container pt-12 pb-16 flex flex-col items-center">
          <div className="relative w-full max-w-[520px]">
            <div className="absolute inset-0 -m-16 bg-gradient-radial-gold blur-3xl opacity-80" />
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden gold-border shadow-deep float-slow">
              <img
                src={monstrance}
                alt="Santísimo Sacramento"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
            </div>
          </div>

          <div className="w-full max-w-2xl -mt-10 relative z-10">
            <RadioCard />
          </div>

          <div className="w-full max-w-3xl mt-10">
            <QuickAccess />
          </div>
        </div>
      </section>

      {/* Cards row */}
      <section className="container py-12 grid md:grid-cols-2 gap-6">
        <GospelCard />
        <ProgramCard />
      </section>

      {/* Schedule */}
      <section className="container pb-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">En el aire</div>
            <h2 className="font-display text-4xl">Programación de Hoy</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-gold" /> Hora local
          </div>
        </div>
        <div className="glass gold-border rounded-3xl overflow-hidden">
          <div className="divide-y divide-[hsl(var(--gold)/0.1)]">
            {schedule.map((s) => (
              <div
                key={s.time}
                className={`grid grid-cols-[100px_1fr_1fr_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-[hsl(var(--gold)/0.04)] ${
                  s.live ? "bg-[hsl(var(--gold)/0.06)]" : ""
                }`}
              >
                <div className="font-display text-2xl text-gold tabular-nums">{s.time}</div>
                <div className="font-medium flex items-center gap-3">
                  {s.title}
                  {s.live && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> En vivo
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{s.host}</div>
                <button
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
                    s.live
                      ? "bg-gradient-gold text-navy-deep shadow-gold"
                      : "glass text-gold hover:bg-gold/10"
                  }`}
                >
                  <Play className="h-4 w-4 ml-0.5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);