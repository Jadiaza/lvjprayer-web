import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Trash2, Download, Play } from "lucide-react";
import { BibliaLayout } from "./BibliaLayout";
import bibliaAsset from "@/assets/biblia/toda_la_biblia.txt.asset.json";
import notasAsset from "@/assets/biblia/todos_los_comentarios.txt.asset.json";
import listaAsset from "@/assets/biblia/lista_libros.txt.asset.json";
import { parseBiblia, parseComentarios, type ParsedBible } from "@/features/biblia/parser";
import {
  clearAllBibleData,
  getDb,
  getMeta,
  setMeta,
} from "@/features/biblia/db";
import { libroById } from "@/features/biblia/books";
import { toast } from "@/components/ui/sonner";

type Estado = "idle" | "descargando" | "analizando" | "importando" | "listo" | "error";

interface Preview {
  librosDetectados: number[];
  totalCapitulos: number;
  totalVersiculos: number;
  totalNotas: number;
  errores: string[];
  parsed: ParsedBible;
  notasParsed: ReturnType<typeof parseComentarios>;
}

export default function BibliaImportar() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [ya, setYa] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const done = await getMeta<boolean>("importDone");
      setYa(!!done);
    })();
  }, []);

  const analizar = async () => {
    try {
      setEstado("descargando");
      setMensaje("Descargando archivos fuente…");
      const [bibliaTxt, notasTxt] = await Promise.all([
        fetch(bibliaAsset.url).then((r) => r.text()),
        fetch(notasAsset.url).then((r) => r.text()),
      ]);

      setEstado("analizando");
      setMensaje("Analizando texto bíblico…");
      const parsed = parseBiblia(bibliaTxt);
      const notasParsed = parseComentarios(notasTxt, parsed);

      const totalCapitulos = Object.values(parsed.capitulosPorLibro).reduce(
        (a, b) => a + b,
        0,
      );

      setPreview({
        librosDetectados: parsed.librosDetectados,
        totalCapitulos,
        totalVersiculos: parsed.versiculos.length,
        totalNotas: notasParsed.notas.length,
        errores: [...parsed.errores, ...notasParsed.errores],
        parsed,
        notasParsed,
      });
      setEstado("idle");
      setMensaje("Vista previa lista. Revisa los conteos y pulsa “Importar Biblia”.");
    } catch (e) {
      console.error(e);
      setEstado("error");
      setMensaje("No se pudo procesar los archivos.");
    }
  };

  const importar = async () => {
    if (!preview) return;
    try {
      setEstado("importando");
      setMensaje("Guardando en la base local…");
      const db = await getDb();

      // 1. limpiar previos
      await clearAllBibleData();

      // 2. versículos
      const txV = db.transaction("versiculos", "readwrite");
      const vStore = txV.objectStore("versiculos");
      for (const v of preview.parsed.versiculos) {
        const id = `straubinger:${v.libroId}:${v.capitulo}:${v.versiculo}`;
        vStore.put({ id, version: "straubinger", ...v });
      }
      await txV.done;

      // 3. notas straubinger
      const txN = db.transaction("notas_straubinger", "readwrite");
      const nStore = txN.objectStore("notas_straubinger");
      const counter: Record<string, number> = {};
      for (const n of preview.notasParsed.notas) {
        const k = `${n.libroId}:${n.capitulo}:${n.versiculo}`;
        counter[k] = (counter[k] ?? 0) + 1;
        const id = `${k}:${counter[k]}`;
        nStore.put({ id, ...n });
      }
      await txN.done;

      await setMeta("importDone", true);
      await setMeta("importFecha", Date.now());
      setYa(true);
      setEstado("listo");
      setMensaje("Importación completada.");
      toast.success("Biblia importada correctamente");
    } catch (e) {
      console.error(e);
      setEstado("error");
      setMensaje("Ocurrió un error al importar.");
    }
  };

  const limpiar = async () => {
    if (!window.confirm("¿Eliminar la Biblia y las notas importadas?")) return;
    await clearAllBibleData();
    setYa(false);
    setPreview(null);
    setMensaje("Datos eliminados.");
    toast.success("Importación limpiada");
  };

  const busy = estado === "descargando" || estado === "analizando" || estado === "importando";

  return (
    <BibliaLayout title="Importar Biblia">
      <div className="glass gold-border rounded-3xl p-5 mb-5">
        <div className="text-[10px] uppercase tracking-[0.28em] text-gold mb-2">
          Fuente
        </div>
        <h2 className="font-display text-2xl mb-1">Biblia Straubinger</h2>
        <p className="text-sm text-foreground/70">
          Archivos: <code className="text-gold">toda_la_biblia.txt</code>,{" "}
          <code className="text-gold">todos_los_comentarios.txt</code>,{" "}
          <code className="text-gold">lista_libros.txt</code>.
        </p>
        <div className="mt-3 text-xs text-foreground/60">
          Lista de libros: <a className="text-gold underline" href={listaAsset.url} target="_blank" rel="noreferrer">ver</a>
        </div>
      </div>

      {mensaje && (
        <div
          className={`glass rounded-2xl px-4 py-3 mb-4 flex items-start gap-2 text-sm ${
            estado === "error"
              ? "border border-red-500/40 text-red-300"
              : "gold-border text-foreground/80"
          }`}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 text-gold animate-spin mt-0.5" />
          ) : estado === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-gold mt-0.5" />
          )}
          <span>{mensaje}</span>
        </div>
      )}

      {/* Botones principales */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <button
          disabled={busy}
          onClick={analizar}
          className="glass gold-border rounded-2xl px-4 py-3 flex items-center justify-center gap-2 hover:bg-gold/10 disabled:opacity-50"
        >
          <Play className="h-4 w-4 text-gold" />
          <span className="text-sm font-medium">Vista previa</span>
        </button>
        <button
          disabled={!preview || busy}
          onClick={importar}
          className="bg-gradient-gold text-navy-deep font-semibold rounded-2xl px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-40 shadow-gold"
        >
          <Download className="h-4 w-4" />
          Importar Biblia
        </button>
      </div>

      {/* Conteos preview */}
      {preview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Libros" value={preview.librosDetectados.length} />
          <StatCard label="Capítulos" value={preview.totalCapitulos} />
          <StatCard label="Versículos" value={preview.totalVersiculos} />
          <StatCard label="Notas" value={preview.totalNotas} />
        </div>
      )}

      {/* Detalle libros detectados */}
      {preview && (
        <div className="glass gold-border rounded-2xl p-4 mb-6">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-2">
            Libros detectados
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {preview.librosDetectados.map((id) => {
              const l = libroById(id);
              return (
                <span
                  key={id}
                  className="px-2 py-0.5 rounded-full gold-border text-foreground/80"
                >
                  {l?.nombre ?? `#${id}`} ({preview.parsed.capitulosPorLibro[id] ?? 0})
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Limpiar */}
      {ya && (
        <button
          onClick={limpiar}
          className="w-full glass rounded-2xl px-4 py-3 flex items-center justify-center gap-2 border border-red-500/40 text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Limpiar importación
        </button>
      )}

      <p className="text-[11px] text-foreground/50 text-center mt-6">
        Los datos se guardan en tu dispositivo (IndexedDB). Sin conexión a servidor.
      </p>
    </BibliaLayout>
  );
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="glass gold-border rounded-2xl p-3 text-center">
    <div className="font-display text-2xl gold-text">{value.toLocaleString("es")}</div>
    <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/60 mt-1">
      {label}
    </div>
  </div>
);