import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Headphones, Radio } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import radioStudio from "@/assets/radio-banner.jpg";
import worshipImage from "@/assets/hero-2.jpg";

const slides = [
  { image: radioStudio, category: "LA VOZ DE JESÚS · RADIO CATÓLICA", title: "Una voz de fe\nsiempre contigo.", description: "Música, oración y mensajes que acompañan tu camino. Sintoniza desde donde estés.", action: "Escuchar en vivo", href: "#luna-player" },
  { image: worshipImage, category: "MÚSICA QUE ELEVA EL CORAZÓN", title: "Alabemos juntos\ncon esperanza.", description: "Un espacio para encontrarnos con Dios a través de la música y la comunidad.", action: "Descubrir alabanzas", href: "/charts-elementor" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((prev) => (prev + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);
  const change = (step: number) => setCurrent((value) => (value + step + slides.length) % slides.length);
  const slide = slides[current];
  const primaryAction = slide.href.startsWith("#")
    ? <a href={slide.href} className="inline-flex items-center gap-2 rounded-sm bg-gradient-lvj px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-primary-foreground"><Headphones className="h-4 w-4" />{slide.action}</a>
    : <Link to={slide.href} className="inline-flex items-center gap-2 rounded-sm bg-gradient-lvj px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-primary-foreground"><Headphones className="h-4 w-4" />{slide.action}</Link>;

  return (
    <section className="relative isolate flex min-h-[470px] items-center overflow-hidden border-b border-border md:min-h-[570px] lg:min-h-[620px]">
      <AnimatePresence mode="wait"><motion.div key={slide.image} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .65 }} className="absolute inset-0 -z-20"><img src={slide.image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#071020] via-[#071020]/80 to-[#071020]/15" /><div className="absolute inset-0 bg-gradient-to-t from-[#071020]/60 via-transparent to-[#071020]/15" /></motion.div></AnimatePresence>
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <motion.div key={`category-${current}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-primary"><span className="h-px w-9 bg-primary" />{slide.category}</motion.div>
          <motion.h1 key={`title-${current}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }} className="whitespace-pre-line font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">{slide.title.split("\n").map((line, i) => <span key={line} className={i === 1 ? "text-primary" : ""}>{line}{i === 0 ? <br /> : null}</span>)}</motion.h1>
          <motion.p key={`description-${current}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }} className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">{slide.description}</motion.p>
          <div className="mt-8 flex flex-wrap items-center gap-3">{primaryAction}<Link to="/shows-schedule" className="inline-flex items-center gap-2 rounded-sm border border-white/25 bg-black/10 px-5 py-3 text-xs font-semibold uppercase tracking-[.1em] text-white transition-colors hover:border-primary hover:text-primary"><Radio className="h-4 w-4" /> Ver programación</Link></div>
        </div>
      </div>
      <div className="absolute bottom-5 right-5 flex items-center gap-2 sm:bottom-8 sm:right-8"><span className="mr-2 text-[9px] font-semibold tracking-[.14em] text-white/60">0{current + 1} / 0{slides.length}</span><button type="button" aria-label="Diapositiva anterior" onClick={() => change(-1)} className="grid h-9 w-9 place-items-center border border-white/25 bg-black/20 text-white hover:border-primary hover:text-primary"><ChevronLeft className="h-4 w-4" /></button><button type="button" aria-label="Siguiente diapositiva" onClick={() => change(1)} className="grid h-9 w-9 place-items-center border border-white/25 bg-black/20 text-white hover:border-primary hover:text-primary"><ChevronRight className="h-4 w-4" /></button></div>
    </section>
  );
};

export default HeroCarousel;
