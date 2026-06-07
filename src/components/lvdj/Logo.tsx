import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <div className="relative h-10 w-10 shrink-0">
      <div className="absolute inset-0 rounded-full bg-gradient-gold shadow-gold" />
      <div className="absolute inset-[3px] rounded-full bg-navy-deep flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M12 2v20M5 9h14M7 5h10" stroke="hsl(var(--gold-bright))" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="14" r="3" stroke="hsl(var(--gold-bright))" strokeWidth="1.2" />
        </svg>
      </div>
    </div>
    <div className="leading-tight">
      <div className="font-display text-lg font-semibold tracking-wide text-foreground">
        La Voz de <span className="gold-text">Jesús</span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Radio Católica · 24/7</div>
    </div>
  </div>
);