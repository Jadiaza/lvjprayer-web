# AGENTS.md — Módulo Santo Rosario (LVJPRAYER)

## Propósito
Este documento guía a cualquier agente de IA o desarrollador que trabaje en el módulo **Santo Rosario** de la aplicación La Voz de Jesús (LVJPRAYER).

## Alcance del módulo
El módulo implementa la experiencia completa de rezar el Santo Rosario católico dentro de la app existente. No requiere backend ni Supabase; toda la persistencia es local (`localStorage` / `IndexedDB` opcional).

## Arquitectura

```
src/modules/rosary/
├── components/        # UI reutilizable del rosario
├── hooks/             # Lógica de estado y side effects
├── mocks/             # Datos estáticos: oraciones, misterios, arte sacro
├── pages/             # 18 pantallas del flujo
├── services/          # Lógica de negocio, persistencia, audio
├── types/             # Contratos TypeScript compartidos
└── utils/             # Helpers puros (generación del rosario, día del misterio, rutas)
```

## Flujo de pantallas (18)

1. Entrada desde home → `/rosario`
2. Portada del Rosario → `/rosario`
3. Selección de modalidad → `/rosario/modalidad`
4. Intención → `/rosario/intencion`
5. Selección de misterios/alcance → `/rosario/seleccionar-misterios`
6. Configuración → `/rosario/configuracion`
7-8. Rosario digital interactivo → `/rosario/digital`
9-10. Rosario físico (modo manual) → `/rosario/fisico`
11-13. Rosario por audio → `/rosario/audio`
11. Solo los misterios → `/rosario/misterios`
12. Sesión pendiente (gestionada desde home)
13. Ajustes de audio → dentro de `/rosario/audio`
14. Descargas offline → `/rosario/descargas`
15. Error de conexión (fallback offline)
16. Finalización → dentro del flujo interactivo
17. Diario espiritual → `/rosario/diario`
18. Información del módulo → `/rosario/informacion`

## Identidad visual
- Paleta: navy profundo (`--navy-deep`, `#05070a`), dorado (`--gold`, `hsl(43 74% 66%)`), texto blanco/gris claro.
- Tipografía: `font-display` para títulos, `Inter` para cuerpo.
- Componentes base: `glass`, `gold-border`, `bg-gradient-gold`.
- El arte sacro de los misterios está en `src/modules/rosary/mocks/mysteryArt.ts`.

## Reglas de implementación

### Datos
- Los misterios y oraciones viven en `mocks/` y se consideran fuente de verdad local.
- `buildRosary.ts` genera la estructura completa de cuentas/secciones a partir de un grupo y alcance.
- `rosaryTodayService` calcula el misterio del día; si falla la API, usa fallback offline basado en día de la semana.

### Estado
- `useRosarySession` es el cerebro del rezo: controla índice de cuenta, progreso, haptics, finalización y reinicio.
- `useRosaryFlow` guarda la configuración transitoria del usuario durante el flujo (grupo, modalidad, alcance, intención).
- `useRosaryPreferences` persiste preferencias locales (tamaño de texto, contraste, voz, volúmenes, etc.).

### Audio
- `rosaryAudioService` es un singleton que gestiona el elemento `<audio>`.
- Los audios oficiales aún no están publicados; las URLs pueden ser `null` y la UI lo indica.

### Seguridad y contenido
- Las oraciones se renderizan siempre como texto plano; nunca se inyectan como HTML.
- Las intenciones personales son privadas y solo se persisten si el usuario lo autoriza (`allowStore`).

## Integración en la app principal
- Las rutas se registran en `src/App.tsx`.
- Los enlaces de acceso rápido están en `src/components/lvdj/QuickAccess.tsx` y `src/components/lvdj/BottomNav.tsx`.
- No se debe editar `src/integrations/supabase/client.ts` ni tocar esquemas de auth.

## Cómo extender
- Para agregar un nuevo modo: crear página en `pages/`, hook si es necesario, y registrar ruta.
- Para cambiar textos de oraciones: editar `src/modules/rosary/mocks/prayers.ts`.
- Para agregar arte oficial: reemplazar imágenes en `src/assets/rosary/` y actualizar `mysteryArt.ts`.

## Notas para agentes
- No agregar backend ni Supabase para este módulo salvo que el usuario lo solicite explícitamente.
- Mantener la identidad visual dorada/navy existente; no introducir nuevos colores sin justificación.
- Las meditaciones y audios oficiales se publicarán progresivamente; la UI debe soportar contenido provisional.
