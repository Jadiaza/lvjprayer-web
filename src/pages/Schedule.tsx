import { useEffect, useState } from "react";
import { CalendarClock, Clock3, Headphones, Music2 } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";
import { getPublicCollection, type PublicProgram } from "@/lib/publicContent";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const programs = [
  { time: "06:00", duration: "30 min", title: "Al despertar con María", description: "Oración de la mañana y ofrecimiento del día.", category: "Oración" },
  { time: "07:00", duration: "30 min", title: "Laudes y salmos", description: "Oración de la Iglesia para comenzar la jornada.", category: "Liturgia" },
  { time: "08:00", duration: "45 min", title: "La Palabra de hoy", description: "Lecturas del día y una reflexión para vivir el Evangelio.", category: "Evangelio" },
  { time: "10:00", duration: "60 min", title: "Alabemos juntos", description: "Música católica, cantos de fe y mensajes de esperanza.", category: "Música" },
  { time: "12:00", duration: "15 min", title: "El Ángelus", description: "Un momento breve de oración en comunidad.", category: "Oración" },
  { time: "16:00", duration: "45 min", title: "Fe que responde", description: "Preguntas sobre la vida cristiana y formación católica.", category: "Formación" },
  { time: "18:00", duration: "30 min", title: "Testigos de esperanza", description: "Historias de servicio, conversión y vida comunitaria.", category: "Testimonios" },
  { time: "20:00", duration: "30 min", title: "Santo Rosario", description: "Rezamos juntos por las intenciones de nuestra audiencia.", category: "Oración" },
];
const saturdayPrograms = [
  { time: "08:00", duration: "45 min", title: "La Palabra de hoy", description: "Lecturas del día y una reflexión para vivir el Evangelio.", category: "Evangelio" },
  { time: "10:00", duration: "60 min", title: "Alabemos juntos", description: "Música católica, cantos de fe y mensajes de esperanza.", category: "Música" },
  { time: "12:00", duration: "30 min", title: "Rosario en comunidad", description: "Presentamos nuestras intenciones a Jesús por medio de María.", category: "Oración" },
  { time: "17:00", duration: "45 min", title: "Voces de esperanza", description: "Testimonios y experiencias de servicio cristiano.", category: "Testimonios" },
  { time: "20:00", duration: "30 min", title: "Oración de la noche", description: "Cerramos el día en gratitud y recogimiento.", category: "Oración" },
];
const sundayPrograms = [
  { time: "07:00", duration: "60 min", title: "Santa Misa · espacio de muestra", description: "Transmisión litúrgica de ejemplo, pendiente de confirmar con LVJ.", category: "Liturgia" },
  { time: "09:00", duration: "45 min", title: "El Evangelio del domingo", description: "Una reflexión para vivir la celebración en familia.", category: "Evangelio" },
  { time: "12:00", duration: "15 min", title: "El Ángelus", description: "Oración en comunidad al mediodía.", category: "Oración" },
  { time: "16:00", duration: "60 min", title: "Alabanza para el camino", description: "Cantos católicos para compartir la alegría de la fe.", category: "Música" },
  { time: "20:00", duration: "30 min", title: "Santo Rosario", description: "Rezamos juntos por las intenciones de nuestra audiencia.", category: "Oración" },
];

const Schedule = () => {
  const [day, setDay] = useState("Lunes");
  const [livePrograms, setLivePrograms] = useState<PublicProgram[]>([]);
  useEffect(() => {
    getPublicCollection<PublicProgram>("programs").then(setLivePrograms).catch(() => setLivePrograms([]));
  }, []);
  const samplePrograms = day === "Domingo" ? sundayPrograms : day === "Sábado" ? saturdayPrograms : programs;
  const dayPrograms = livePrograms.length
    ? livePrograms.filter((program) => program.weekday === day || program.weekday === "Todos los días").map((program) => ({
      time: (program.start_time || "00:00").slice(0, 5),
      duration: program.end_time ? `hasta ${program.end_time.slice(0, 5)}` : "En programación",
      title: program.title,
      description: program.summary,
      category: program.category || "Programación",
    }))
    : samplePrograms;
  return <main>
    <PageIntro eyebrow="PROGRAMACIÓN · LVJ" title="Acompañamos tu día, hora a hora" description="Oración, Evangelio, formación y música católica para compartir la fe durante toda la semana." />
    {livePrograms.length === 0 && <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>Parrilla de muestra mientras el equipo carga la programación oficial desde el panel editorial.</SampleContentNote></div>}
    <section className="mx-auto max-w-[1440px] px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
      <div className="mb-6 flex items-center gap-3"><CalendarClock className="h-5 w-5 text-primary" /><div><h2 className="font-display text-2xl font-semibold text-foreground">Parrilla semanal</h2><p className="mt-1 text-[10px] text-muted-foreground">Selecciona un día para ver los programas publicados por LVJ.</p></div></div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">{days.map((item) => <button key={item} type="button" onClick={() => setDay(item)} className={`border px-3 py-3 text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${day === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"}`}>{item}</button>)}</div>
      <div className="mt-7 grid gap-3 lg:grid-cols-2">{dayPrograms.map((program, index) => <article key={`${day}-${program.time}`} className="flex gap-4 border border-border bg-card p-4 sm:gap-6 sm:p-5"><div className="w-16 shrink-0 border-r border-border pr-4"><strong className="font-display text-xl text-primary">{program.time}</strong><small className="mt-1 block text-[9px] text-muted-foreground">{program.duration}</small></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[8px] font-bold uppercase tracking-[.14em] text-primary">{program.category}</span>{index === 0 && <span className="rounded-sm bg-emerald-400/10 px-2 py-1 text-[8px] font-bold uppercase tracking-[.1em] text-emerald-300">Inicio del día</span>}</div><h3 className="mt-1 font-display text-lg font-semibold text-foreground">{program.title}</h3><p className="mt-1 text-[11px] leading-5 text-muted-foreground">{program.description}</p></div><div className="hidden items-center sm:flex"><Clock3 className="h-4 w-4 text-muted-foreground" /></div></article>)}</div>
      <div className="mt-8 flex flex-col justify-between gap-4 border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><Music2 className="h-5 w-5 text-primary" /><div><strong className="block text-xs text-foreground">¿Te perdiste un programa?</strong><span className="mt-1 block text-[10px] text-muted-foreground">Pronto podrás escuchar episodios y reflexiones en nuestra sección de videos.</span></div></div><a href="#luna-player" className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.1em] text-primary">Escuchar ahora <Headphones className="h-3.5 w-3.5" /></a></div>
    </section>
  </main>;
};

export default Schedule;
