# Administración completa de La Voz de Jesús

## Arquitectura

- **Vercel:** sirve el panel editorial y sus rutas administrativas. Al abrir la raíz del proyecto Vercel, redirige a `/admin`.
- **Supabase:** Auth, roles `admin/editor`, políticas RLS y base de datos para publicaciones del CMS.
- **Hosting compartido:** conserva el sitio estático y el reproductor Luna. Las páginas leen contenido publicado desde el endpoint PHP.
- **Fuentes editoriales:** RSS/Atom aporta titulares, extractos y enlaces al buzón para revisión. Nunca se publica contenido externo automáticamente.

## Módulos del panel

- **Noticias y fuentes RSS:** revisión de titulares, conversión a borrador propio, edición, imagen, publicación, archivo y gestión de fuentes autorizadas.
- **Carrusel de portada:** titular, etiqueta, descripción, imagen, botón, orden y estado.
- **Programación:** título, resumen, categoría, presentador, día, horario, audio, portada y publicación.
- **Audios y episodios:** podcast, oración y reflexión con URL de audio y arte.
- **Artistas:** perfil, biografía, imagen, redes y sitio web.
- **Videos:** enlace y miniatura para predicaciones y catequesis.
- **Playlists:** colecciones con pistas descritas mediante JSON.
- **Páginas:** texto y resumen para rutas públicas `/pagina/:slug`.
- **Biblioteca de medios:** catálogo de recursos por URL. No almacena binarios.
- **Tiempos litúrgicos:** programa colores e imagen por fecha; se usa la zona horaria de Bogotá.
- **Ajustes del sitio:** marca, menú, pie de página y enlaces sociales.

### Claves de ajustes del sitio

Usa una fila por clave en `site_settings`; el campo `value` contiene JSON válido y `is_public` debe estar activo para que el hosting lo reciba:

| Clave | Ejemplo de valor JSON |
|---|---|
| `brand_name` | `"LA VOZ DE JESÚS"` |
| `brand_tagline` | `"RADIO CATÓLICA · COLOMBIA"` |
| `logo_url` | `"https://lavozdejesus.co/lvjplayer/images/lvj-emblema.png"` |
| `footer_description` | `"Música, oración, formación y esperanza."` |
| `navigation` | `[{"label":"Inicio","href":"/"},{"label":"Noticias","href":"/noticias"},{"label":"Programación","href":"/shows-schedule"},{"label":"Audios","href":"/audios"},{"label":"Videos","href":"/videos-elementor"},{"label":"Alabanzas","href":"/charts-elementor"},{"label":"Artistas","href":"/artistas"},{"label":"Contacto","href":"/contacts"}]` |
| `social_links` | `{"facebook":"https://facebook.com/...","instagram":"https://instagram.com/...","whatsapp":"https://wa.me/..."}` |

Los valores de texto también son JSON: incluye comillas. Para navegación solo se aceptan rutas internas que empiezan con `/`; los enlaces externos del pie deben usar HTTPS.

## Despliegue

1. El esquema `supabase/cms-schema.sql` ya fue aplicado al proyecto Supabase `zcfnquusvkrkqjeusmly`. No lo vuelvas a ejecutar salvo que haya una migración nueva.
2. Desplegar esta rama en Vercel como Preview. Revisar allí inicio de sesión, permisos y publicación antes de llevarla a producción.
3. Copiar `hosting-api/contenido.php` a `/public_html/api/contenido.php`. Debe convivir con `news-bootstrap.php` y leer la configuración privada existente.
4. **No reemplazar** `/public_html/api/bootstrap.php` de LVJ Prayer ni subir `config.local.php), claves o secretos a GitHub.
5. Reconstruir el sitio con `npm run build:hosting` y subir el contenido de `dist-hosting` a `/public_html/lvjplayer/`. Esto conserva la portada Luna fuera de la aplicación editorial.
6. Para poner el CMS en el dominio público de Vercel, revisar y fusionar el PR a `main`; el hosting público requiere su propio build actualizado.

## Variables

En Vercel, para el panel: `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. Para la ingesta programada: `SUPABASE_URL`, `SUPABASE_SECRET_KEY` y `CRON_SECRET`, solo del lado servidor.

En el hosting, el endpoint usa `SUPABASE_URL` y `SUPABASE_ANON_KEY` de `/public_html/api/config.local.php`; la clave publicable puede usarse desde PHP, nunca la service role.

## Alcance actual

El panel gestiona contenido y ajustes comunes sin exponer privilegios de Supabase. Los reproductores y el contenido audiovisual se integran por URL; no se cargan archivos pesados en el panel. La composición de secciones de la portada, el reproductor, formularios de contacto y constructor de bloques no son todavía editables/reordenables como WordPress.
