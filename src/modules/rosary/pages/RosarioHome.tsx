import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleDot, Headphones, Sparkles, WifiOff } from "lucide-react";
import { RosaryLayout } from "../components/RosaryLayout";
import { RosaryLoading } from "../components/RosaryStateViews";
import { useRosaryToday } from "../hooks/useRosaryToday";
import { useRosaryPreferences } from "../hooks/useRosaryPreferences";
import { mysteryGroups } from "../mocks/mysteries";
import { rosarySessionService } from "../services/rosarySessionService";
import { rosaryTodayService } from "../services/rosaryTodayService";
import type { MysteryGroupId, RosaryModeId, RosarySession } from "../types";

const MODES: Array<{ id: RosaryModeId; label: string; description: string; icon: typeof CircleDot; to: string }> = [
  { id: "digital", label: "Rosario digital", description: "Guiado paso a paso con textos", icon: Sparkles, to: "/rosario/digital" },
  { id: "physical", label: "Rosario físico", description: "Con tu rosario en la mano", icon: CircleDot, to: "/rosario/fisico" },
  { id: "audio", label: "Rosario en audio", description: "Escucha y acompaña", icon: Headphones, to: "/rosario/audio" },
];

export const RosarioHome = () => {
  const today = useRosaryToday();
  const navigate = useNavigate();
  const { prefs, update } = useRosaryPreferences();
  const [resume, setResume] = useState<RosarySession | null>(null);

  useEffect(() => {
    setResume(rosarySessionService.load());
  }, []);

  const group: MysteryGroupId =
    today.status === "ready" ? today.data.recommendedGroup : rosaryTodayService.groupForDate();
  const groupData = mysteryGroups[group];
  const longDate = useMemo(() => rosaryTodayService.longDate(), []);

  const start = (mode: RosaryModeId, to: string) => {
    update({ lastMode: mode });
    navigate(`${to}?grupo=${group}`);
  };

  return (
    <RosaryLayout title="Santo Rosario" subtitle={longDate} back="/">
      {today.status === "loading" ? (
        <RosaryLoading label="Cargando los misterios de hoy" />
      ) : (
        <section className="glass gold-border rounded-3xl p-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">Misterios de hoy</p>
          <h2 className="font-display text-3xl mt-1 gold-text">{groupData.name}</h2>
          <p className="text-sm text-muted-foreground mt-2">{groupData.description}</p>
          <p className="text-xs text-gold/90 mt-3">
            {today.status === "ready" ? today.data.reasonLabel : ""}
          </p>
          {today.status === "ready" && today.data.offlineFallback && (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
              Calculado en tu dispositivo (sin datos litúrgicos del servidor).
            </p>
          )}
          <button
            type="button"
            onClick={() => start(prefs.lastMode ?? "digital", prefs.lastMode === "audio" ? "/rosario/audio" : prefs.lastMode === "physical" ? "/rosario/fisico" : "/rosario/digital")}
            className="mt-4 w-full min-h-12 rounded-full bg-gradient-gold text-navy-deep font-medium"
          >
            Comenzar el Rosario
          </button>
        </section>
      )}

      {resume && resume.status !== "terminado" && (
        <section className="mt-4 glass gold-border rounded-3xl p-4 flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-sm">Tienes un rosario sin terminar</p>
            <p className="text-xs text-muted-foreground truncate">
              {mysteryGroups[resume.group].name} · modo {resume.mode === "audio" ? "audio" : resume.mode === "physical" ? "físico" : "digital"}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Link
              to={`${resume.mode === "audio" ? "/rosario/audio" : resume.mode === "physical" ? "/rosario/fisico" : "/rosario/digital"}?grupo=${resume.group}`}
              className="min-h-11 px-4 flex items-center rounded-full bg-gradient-gold text-navy-deep text-sm font-medium"
            >
              Continuar
            </Link>
            <button
              type="button"
              onClick={() => {
                rosarySessionService.clear();
                setResume(null);
              }}
              className="min-h-11 px-3 text-xs text-muted-foreground"
            >
              Descartar
            </button>
          </div>
        </section>
      )}

      <h2 className="font-display text-xl mt-6 mb-2">Elige cómo quieres rezar</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {MODES.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => start(m.id, m.to)}
              className="w-full h-full text-left glass gold-border rounded-3xl p-4 hover:border-gold transition"
            >
              <m.icon className="h-6 w-6 text-gold" aria-hidden="true" />
              <p className="font-display text-lg mt-2">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.description}</p>
            </button>
          </li>
        ))}
      </ul>

      <Link
        to="/rosario/misterios"
        className="mt-4 flex items-center justify-between glass gold-border rounded-3xl p-4"
      >
        <span className="text-sm">Explorar los misterios y sus meditaciones</span>
        <span className="text-gold text-sm">Ver</span>
      </Link>
    </RosaryLayout>
  );
};

export default RosarioHome;