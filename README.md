# Mundial 2026 — Porra entre amigos

App móvil en Next.js para seguir una porra privada del Mundial 2026.

## Qué incluye

- 16 participantes.
- 72 partidos de fase de grupos.
- 1.152 pronósticos importados desde el PDF original.
- Clasificación automática.
- Calendario completo con salto al partido actual.
- Quiniela individual por participante.
- Resultados automáticos mediante football-data.org.
- Caché de resultados para no depender de la API en cada visita.
- Soporte opcional de Redis/Upstash para conservar el último dato válido si la API falla.

## Variables de entorno

En Vercel:

```bash
FOOTBALL_DATA_TOKEN
```

Opcional si se usa Redis/Upstash:

```bash
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir:

```bash
http://localhost:3000
```

## Build

```bash
npm run build
```

## Deploy

```bash
git add .
git commit -m "..."
git push
npx vercel --prod
```

## Resultados

La ruta de resultados es:

```bash
/api/results
```

Devuelve un payload con:

- `results`: resultados ya disponibles.
- `updatedAt`: hora de última actualización.
- `matchedFixtures`: partidos emparejados con la API.
- `rawMatches`: partidos recibidos desde la API.
- `cache`: origen del dato.
- `stale`: si se están usando últimos datos disponibles por fallo temporal.

La interfaz no muestra conceptos técnicos al usuario. Solo muestra una pastilla de estado: actualizado, últimos datos disponibles o esperando actualización.

## Estructura

```bash
app/
  page.tsx                 # Clasificación
  partidos/page.tsx        # Calendario
  pronosticos/page.tsx     # Lista de quinielas
  pronosticos/[player]/    # Quiniela individual
  instalar/page.tsx        # Instalación móvil
  api/results/route.ts     # API interna

components/
  BottomNav.tsx
  MatchCard.tsx
  StandingCard.tsx
  UpdateStatus.tsx

lib/
  footballData.ts
  scoring.ts
  format.ts
  lastUpdated.ts
  types.ts

data/
  matches.json
  players.json
  predictions.json
```

## Notas

La API externa puede ir con retraso en el plan gratuito. Para una porra privada es suficiente: la app actualiza de forma conservadora y evita quemar el límite de llamadas.
