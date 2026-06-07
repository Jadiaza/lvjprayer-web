import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Volume1, Loader2, Radio, Wifi, WifiOff } from "lucide-react";

type Status = "idle" | "connecting" | "playing" | "error";

// Free Catholic radio stream (Radio María / EWTN-style public stream)
const STREAM_URL = "https://streammax.alsolnet.com/radiomariaarg";

export const RadioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.crossOrigin = "anonymous";
    audio.src = STREAM_URL;
    audioRef.current = audio;

    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus("connecting");
    const onError = () => setStatus("error");
    const onPause = () => setStatus((s) => (s === "playing" ? "idle" : s));

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (status === "playing" || status === "connecting") {
      audio.pause();
      setStatus("idle");
    } else {
      setStatus("connecting");
      try {
        // Reload to force a fresh connection to the live stream
        audio.load();
        await audio.play();
      } catch {
        setStatus("error");
      }
    }
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const VolIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const statusInfo = {
    idle: { label: "Listo para transmitir", color: "text-foreground/60", Icon: Wifi },
    connecting: { label: "Conectando…", color: "text-gold", Icon: Loader2 },
    playing: { label: "En vivo · señal estable", color: "text-emerald-400", Icon: Wifi },
    error: { label: "Sin conexión al servidor", color: "text-red-400", Icon: WifiOff },
  }[status];

  return (
    <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-8">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-radial-gold opacity-60" />
      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        {/* Play button + pulsing ring */}
        <div className="relative shrink-0">
          <div
            className={`absolute inset-0 rounded-full ${
              status === "playing" ? "animate-ping bg-gold/30" : ""
            }`}
          />
          <button
            onClick={toggle}
            aria-label={status === "playing" ? "Pausar" : "Reproducir"}
            className="relative h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-gold shadow-gold flex items-center justify-center hover:scale-105 active:scale-95 transition"
          >
            {status === "connecting" ? (
              <Loader2 className="h-8 w-8 text-navy-deep animate-spin" />
            ) : status === "playing" ? (
              <Pause className="h-8 w-8 text-navy-deep fill-navy-deep" />
            ) : (
              <Play className="h-8 w-8 text-navy-deep fill-navy-deep ml-1" />
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="h-3.5 w-3.5 text-gold" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold">Radio en Vivo</span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl truncate">
            Santa Misa Matutina
          </h3>
          <p className="text-sm text-muted-foreground">Padre Antonio Rivera · Catedral de México</p>

          {/* Equalizer + status */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-end gap-[3px] h-5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`w-[3px] rounded-sm bg-gradient-to-t from-gold-deep to-gold-bright ${
                    status === "playing" ? "animate-pulse" : "opacity-30"
                  }`}
                  style={{
                    height: status === "playing" ? `${30 + (i % 3) * 25}%` : "30%",
                    animationDelay: `${i * 120}ms`,
                    animationDuration: `${600 + (i % 3) * 200}ms`,
                  }}
                />
              ))}
            </div>
            <statusInfo.Icon
              className={`h-3.5 w-3.5 ${statusInfo.color} ${
                status === "connecting" ? "animate-spin" : ""
              }`}
            />
            <span className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</span>
            {status === "playing" && (
              <span className="ml-auto text-xs tabular-nums text-muted-foreground hidden sm:inline">
                {fmt(elapsed)}
              </span>
            )}
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 md:flex-col md:w-44 md:items-stretch">
          <button
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Activar audio" : "Silenciar"}
            className="h-10 w-10 rounded-full glass flex items-center justify-center hover:text-gold transition shrink-0"
          >
            <VolIcon className="h-4 w-4" />
          </button>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : Math.round(volume * 100)}
              onChange={(e) => {
                setMuted(false);
                setVolume(Number(e.target.value) / 100);
              }}
              className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-gold cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-gold
                [&::-webkit-slider-thumb]:shadow-gold [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-background"
              style={{
                background: `linear-gradient(to right, hsl(var(--gold)) 0%, hsl(var(--gold)) ${
                  muted ? 0 : volume * 100
                }%, hsl(var(--muted)) ${muted ? 0 : volume * 100}%, hsl(var(--muted)) 100%)`,
              }}
            />
            <span className="text-[10px] tabular-nums text-muted-foreground w-7 text-right">
              {muted ? 0 : Math.round(volume * 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};