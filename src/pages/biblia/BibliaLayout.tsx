import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";

interface Props {
  title?: string;
  children: ReactNode;
  back?: string;
}

export const BibliaLayout = ({ title, children, back }: Props) => {
  const loc = useLocation();
  const isHome = loc.pathname === "/biblia";
  return (
    <div className="min-h-screen bg-navy-deep text-foreground">
      <header className="sticky top-0 z-40 glass border-b border-[hsl(var(--gold)/0.15)]">
        <div className="mx-auto max-w-4xl flex items-center gap-3 px-4 py-3">
          {!isHome && (
            <Link
              to={back ?? "/biblia"}
              className="h-9 w-9 rounded-full glass gold-border flex items-center justify-center hover:text-gold transition"
              aria-label="Volver"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full bg-gradient-gold flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-navy-deep" />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-gold/80">
                La Voz de Jesús
              </div>
              <div className="font-display text-lg leading-none">
                {title ?? "Biblia"}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-4">{children}</main>
    </div>
  );
};