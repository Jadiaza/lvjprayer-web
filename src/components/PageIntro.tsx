type PageIntroProps = { eyebrow: string; title: string; description: string };

export const PageIntro = ({ eyebrow, title, description }: PageIntroProps) => (
  <section className="relative isolate overflow-hidden border-b border-border bg-[#0a1629]">
    <img src="/images/lvj-emblema.png" alt="" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 object-contain opacity-[.09] sm:right-8 sm:h-96 sm:w-96" />
    <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <span className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[.2em] text-primary"><span className="h-px w-8 bg-primary" />{eyebrow}</span>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
    </div>
  </section>
);

export const SampleContentNote = ({ children = "Contenido demostrativo para la adaptación de LVJ." }: { children?: string }) => (
  <div className="border-l-2 border-primary/70 bg-primary/5 px-4 py-3 text-[11px] leading-5 text-muted-foreground">{children}</div>
);
