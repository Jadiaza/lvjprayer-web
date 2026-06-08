import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { RadioCard } from "./RadioCard";
import { QuickAccess } from "./QuickAccess";
import { GospelCard } from "./GospelCard";
import { ProgramCard } from "./ProgramCard";
import { BottomNav } from "./BottomNav";
import monstrance from "@/assets/monstrance-hero.jpg";
import cathedral from "@/assets/cathedral-bg.jpg";

export const MobileHome = () => (
  <div className="relative min-h-screen bg-navy-deep text-foreground overflow-hidden">
    {/* Hero monstrance background */}
    <div className="absolute inset-x-0 top-0 h-[70vh] -z-0">
      <img src={cathedral} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <img
        src={monstrance}
        alt="Santísimo Sacramento"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-deep/30 to-background" />
      <div className="absolute inset-0 bg-gradient-radial-gold opacity-30" />
    </div>

    {/* Top bar */}
    <header className="relative z-10 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <Logo />
      <button className="relative h-10 w-10 rounded-full glass gold-border flex items-center justify-center hover:text-gold transition">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold ring-2 ring-background" />
      </button>
    </header>

    {/* Spacer so hero shows through */}
    <div className="h-[52vh]" />

    {/* Floating content */}
    <main className="relative z-10 px-4 space-y-4 pb-32">
      <RadioCard />
      <QuickAccess compact />
      <GospelCard />
      <ProgramCard />
    </main>

    <BottomNav />
  </div>
);