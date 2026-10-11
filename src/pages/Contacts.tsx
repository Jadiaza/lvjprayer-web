import { FormEvent } from "react";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Radio, Send } from "lucide-react";
import { PageIntro, SampleContentNote } from "@/components/PageIntro";

const phone = "573028375008";
const Contacts = () => {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `Hola, La Voz de Jesús. Soy ${data.get("name")}. Mi correo es ${data.get("email")}.\n\n${data.get("message")}`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return <main>
    <PageIntro eyebrow="CONTACTO · COMUNIDAD" title="Estamos aquí para escucharte" description="Escríbenos, comparte un testimonio o cuéntanos cómo podemos acompañarte en la fe." />
    <div className="mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-12"><SampleContentNote>El formulario prepara un mensaje en WhatsApp. La información solo se enviará cuando confirmes el envío desde tu cuenta.</SampleContentNote></div>
    <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-9 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12 lg:px-12 lg:py-12">
      <div className="border border-border bg-card p-5 sm:p-8"><span className="text-[9px] font-bold uppercase tracking-[.18em] text-primary">MENSAJE PARA LVJ</span><h2 className="mt-2 font-display text-2xl font-semibold text-foreground">Conversemos</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">Completa estos datos y continuaremos la conversación por WhatsApp.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-[10px] font-semibold uppercase tracking-[.1em] text-muted-foreground">Nombre<input required name="name" autoComplete="name" className="h-11 border border-border bg-background px-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-primary" placeholder="Tu nombre" /></label><label className="grid gap-2 text-[10px] font-semibold uppercase tracking-[.1em] text-muted-foreground">Correo electrónico<input required name="email" type="email" autoComplete="email" className="h-11 border border-border bg-background px-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-primary" placeholder="tu@correo.com" /></label><label className="grid gap-2 text-[10px] font-semibold uppercase tracking-[.1em] text-muted-foreground sm:col-span-2">Mensaje<textarea required name="message" rows={5} className="resize-y border border-border bg-background px-3 py-3 text-sm normal-case tracking-normal text-foreground outline-none focus:border-primary" placeholder="¿En qué podemos ayudarte?" /></label><div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center"><button type="submit" className="inline-flex items-center gap-2 bg-gradient-lvj px-5 py-3 text-[10px] font-bold uppercase tracking-[.12em] text-primary-foreground"><Send className="h-3.5 w-3.5" /> Continuar por WhatsApp</button><span className="text-[9px] leading-4 text-muted-foreground">Se abrirá WhatsApp para que revises y confirmes el envío.</span></div></form>
      </div>
      <aside className="space-y-4">
        <div className="border border-primary/30 bg-[#0a1629] p-5"><span className="text-[9px] font-bold uppercase tracking-[.16em] text-primary">EN COMUNIDAD</span><h2 className="mt-2 font-display text-xl font-semibold text-foreground">Nos unimos en oración</h2><p className="mt-2 text-xs leading-6 text-muted-foreground">Si deseas compartir una intención de oración, escríbenos directamente. Comparte solo lo que te sientas cómodo compartiendo.</p><a href={`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent("Hola, La Voz de Jesús. Quisiera compartir una intención de oración.")}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.1em] text-primary"><MessageCircle className="h-4 w-4" /> Enviar intención por WhatsApp</a></div>
        <div className="border border-border p-5"><h2 className="font-display text-lg font-semibold text-foreground">La Voz de Jesús</h2><div className="mt-4 grid gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-3"><MapPin className="h-4 w-4 shrink-0 text-primary" /> Colombia</span><a href={`https://api.whatsapp.com/send?phone=${phone}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><MessageCircle className="h-4 w-4 shrink-0 text-primary" /> WhatsApp LVJ</a><a href="https://play.google.com/store/apps/details?id=com.jadiaza.lvjesus" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-primary"><Radio className="h-4 w-4 shrink-0 text-primary" /> Aplicación móvil</a></div><div className="mt-5 flex gap-3 border-t border-border pt-4"><a aria-label="Facebook" href="https://facebook.com/lavozdejesus.col/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Facebook className="h-4 w-4" /></a><a aria-label="Instagram" href="https://www.instagram.com/lavozdejesus.co/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary"><Instagram className="h-4 w-4" /></a><span className="text-[9px] text-muted-foreground">Síguenos en redes</span></div></div>
        <a href="mailto:?subject=Contacto%20La%20Voz%20de%20Jes%C3%BAs" className="flex items-center gap-3 border border-border p-4 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground"><Mail className="h-4 w-4 text-primary" /> Abrir correo en tu dispositivo</a>
      </aside>
    </section>
  </main>;
};

export default Contacts;
