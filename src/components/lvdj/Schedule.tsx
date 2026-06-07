import { Clock, Play } from "lucide-react";

const schedule = [
  { time: "05:00", title: "Liturgia de las Horas", host: "Comunidad Monástica", live: false },
  { time: "06:30", title: "Santa Misa Matutina", host: "Padre Antonio Rivera", live: true },
  { time: "08:00", title: "Evangelio del Día", host: "Hna. María del Carmen", live: false },
  { time: "10:00", title: "Caminos de Fe", host: "Diácono Luis Pérez", live: false },
  { time: "12:00", title: "Ángelus y Reflexión", host: "Padre Joaquín", live: false },
  { time: "15:00", title: "Hora de la Misericordia", host: "Comunidad Adoradores", live: false },
  { time: "18:00", title: "Santo Rosario", host: "Familias en Oración", live: false },
  { time: "20:00", title: "Voces de Esperanza", host: "Padre Mateo Suárez", live: false },
];

export const Schedule = () => (
  <section className="container py-12">
    <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-gold mb-2">En el aire</div>
        <h2 className="font-display text-4xl md:text-5xl">Programación de Hoy</h2>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-gold" />
        Martes, 9 de Junio · Hora local
      </div>
    </div>

    <div className="glass rounded-3xl overflow-hidden">
      <div className="divide-y divide-[hsl(var(--gold)/0.1)]">
        {schedule.map((s) => (
          <div
            key={s.time}
            className={`grid grid-cols-[80px_1fr_auto] md:grid-cols-[120px_1fr_1fr_auto] items-center gap-4 px-5 md:px-8 py-5 transition-colors hover:bg-[hsl(var(--gold)/0.04)] ${
              s.live ? "bg-[hsl(var(--gold)/0.06)]" : ""
            }`}
          >
            <div className="font-display text-2xl text-gold tabular-nums">{s.time}</div>
            <div>
              <div className="font-medium flex items-center gap-3">
                {s.title}
                {s.live && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> En vivo
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 md:hidden">{s.host}</div>
            </div>
            <div className="hidden md:block text-sm text-muted-foreground">{s.host}</div>
            <button className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
              s.live ? "bg-gradient-gold text-navy-deep shadow-gold" : "glass text-gold hover:bg-gold/10"
            }`}>
              <Play className="h-4 w-4 ml-0.5 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);