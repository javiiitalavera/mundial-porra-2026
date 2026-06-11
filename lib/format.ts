import type { MatchResult, Pick } from "./types";

export function pickLabel(pick?: Pick): string {
  if (!pick) return "—";
  if (pick === "1") return "1";
  if (pick === "2") return "2";
  return "X";
}

export function resultLabel(result?: MatchResult): string {
  if (!result) return "—";
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
    month: "short"
  }).format(parsed);
}

export function formatLongMatchDate(date?: string): string {
  if (!date) return "Fecha pendiente";

  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(parsed);
}

export function formatDateSection(date?: string): string {
  if (!date) return "Fecha pendiente";

  const today = new Date();
  const parsed = new Date(`${date}T12:00:00`);

  const todayKey = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);

  if (date === todayKey) return "Hoy";
  if (date === tomorrowKey) return "Mañana";

  return formatLongMatchDate(date);
}

export function formatSpainTimeFromEt(timeEt?: string): string {
  if (!timeEt) return "";

  const [rawHour, rawMinute = "00"] = timeEt.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return `${timeEt} España`;
  }

  // Junio/julio: Eastern Time = UTC-4 y España peninsular = UTC+2.
  const totalHours = hour + 6;
  const spainHour = totalHours % 24;
  const nextDay = totalHours >= 24;

  const formattedHour = String(spainHour).padStart(2, "0");
  const formattedMinute = String(minute).padStart(2, "0");

  return `${formattedHour}:${formattedMinute} España${nextDay ? " (+1)" : ""}`;
}
