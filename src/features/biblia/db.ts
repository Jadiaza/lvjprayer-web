import { openDB, type IDBPDatabase } from "idb";

export interface VersiculoRow {
  id: string; // `${version}:${libroId}:${cap}:${vers}`
  version: string; // e.g. "straubinger"
  libroId: number;
  capitulo: number;
  versiculo: number;
  texto: string;
  tieneNota: boolean;
}

export interface NotaStraubingerRow {
  id: string; // `${libroId}:${cap}:${vers}:${idx}`
  libroId: number;
  capitulo: number;
  versiculo: number;
  texto: string;
}

export interface NotaPersonalRow {
  id: string; // uuid
  libroId: number;
  capitulo: number;
  versiculo: number;
  texto: string;
  creada: number;
}

export interface FavoritoRow {
  id: string; // `${libroId}:${cap}:${vers}`
  libroId: number;
  capitulo: number;
  versiculo: number;
  creado: number;
}

export interface MetaRow {
  key: string;
  value: unknown;
}

const DB_NAME = "lvj_biblia";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("versiculos")) {
          const s = db.createObjectStore("versiculos", { keyPath: "id" });
          s.createIndex("porCapitulo", ["version", "libroId", "capitulo"]);
          s.createIndex("porLibro", ["version", "libroId"]);
        }
        if (!db.objectStoreNames.contains("notas_straubinger")) {
          const s = db.createObjectStore("notas_straubinger", { keyPath: "id" });
          s.createIndex("porVersiculo", ["libroId", "capitulo", "versiculo"]);
        }
        if (!db.objectStoreNames.contains("notas_personales")) {
          const s = db.createObjectStore("notas_personales", { keyPath: "id" });
          s.createIndex("porVersiculo", ["libroId", "capitulo", "versiculo"]);
        }
        if (!db.objectStoreNames.contains("favoritos")) {
          db.createObjectStore("favoritos", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export async function clearAllBibleData() {
  const db = await getDb();
  const tx = db.transaction(
    ["versiculos", "notas_straubinger", "meta"],
    "readwrite",
  );
  await Promise.all([
    tx.objectStore("versiculos").clear(),
    tx.objectStore("notas_straubinger").clear(),
    tx.objectStore("meta").clear(),
  ]);
  await tx.done;
}

export async function setMeta(key: string, value: unknown) {
  const db = await getDb();
  await db.put("meta", { key, value });
}

export async function getMeta<T = unknown>(key: string): Promise<T | undefined> {
  const db = await getDb();
  const row = await db.get("meta", key);
  return row?.value as T | undefined;
}

export async function getVersiculosDeCapitulo(
  version: string,
  libroId: number,
  capitulo: number,
): Promise<VersiculoRow[]> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(
    "versiculos",
    "porCapitulo",
    IDBKeyRange.only([version, libroId, capitulo]),
  );
  return (rows as VersiculoRow[]).sort((a, b) => a.versiculo - b.versiculo);
}

export async function getCapitulosDeLibro(
  version: string,
  libroId: number,
): Promise<number[]> {
  const db = await getDb();
  const rows = (await db.getAllFromIndex(
    "versiculos",
    "porLibro",
    IDBKeyRange.only([version, libroId]),
  )) as VersiculoRow[];
  const set = new Set<number>();
  for (const r of rows) set.add(r.capitulo);
  return Array.from(set).sort((a, b) => a - b);
}

export async function getNotasStraubinger(
  libroId: number,
  capitulo: number,
  versiculo: number,
): Promise<NotaStraubingerRow[]> {
  const db = await getDb();
  const rows = await db.getAllFromIndex(
    "notas_straubinger",
    "porVersiculo",
    IDBKeyRange.only([libroId, capitulo, versiculo]),
  );
  return rows as NotaStraubingerRow[];
}

// Favoritos
export async function toggleFavorito(libroId: number, capitulo: number, versiculo: number) {
  const db = await getDb();
  const id = `${libroId}:${capitulo}:${versiculo}`;
  const existing = await db.get("favoritos", id);
  if (existing) {
    await db.delete("favoritos", id);
    return false;
  }
  await db.put("favoritos", { id, libroId, capitulo, versiculo, creado: Date.now() });
  return true;
}

export async function esFavorito(libroId: number, capitulo: number, versiculo: number) {
  const db = await getDb();
  return !!(await db.get("favoritos", `${libroId}:${capitulo}:${versiculo}`));
}

export async function listarFavoritos(): Promise<FavoritoRow[]> {
  const db = await getDb();
  return (await db.getAll("favoritos")) as FavoritoRow[];
}

// Notas personales
export async function crearNotaPersonal(row: Omit<NotaPersonalRow, "id" | "creada">) {
  const db = await getDb();
  const id = crypto.randomUUID();
  const nota: NotaPersonalRow = { ...row, id, creada: Date.now() };
  await db.put("notas_personales", nota);
  return nota;
}

export async function listarNotasPersonales(
  libroId: number,
  capitulo: number,
  versiculo: number,
): Promise<NotaPersonalRow[]> {
  const db = await getDb();
  return (await db.getAllFromIndex(
    "notas_personales",
    "porVersiculo",
    IDBKeyRange.only([libroId, capitulo, versiculo]),
  )) as NotaPersonalRow[];
}

export async function eliminarNotaPersonal(id: string) {
  const db = await getDb();
  await db.delete("notas_personales", id);
}