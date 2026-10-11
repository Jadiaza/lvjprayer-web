# Sitio de La Voz de Jesús

Sitio público creado a partir del export de Lovable, con identidad LVJ, textos en español y contenido católico de muestra.

## Rutas incluidas

- `/` — Inicio
- `/blog-sidebar` — Actualidad y reflexiones
- `/shows-schedule` — Programación semanal
- `/videos-elementor` — Videos y formación
- `/charts-elementor` — Alabanzas
- `/contacts` — Contacto

## Noticias LVJ

Consulta NEWS-SETUP.md para el esquema de Supabase, las variables de Vercel, el panel editorial y la bandeja RSS.

## Ejecución local

Requiere Node.js y npm. En esta carpeta:

```sh
npm install
npm run dev
```

Para generar el sitio para hosting estático:

```sh
npm run build:hosting
```

El hosting público usa `npm run build:hosting` y se genera en `dist-hosting/`. Vercel usa `npm run build:admin` y se genera en `dist-admin/`.

## Contenido y servicios

- El reproductor Luna reutiliza la señal de Zeno de LVJ, carga sin reproducción automática y usa el emblema local en `public/images/lvj-emblema.png`.
- Los artículos, videos, cantos y horarios son ejemplos católicos. Deben sustituirse por publicaciones y parrilla confirmadas por LVJ.
- Los enlaces de video y música llevan a búsquedas de YouTube; no afirman que sean piezas oficiales de la emisora.
- El formulario de contacto prepara el mensaje en WhatsApp y requiere que la persona confirme su envío.
- El módulo de noticias incluye panel editorial en `/admin`, lectura pública y conexión opcional a Supabase. Puede desplegarse por separado del sitio y reproductor existentes en la raíz del proyecto.
