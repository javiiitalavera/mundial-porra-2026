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

export function formatSpainTimeFromEt(timeEt?: string): string {
  if (!timeEt) return "";

  const [rawHour, rawMinute = "00"] = timeEt.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return `${timeEt} España`;
  }

  // En junio/julio, la costa Este está en EDT (UTC-4) y España peninsular en CEST (UTC+2).
  // Por tanto, hora española = ET + 6 horas.
  const totalHours = hour + 6;
  const spainHour = totalHours % 24;
  const nextDay = totalHours >= 24;

  const formattedHour = String(spainHour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");

  return `${formattedHour}:${formattedMinute} España${nextDay ? " (+1)" : ""}`;
}
