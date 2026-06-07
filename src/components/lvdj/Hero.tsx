import { ArrowRight, Play, Sparkles } from "lucide-react";
import monstrance from "@/assets/monstrance-hero.jpg";
import cathedral from "@/assets/cathedral-bg.jpg";

export const Hero = () => (
  <section className="relative pt-32 pb-24 overflow-hidden">
    <div className="absolute inset-0 -z-10">
      <img src={cathedral} alt="" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-hero" />
    </div>

    <div className="container grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-8">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span className="text-xs uppercase tracking-[0.2em] text-foreground/80">Adoración Perpetua</span>
          <span className="text-xs text-muted-foreground">· en línea</span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl xl:text-7xl leading-[1.05] tracking-tight">
          Adora al <span className="gold-text italic">Santísimo</span>
          <br /> las <span className="font-light">24 horas</span>
        </h1>

        <p className="mt-7 text-lg text-foreground/70 max-w-xl leading-relaxed">
          Una capilla virtual abierta día y noche frente al Santísimo Sacramento.
          Únete a miles de fieles en oración, escucha radio católica en vivo
          y vive la fe en comunidad.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button className="group inline-flex items-center gap-3 rounded-full bg-gradient-gold px-7 h-14 text-base font-semibold text-primary-foreground shadow-gold hover:shadow-[0_15px_50px_-10px_hsl(42_90%_55%/0.6)] transition-all">
            Entrar a la Capilla Virtual
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </button>
          <button className="inline-flex items-center gap-3 rounded-full glass px-6 h-14 text-base font-medium hover:border-[hsl(var(--gold)/0.4)] transition">
            <span className="h-9 w-9 rounded-full bg-gold/15 flex items-center justify-center">
              <Play className="h-4 w-4 text-gold fill-gold ml-0.5" />
            </span>
            Escuchar en vivo
          </button>
        </div>

        <div className="mt-12 flex items-center gap-8 text-sm">
          <div>
            <div className="font-display text-3xl gold-text">12,847</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">En oración ahora</div>
          </div>
          <div className="h-10 w-px bg-[hsl(var(--gold)/0.2)]" />
          <div>
            <div className="font-display text-3xl gold-text">24/7</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Transmisión</div>
          </div>
          <div className="h-10 w-px bg-[hsl(var(--gold)/0.2)]" />
          <div className="hidden sm:block">
            <div className="font-display text-3xl gold-text">+150</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Países</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 -m-20 bg-gradient-radial-gold blur-2xl" />
        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden gold-border shadow-deep float-slow">
          <img src={monstrance} alt="Santísimo Sacramento" className="w-full h-full object-cover" width={1536} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-gold">En Vivo · Capilla</div>
              <div className="text-sm font-medium">Adoración Eucarística — Catedral de México</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="container mt-20 gold-divider" />
  </section>
);