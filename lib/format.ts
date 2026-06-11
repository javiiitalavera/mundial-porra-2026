import type { MatchResult, Pick } from "./types";

export function pickLabel(pick?: Pick): string {
  if (!pick) return "—";
  if (pick === "1") return "1";
  if (pick === "2") return "2";
  return "X";
}

export function resultLabel(result?: MatchResult): string {
  if (!result) return "Pendiente";
  return `${result.homeGoals}-${result.awayGoals}`;
}

export function normalizePlayerForUrl(player: string): string {
  return encodeURIComponent(player);
}
