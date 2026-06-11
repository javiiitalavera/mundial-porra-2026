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

export function formatMatchDate(date?: string): string {
  if (!date) return "Fecha pendiente";

  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(parsed);
}

export function formatLongMatchDate(date?: string): string {
  if (!date) return "Fecha pendiente";

  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(parsed);
}
