import type { Match, MatchResult } from "@/lib/types";

const ET_TO_UTC_OFFSET_HOURS = 4;
const LIVE_WINDOW_BEFORE_MS = 15 * 60 * 1000;
const LIVE_WINDOW_AFTER_MS = 150 * 60 * 1000;

function parseIsoDate(date?: string) {
  if (!date) return null;
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3])
  };
}

function parseEtTime(timeEt?: string) {
  if (!timeEt) return null;

  const value = timeEt.trim().toUpperCase();

  const ampm = value.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = Number(ampm[2] ?? "0");

    if (ampm[3] === "PM" && hour !== 12) hour += 12;
    if (ampm[3] === "AM" && hour === 12) hour = 0;

    return { hour, minute };
  }

  const twentyFour = value.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFour) {
    return {
      hour: Number(twentyFour[1]),
      minute: Number(twentyFour[2])
    };
  }

  return null;
}

export function getMatchStartDate(match: Match): Date | null {
  const date = parseIsoDate(match.date);
  const time = parseEtTime(match.timeEt);

  if (!date || !time) return null;

  return new Date(
    Date.UTC(
      date.year,
      date.month - 1,
      date.day,
      time.hour + ET_TO_UTC_OFFSET_HOURS,
      time.minute,
      0
    )
  );
}

export function getCurrentOrNextMatch(
  matches: Match[],
  results: Record<string, MatchResult>
): Match | undefined {
  const apiLive = matches.find((match) => results[match.id]?.status === "LIVE");
  if (apiLive) return apiLive;

  const now = Date.now();

  const currentByTime = matches.find((match) => {
    const result = results[match.id];
    if (result?.status === "FINISHED") return false;

    const start = getMatchStartDate(match);
    if (!start) return false;

    const startMs = start.getTime();
    return now >= startMs - LIVE_WINDOW_BEFORE_MS && now <= startMs + LIVE_WINDOW_AFTER_MS;
  });

  if (currentByTime) return currentByTime;

  const upcoming = matches.find((match) => {
    const result = results[match.id];
    if (result?.status === "FINISHED") return false;

    const start = getMatchStartDate(match);
    if (!start) return true;

    return start.getTime() > now;
  });

  return upcoming ?? matches.find((match) => results[match.id]?.status !== "FINISHED");
}
