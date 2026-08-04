import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { RosaryLayout } from "../components/RosaryLayout";
import { RosaryLoading } from "../components/RosaryStateViews";
import { PrayerStepCard } from "../components/PrayerStepCard";
import { RosaryProgress } from "../components/RosaryProgress";
import { RosaryBeadRing } from "../components/RosaryBeadRing";
import { RosaryCompletion } from "../components/RosaryCompletion";
import { RosaryIntentionSheet } from "../components/RosaryIntentionSheet";
import { RosarySettingsSheet } from "../components/RosarySettingsSheet";
import { useRosarySession } from "../hooks/useRosarySession";
import { useRosaryPreferences } from "../hooks/useRosaryPreferences";
import { useKeepAwake } from "../hooks/useKeepAwake";
import { mysteryGroups } from "../mocks/mysteries";
import { rosaryTodayService } from "../services/rosaryTodayService";
import type { MysteryGroupId, RosaryIntention } from "../types";

const isGroup = (v: string | null): v is MysteryGroupId =>
  !!v && ["gozosos", "luminosos", "dolorosos", "gloriosos"].includes(v);

export const RosarioDigital = () => {
  const [params] = useSearchParams();
  const group = isGroup(params.get("grupo")) ? (params.get("grupo") as MysteryGroupId) : rosaryTodayService.groupForDate();
  const { prefs, update } = useRosaryPreferences();
  const [intention, setIntentionValue] = useState<RosaryIntention | null>(null);
  const [askedIntention, setAskedIntention] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const s = useRosarySession({ group, mode: "digital", intention, haptics: prefs.haptics });
  useKeepAwake(prefs.keepAwake && askedIntention && !s.completed);

  const mystery = useMemo(() => {
    if (!s.section?.mysteryId) return null;
    return mysteryGroups[group].mysteries.find((m) => m.id === s.section?.mysteryId) ?? null;
  }, [s.section, group]);

  const decade = s.section?.type === "decade" ? Number(s.section.id.split("-")[1]) : null;

  return (
    <RosaryLayout
      title={mysteryGroups[group].name}
      subtitle="Rosario digital guiado"
      focus
      actions={
        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          aria-label="Ajustes del rosario"
          className="h-11 w-11 rounded-full glass gold-border flex items-center justify-center"
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
        </button>
      }
    >
      {showSettings && (
        <div className="mb-4">
          <RosarySettingsSheet prefs={prefs} update={update} onClose={() => setShowSettings(false)} />
        </div>
      )}

      {!askedIntention ? (
        <RosaryIntentionSheet
          onConfirm={(value) => {
            setIntentionValue(value);
            s.setIntention(value);
            setAskedIntention(true);
          }}
          onSkip={() => setAskedIntention(true)}
        />
      ) : s.completed ? (
        <RosaryCompletion onRestart={s.restart} intentionLabel={intention?.label ?? null} />
      ) : !s.definition || !s.section || !s.bead ? (
        <RosaryLoading label="Preparando el rosario" />
      ) : (
        <div className="space-y-4">
          <RosaryProgress progress={s.progress} sectionTitle={s.section.title} decade={decade} />
          <RosaryBeadRing
            section={s.section}
            currentBeadId={s.bead.id}
            onSelect={() => {
              /* Indicador de progreso: el avance se hace con los botones. */
            }}
          />
          <PrayerStepCard
            bead={s.bead}
            mystery={mystery}
            textSize={prefs.textSize}
            highContrast={prefs.highContrast}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={s.prev}
              aria-label="Oración anterior"
              className="min-h-12 min-w-12 rounded-full glass gold-border flex items-center justify-center"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={s.next}
              className="flex-1 min-h-12 rounded-full bg-gradient-gold text-navy-deep font-medium flex items-center justify-center gap-2"
            >
              Siguiente
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </RosaryLayout>
  );
};

export default RosarioDigital;