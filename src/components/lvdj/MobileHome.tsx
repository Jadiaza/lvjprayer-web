import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { RadioCard } from "./RadioCard";
import { QuickAccess } from "./QuickAccess";
import { GospelCard } from "./GospelCard";
import { ProgramCard } from "./ProgramCard";
import { BottomNav } from "./BottomNav";
import monstrance from "@/assets/mobile-monstrance.png.asset.json";

// Proportions per spec (mobile):
// header 8% · custodia 33% · radio 9% · accesos 20% · evangelio 15% · próximo 8% · menú 7%
export const MobileHome = () => (
  <div className="relative min-h-screen bg-navy-deep text-foreground overflow-x-hidden">
    <main className="relative z-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {/* HEADER 8% */}
      <header className="relative z-20 flex items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
        <Logo size="md" />
        <button className="relative h-11 w-11 rounded-full glass gold-border flex items-center justify-center hover:text-gold transition">
          <Bell className="h-4 w-4 text-gold" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold ring-2 ring-background" />
        </button>
      </header>

      {/* CUSTODIA 33% — hero image */}
      <section className="relative w-full" style={{ aspectRatio: "9 / 11" }}>
        <img
          src={monstrance.url}
          alt="Santísimo Sacramento"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-40 mix-blend-screen" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* RADIO EN VIVO 9% */}
      <section className="relative -mt-6 px-4 z-10">
        <RadioCard />
      </section>

      {/* ACCESOS RÁPIDOS 20% */}
      <section className="px-4 mt-5">
        <QuickAccess compact />
      </section>

      {/* EVANGELIO DEL DÍA 15% */}
      <section className="px-4 mt-4">
        <GospelCard />
      </section>

      {/* PRÓXIMO PROGRAMA 8% */}
      <section className="px-4 mt-3 pb-28">
        <ProgramCard />
      </section>
    </main>

    {/* MENÚ INFERIOR 7% */}
    <BottomNav />
  </div>
);