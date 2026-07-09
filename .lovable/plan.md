## LaVozFy — Fase 1 dentro de "La Voz de Jesús"

Módulo musical con estética evolucionada de Catolify, montado en `/musica` sin tocar el home actual.

### 1. Activar Lovable Cloud
- Habilito Cloud (Supabase) — necesario para auth básica.
- Auth: email/password + Google (defaults de Cloud). Sin tabla `profiles` según tu decisión.
- Rutas `/musica/login` y `/musica/registro`. `/musica/reset-password` incluida.

### 2. YouTube API key
- **No puedo generarla.** Cuando la tengas, la guardaré con `add_secret` como `YOUTUBE_API_KEY` (edge function `youtube-search` la leerá con `Deno.env.get`).
- Mientras tanto: catálogo mock con `videoId` fijos y buscador que filtra los datos demo. El IFrame Player ya funciona sin key.

### 3. Estructura de rutas (dentro del proyecto actual)

```
/musica                     → Home (grillas por categoría)
/musica/explorar
/musica/artistas            → grilla de artistas
/musica/artista/:id
/musica/albumes             → grilla de álbumes
/musica/album/:id
/musica/canciones
/musica/generos
/musica/generos/:slug
/musica/nuevos
/musica/orar · /adoracion · /alabanza · /mariana · /liturgica
/musica/buscar?q=
/musica/biblioteca          → tabs: canciones, álbumes, artistas, playlists, favoritos, historial
/musica/playlist/:id
/musica/perfil
/musica/login /registro /reset-password
```

- QuickAccess y BottomNav del home reciben un item **"Música"** que entra a `/musica`.
- El shell de `/musica` es independiente: sidebar propio + player fijo, no reutiliza el layout de la radio.

### 4. Design tokens (nuevos, sin romper los existentes)
Se añaden a `src/index.css` con prefijo `--lv-*` para no chocar con el tema dorado/navy actual:

```
--lv-bg: 240 12% 11%          /* #17171F */
--lv-sidebar: 240 12% 9%      /* #121219 */
--lv-panel: 240 11% 15%       /* #20202A */
--lv-green: 92 39% 52%        /* #77B255 */
--lv-gold: 42 45% 58%         /* #C9A85D */
--lv-text: 43 33% 94%         /* #F6F3EA */
--lv-text-muted: 240 6% 68%   /* #A7A7B2 */
--lv-border: 0 0% 100% / 0.08
```

Tipografía: **Inter** vía `@fontsource/inter` (importado en `main.tsx`, sin CDN). Todo dentro del árbol `/musica` usa la clase `lavozfy` en el root que fija estas variables.

### 5. Componentes (nuevos, en `src/features/lavozfy/`)

```
components/
  Sidebar.tsx              — logo, buscador, secciones Explorar/Mi Música/Usuario
  MobileNav.tsx            — bottom nav 5 items
  Header.tsx               — título sección + buscador + notif + avatar
  AlbumCard.tsx            — carátula 1:1, overlay play, favorito
  ArtistCard.tsx           — circular/cuadrada, verificado, seguir
  TrackRow.tsx             — fila horizontal con duración y menú
  SectionHeader.tsx        — título + "Ver todos"
  MusicPlayer.tsx          — barra inferior desktop
  MiniPlayer.tsx           — barra móvil sobre bottom nav
  FullScreenPlayer.tsx     — vista ampliada con carátula grande + blur
  QueuePanel.tsx           — cola lateral
  SourceBadge.tsx          — "YouTube" / "Audio"
  FavoriteButton.tsx
  PlayButton.tsx
  YouTubePlayer.tsx        — IFrame Player API oficial
  HtmlAudioPlayer.tsx      — HTMLAudioElement + Media Session API
pages/
  MusicaLayout.tsx         — sidebar + main + player (desktop) / bottom nav + mini + full (mobile)
  Home.tsx  Explorar.tsx  Artistas.tsx  Artista.tsx
  Albumes.tsx  Album.tsx  Canciones.tsx  Generos.tsx  Genero.tsx
  Nuevos.tsx  Buscar.tsx  Biblioteca.tsx  Playlist.tsx  Perfil.tsx
  Login.tsx  Registro.tsx  ResetPassword.tsx
data/
  artists.ts  albums.ts  tracks.ts  playlists.ts  genres.ts
  (datos ficticios pedidos: Ministerio Emaús, Voces del Cenáculo, álbumes "Ante tu presencia" etc.)
state/
  playerStore.ts           — Zustand: currentTrack, queue, isPlaying, volume, shuffle, repeat, position
  authStore.ts             — sesión Supabase
lib/
  supabase.ts              — cliente
  youtube.ts               — wrapper IFrame API
```

### 6. Reproductor
- **Estado global** con Zustand para que la reproducción sobreviva la navegación entre rutas.
- Dos motores intercambiables según `track.source`:
  - `youtube` → IFrame Player invisible (excepto en FullScreen). Muestra badge "Fuente: YouTube".
  - `audio` → `<audio>` + Media Session API para lockscreen.
- No hay descarga, no hay yt-dlp, no hay bloqueo de ads. IFrame oficial con `origin` correcto.
- Cola, aleatorio, repetición, favoritos y historial en memoria (localStorage por ahora — los persisto en Cloud en la fase 2 cuando decidas activar profiles).

### 7. Navegación en la app principal
- `QuickAccess`: reemplazo el placeholder "Podcast" (o añado un tile) por **"Música"** → `/musica`.
- `BottomNav`: sustituyo "Programas" por "Música" en móvil (Biblia se queda).
- Nav desktop: añado enlace "Música".

### 8. Fuera de alcance (no en esta fase, según tu respuesta MVP + páginas)
- Panel administrativo, playlists persistidas en DB, tabla `profiles`, cola persistida por usuario, letras autorizadas.
  Los dejo como stubs "Próximamente".

### Detalles técnicos
- Instalo: `zustand`, `@fontsource/inter`. `@supabase/supabase-js` viene con Cloud.
- No toco: `BibliaLayout`, `DesktopHome`, `MobileHome`, tokens `--gold/--navy`, PWA/manifest existente.
- El manifest actual sigue apuntando a "La Voz de Jesús"; la marca LaVozFy vive solo dentro de `/musica`.

Confirmas y arranco la implementación completa en una sola tanda (activación Cloud + todos los archivos anteriores).