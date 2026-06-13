import type { MatchResult } from "@/lib/types";

/**
 * Fallback manual de seguridad.
 *
 * La fuente principal sigue siendo football-data. Estos resultados solo sirven
 * para que la clasificación no se vaya a cero si la API externa falla y no hay
 * caché persistente disponible.
 */
export const manualResults: Record<string, MatchResult> = {
  m01: { homeGoals: 2, awayGoals: 0, status: "FINISHED" },
  m02: { homeGoals: 2, awayGoals: 1, status: "FINISHED" },
  m03: { homeGoals: 1, awayGoals: 1, status: "FINISHED" },
  m04: { homeGoals: 4, awayGoals: 1, status: "FINISHED" }
};
