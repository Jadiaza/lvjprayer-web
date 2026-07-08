import { Sparkles } from "lucide-react";
import { BibliaLayout } from "./BibliaLayout";

export default function BibliaProximamente({ title }: { title: string }) {
  return (
    <BibliaLayout title={title}>
      <div className="glass gold-border rounded-3xl p-8 text-center">
        <Sparkles className="h-8 w-8 text-gold mx-auto mb-3" />
        <div className="font-display text-2xl mb-1">{title}</div>
        <p className="text-sm text-foreground/70">
          Este módulo llega en la próxima fase. Fase 1 incluye lectura e importador.
        </p>
      </div>
    </BibliaLayout>
  );
}