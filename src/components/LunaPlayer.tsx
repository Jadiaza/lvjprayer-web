import { useEffect } from "react";
import { Radio } from "lucide-react";

declare global {
  interface Window {
    jQuery?: any;
  }
}

const LunaPlayer = () => {
  useEffect(() => {
    const $ = window.jQuery;
    if (!$?.fn?.lunaradio || document.querySelector("#lvj-luna-player .lunaradio")) return;
    $("#lvj-luna-player").lunaradio({
      userinterface: "big",
      backgroundcolor: "rgba(7, 16, 32, 0.96)",
      fontcolor: "#f6f3e9",
      hightlightcolor: "#d8b45c",
      fontname: "DM Sans",
      googlefont: "DM+Sans:wght@400;500;700",
      fontratio: "0.4",
      radioname: "LA VOZ DE JESÚS · CONECTA TU ESPÍRITU",
      scroll: "true",
      coverimage: "/images/lvj-emblema.png",
      onlycoverimage: "false",
      coverstyle: "animated",
      usevisualizer: "real",
      visualizertype: "2",
      itunestoken: "1000lIPN",
      metadatatechnic: "fallback",
      corsproxy: "",
      usestreamcorsproxy: "false",
      streamurl: "https://stream.zeno.fm/phybdd3ph98uv",
      streamtype: "zeno",
      idzeno: "phybdd3ph98uv",
      icecastmountpoint: "",
      shoutcastpath: "",
      shoutcastid: "1",
      metadatainterval: "26000",
      volume: "85",
      debug: "false",
      autoplay: "false",
      displayliveicon: "true",
      visualizeropacity: "0.8",
      multicolorvisualizer: "false",
      color1: "#d8b45c",
      color2: "#a8c8ef",
      color3: "#68c5ba",
      color4: "#d8b45c",
    });
  }, []);

  return (
    <section id="luna-player" className="border-b border-border bg-[#0a1527]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-3 px-4 py-4 sm:px-7 lg:grid-cols-[210px_1fr] lg:px-10">
        <div className="hidden lg:block">
          <span className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.18em] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Señal en vivo</span>
          <h2 className="font-display text-lg font-bold leading-tight text-foreground">Una voz de fe<br /><span className="text-primary">siempre contigo.</span></h2>
          <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">Música, oración y esperanza desde Colombia.</p>
        </div>
        <div className="h-[220px] overflow-hidden rounded border border-white/10 bg-black/20 p-1 sm:h-[240px] sm:p-2">
          <div id="lvj-luna-player" className="h-full w-full" aria-label="Reproductor Luna de La Voz de Jesús" />
        </div>
      </div>
      <div className="sr-only"><Radio /> Reproductor en vivo de La Voz de Jesús</div>
    </section>
  );
};

export default LunaPlayer;
