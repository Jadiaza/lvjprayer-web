import { Link } from "react-router-dom";
import { rosarySessionService } from "../services/rosarySessionService";

interface Props {
  onRestart: () => void;
  intentionLabel?: string | null;
}

export const RosaryCompletion = ({ onRestart, intentionLabel }: Props) => {
  const stats = rosarySessionService.stats();
  return (
    <section className="glass gold-border rounded-3xl p-6 text-center space-y-4">
      <h2 className="font-display text-3xl gold-text">Rosario completado</h2>
      <p className="text-sm text-muted-foreground">
        {intentionLabel ? `Ofrecido por: ${intentionLabel}.` : "Gracias por acompañar a María en la oración."}
      </p>
      <dl className="flex justify-center gap-6 text-sm">
        <div>
          <dt className="text-muted-foreground text-xs">Rosarios rezados</dt>
          <dd className="text-gold text-xl">{stats.completed}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">Días seguidos</dt>
          <dd className="text-gold text-xl">{stats.streak}</dd>
        </div>
      </dl>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="min-h-11 rounded-full bg-gradient-gold text-navy-deep font-medium"
        >
          Rezar otro rosario
        </button>
        <Link to="/rosario" className="min-h-11 flex items-center justify-center text-sm text-gold">
          Volver al inicio del Rosario
        </Link>
      </div>
    </section>
  );
};