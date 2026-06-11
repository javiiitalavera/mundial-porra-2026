# Porra Mundial 2026

App móvil en Next.js para la porra del Mundial 2026.

Datos importados desde el PDF: `MUNDIAL 2026 PRONÓSTICOS.pdf`.

## Qué incluye

- 16 jugadores.
- 72 partidos de la primera fase.
- 1.152 pronósticos.
- Clasificación automática.
- Vista de partidos.
- Vista individual por jugador.
- Pantalla inicial para introducir resultados manuales editando `data/manualResults.ts`.
- Ruta preparada para conectar una API real: `/api/live-scores`.

## Cómo arrancar en local

```bash
npm install
npm run dev
```

Abre:

```bash
http://localhost:3000
```

## Cómo subir a Vercel

1. Sube esta carpeta a GitHub.
2. En Vercel, pulsa **New Project**.
3. Importa el repositorio.
4. Framework: **Next.js**.
5. Deploy.

## Cómo meter resultados ahora mismo

Edita `data/manualResults.ts`.

Ejemplo:

```ts
export const manualResults = {
  m01: { homeGoals: 2, awayGoals: 1 },
  m02: { homeGoals: 0, awayGoals: 0 },
};
```

La app recalcula todo automáticamente.

## Próximos pasos recomendados

1. Añadir formulario protegido con PIN para meter resultados desde el móvil.
2. Conectar API real de resultados del Mundial.
3. Añadir caché para no depender de la API en cada visita.
4. Añadir jornada actual, rachas, farolillo rojo y compartir ranking por WhatsApp.
