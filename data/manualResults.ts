import type { MatchResult } from "@/lib/types";

/**
 * Resultados manuales.
 *
 * Cuando un partido termine, añade aquí:
 *
 * m01: { homeGoals: 2, awayGoals: 1 }
 * m02: { homeGoals: 0, awayGoals: 0 }
 *
 * La app recalcula la clasificación automáticamente.
 */
export const manualResults: Record<string, MatchResult> = {
  // m01: { homeGoals: 2, awayGoals: 1 },
};
