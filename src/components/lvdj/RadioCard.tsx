import { useEffect, useRef, useState } from "react";
import { Play, Pause, Loader2, Radio as RadioIcon } from "lucide-react";

const STREAM_URL = "https://streammax.alsolnet.com/radiomariaarg";

type Status = "idle" | "connecting" | "playing" | "error";

export const RadioCard = ({ nowPlaying = "Santo Rosario" }: { nowPlaying?: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const a = new Audio();
    a.preload = "none";
    a.src = STREAM_URL;
    audioRef.current = a;
    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus("connecting");
    const onError = () => setStatus("error");
    const onPause = () => setStatus((s) => (s === "playing" ? "idle" : s));
    a.addEventListener("playing", onPlaying);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("error", onError);
    a.addEventListener("pause", onPause);
    return () => {
      a.pause();
      a.src = "";
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (status === "playing" || status === "connecting") {
      a.pause();
      setStatus("idle");
    } else {
      setStatus("connecting");
      try {
        a.load();
        await a.play();
      } catch {
        setStatus("error");
      }
    }
  };

  const isOn = status === "playing" || status === "connecting";

  return (
    <button
      onClick={toggle}
      className="group w-full relative overflow-hidden rounded-2xl bg-gradient-gold shadow-gold px-4 py-3 flex items-center gap-4 hover:scale-[1.01] active:scale-[0.99] transition-all"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-deep/90 shadow-deep">
        {status === "connecting" ? (
          <Loader2 className="h-5 w-5 text-gold animate-spin" />
        ) : isOn ? (
          <Pause className="h-5 w-5 text-gold fill-gold" />
        ) : (
          <Play className="h-5 w-5 text-gold fill-gold ml-0.5" />
        )}
      </span>
      <div className="flex-1 text-left min-w-0">
        <div className="font-display text-lg md:text-xl font-semibold text-navy-deep tracking-wide leading-none">
          {isOn ? "EN TRANSMISIÓN" : "ESCUCHAR EN VIVO"}
        </div>
        <div className="text-xs text-navy-deep/75 mt-1 truncate">
          Ahora suena: <span className="font-medium">{nowPlaying}</span>
        </div>
      </div>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep/15 shrink-0">
        {isOn && (
          <span className="absolute inset-0 rounded-full animate-ping bg-navy-deep/30" />
        )}
        <RadioIcon className="h-4 w-4 text-navy-deep relative" />
      </span>
    </button>
  );
};