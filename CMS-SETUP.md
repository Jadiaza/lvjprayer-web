# Administrador completo de La Voz de Jesús

## Componentes

- **Panel en Vercel:** /admin en el proyecto administrativo. Autenticación y permisos editor/admin usan Supabase Auth y RLS.
- **Noticias:** /admin/noticias; mantiene la bandeja de fuentes revisada por un editor.
- **Contenido general:** programas, audios, artistas, videos, playlists, páginas, catálogo de medios, ajustes y temas litúrgicos.
- **Web pública en el hosting:** las páginas consultan únicamente contenido publicado a través de /api/contenido.php.
- **Fuentes RSS:** se pueden administrar desde el módulo Fuentes RSS. El cron de Vercel importa metadatos al buzón; nunca publica automáticamente las noticias.

## Aplicación de la estructura

1. En Supabase, ejecutar supabase/cms-schema.sql una sola vez en el SQL Editor. El script crea tablas nuevas y políticas RLS; no reemplaza las tablas de LVJ Prayer ni las tablas de noticias.
2. Desplegar la rama cms-full-admin en Vercel como Preview y comprobar el panel antes de fusionar a main.
3. Copiar hosting-api/contenido.php a /public_html/api/contenido.php. Debe quedar junto al news-bootstrap.php ya usado por noticias y al config.local.php privado existente.
4. No reemplazar /public_html/api/bootstrap.php de LVJ Prayer. No subir secretos a GitHub ni a la carpeta pública.
5. Reconstruir el sitio público con npm run build:hosting y publicar el contenido de dist-hosting en /public_html/lvjplayer/.

## Variables

El endpoint del hosting usa los valores privados que ya existen en /public_html/api/config.local.php:

- supabase_url
- supabase_anon_key

El panel requiere en Vercel VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY. El cron requiere SUPABASE_URL, SUPABASE_SECRET_KEY y CRON_SECRET; la clave secreta vive solo en Vercel.

## Publicación y calendario

- Los elementos públicos se muestran al estar en estado publicado.
- Los temas litúrgicos se activan por fecha (Desde y Hasta) con sus colores principales, acento y fondo. Se recomienda programar las temporadas con anticipación y verificar fechas del calendario litúrgico colombiano.
- Audios, videos, imágenes y medios se administran por enlaces HTTPS para evitar que archivos pesados ralenticen el panel o el hosting. La playlist guarda una lista JSON de pistas.
- RSS/Atom aporta titulares, extractos y enlaces para revisión editorial. Redacta una nota propia y conserva atribución/enlace; no se copian cuerpos automáticamente.

## Límites actuales

- La estructura incluye un CMS operativo de registros y vistas públicas enlazadas para programación, audio, artistas, videos, playlists, páginas y temas.
- La portada principal conserva su composición del diseño existente; el CMS actualiza su parrilla destacada y la paleta litúrgica. El carrusel, pie, menú, canal en vivo y textos de contacto aún son componentes fijos, no bloques reordenables tipo constructor visual.
- Los medios se gestionan por URL; aún no hay carga directa de archivos para toda la biblioteca ni editor visual de bloques.
