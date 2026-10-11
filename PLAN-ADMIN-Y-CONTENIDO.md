# Plan del sitio público y el panel de LVJ

## Lo que está en este export

El directorio contiene el sitio React/Vite independiente bajo `src/`. Ya están adaptados a LVJ el encabezado, pie, carrusel, marca visual, reproductor Luna y seis páginas públicas. Los componentes de presentación reutilizables son `Header`, `Footer`, `HeroCarousel`, `PageIntro`, `ArticlesGrid`, `RadioChannels` y `LunaPlayer`.

Este export **no contiene** la otra implementación descrita con página de inicio multilingüe, esquema de Supabase o panel. No hay cliente Supabase, `supabase/schema.sql`, archivo `.env`, autenticación, selector de idioma, `/admin`, ni rutas dinámicas `/c/:tipo`.

## Mapa del demo de Pro.Radio a LVJ

| Referencia del demo | Sección para LVJ | Reutilización prevista |
| --- | --- | --- |
| `/wp5/` | Portada de la radio | `HeroCarousel`, módulos de programación y actualidad; añadir eventos, podcast y locutores cuando existan datos reales. |
| `/wp5/blog-sidebar/` | Actualidad / reflexiones | `Blog.tsx`, lista filtrable y lateral de Evangelio y oración. |
| `/wp5/shows-schedule/` | Programación | `Schedule.tsx`, selector semanal y parrilla de muestra. |
| `/wp5/videos-elementor/` | Videos, predicaciones y catequesis | `Videos.tsx`, galería de temas católicos; actualmente abre búsquedas de YouTube. |
| `/wp5/charts-elementor/` | Alabanzas | `Charts.tsx`, lista y filtros por categoría; no presenta cifras de ranking inventadas. |
| `/wp5/contacts/` | Contacto y oración | `Contacts.tsx`, formulario que prepara el mensaje en WhatsApp. |

Se trasladaron patrones funcionales y visuales de las referencias al código disponible; no se copiaron recursos protegidos ni se pudo inspeccionar visualmente el contenido del dominio de demo. La estructura es apropiada para una radio católica: parrilla, reflexiones, música, video y contacto corresponden a necesidades de una emisora religiosa.

## Rutas actuales

Las rutas que ya registra `src/App.tsx` son `/`, `/blog-sidebar`, `/shows-schedule`, `/videos-elementor`, `/charts-elementor` y `/contacts`. No hay páginas de detalle o archivo genérico `/c/:tipo` todavía.

## Arquitectura sugerida para completar el administrador

1. Mantener `lovable-export` como frontend público desplegable en hosting estático, con fallback de rutas de React Router a `index.html`.
2. Crear el panel en Vercel, con rutas protegidas por Supabase Auth y autorización verificada en el servidor/DB.
3. Guardar artículos, programas, eventos, episodios, videos, alabanzas, locutores y ajustes de portada en Supabase. Añadir campos localizados solo si se confirma que LVJ necesita mantener varios idiomas; por ahora la interfaz pública está en español.
4. Configurar RLS por tabla y un rol/editor autorizado. Nunca incluir la `service_role` key en el sitio público o en código cliente; usar solo la clave publicable/anon con RLS.
5. Guardar imágenes en Supabase Storage y persistir metadatos/URLs en el CMS. La portada pública consume solo elementos publicados.
6. Conectar formularios y previsualización; mantener señales de radio y enlaces propios de LVJ fuera de contenido editable por defecto.

## Decisiones de producto pendientes de datos reales

- Parrilla semanal y nombres de programas (los actuales son ejemplos).
- Canal oficial de video/podcast y enlaces a canciones.
- Locutores, eventos y contactos/correo confirmados.
- Idiomas requeridos: este proyecto está en español. No debe afirmarse que existe un selector multilingüe.
- Credenciales del proyecto Supabase y configuración de Auth, Storage, redirect URLs y dominios de producción.

## Build

`npm run build` aún no se pudo completar en el entorno de trabajo: el addon SWC de Windows rechaza sus ubicaciones de caché por permisos heredados. En una terminal propia, probar con Node/npm instalados y ejecutar `npm.cmd install` seguido de `npm.cmd run build`. No publicar hasta que el build y las rutas directas hayan sido verificados.
