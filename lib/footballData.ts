import { Redis } from "@upstash/redis";
import matchesJson from "@/data/matches.json";
import type { Match, MatchResult } from "@/lib/types";

const API_URL = "https://api.football-data.org/v4/competitions/WC/matches";
const SEASON = "2026";

const CACHE_SECONDS = 600;
const CACHE_MS = CACHE_SECONDS * 1000;
const REDIS_KEY = "mundial-2026:last-good-results";

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  group?: string | null;
  homeTeam: {
    name: string;
    shortName?: string;
    tla?: string;
  };
  awayTeam: {
    name: string;
    shortName?: string;
    tla?: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime?: {
      home: number | null;
      away: number | null;
    };
  };
};

type FootballDataResponse = {
  matches?: FootballDataMatch[];
  message?: string;
  errorCode?: number;
};

export type ApiResultsPayload = {
  results: Record<string, MatchResult>;
  updatedAt: string;
  source: "football-data";
  error?: string;
  matchedFixtures: number;
  rawMatches: number;
  stale?: boolean;
  cache?: "fresh" | "memory" | "redis" | "empty";
};

const matches = matchesJson as Match[];

let memoryCache: { payload: ApiResultsPayload; expiresAt: number } | null = null;
let lastGoodPayload: ApiResultsPayload | null = null;
let inFlight: Promise<ApiResultsPayload> | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return new Redis({ url, token });
}

function normalize(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

const TEAM_ALIASES: Record<string, string[]> = {
  "México": ["Mexico", "MEX"],
  "Sudáfrica": ["South Africa", "RSA"],
  "Corea del Sur": ["South Korea", "Korea Republic", "KoreaRepublic", "KOR"],
  "República Checa": ["Czech Republic", "Czechia", "CZE"],
  "Canadá": ["Canada", "CAN"],
  "Bosnia y Herzegovina": ["Bosnia and Herzegovina", "Bosnia-Herzegovina", "Bosnia-H.", "Bosnia", "BIH"],
  "Estados Unidos": ["United States", "USA", "United States of America"],
  "Paraguay": ["Paraguay", "PAR"],
  "Catar": ["Qatar", "QAT"],
  "Suiza": ["Switzerland", "SUI"],
  "Brasil": ["Brazil", "BRA"],
  "Marruecos": ["Morocco", "MAR"],
  "Haití": ["Haiti", "HAI"],
  "Escocia": ["Scotland", "SCO"],
  "Australia": ["Australia", "AUS"],
  "Turquía": ["Turkey", "Türkiye", "Turkiye", "TUR"],
  "Alemania": ["Germany", "GER"],
  "Curazao": ["Curacao", "Curaçao", "CUW"],
  "Países Bajos": ["Netherlands", "Holland", "NED"],
  "Japón": ["Japan", "JPN"],
  "Costa de Marfil": ["Ivory Coast", "Cote d'Ivoire", "Côte d'Ivoire", "CIV"],
  "Ecuador": ["Ecuador", "ECU"],
  "Suecia": ["Sweden", "SWE"],
  "Túnez": ["Tunisia", "TUN"],
  "España": ["Spain", "ESP"],
  "Cabo Verde": ["Cape Verde", "Cabo Verde", "CPV"],
  "Bélgica": ["Belgium", "BEL"],
  "Egipto": ["Egypt", "EGY"],
  "Arabia Saudí": ["Saudi Arabia", "KSA"],
  "Uruguay": ["Uruguay", "URU"],
  "Irán": ["Iran", "IRN"],
  "Nueva Zelanda": ["New Zealand", "NZL"],
  "Francia": ["France", "FRA"],
  "Senegal": ["Senegal", "SEN"],
  "Irak": ["Iraq", "IRQ"],
  "Noruega": ["Norway", "NOR"],
  "Argentina": ["Argentina", "ARG"],
  "Argelia": ["Algeria", "ALG"],
  "Austria": ["Austria", "AUT"],
  "Jordania": ["Jordan", "JOR"],
  "Portugal": ["Portugal", "POR"],
  "RD Congo": ["DR Congo", "Congo DR", "Congo Democratic Republic", "Democratic Republic of the Congo", "COD"],
  "Inglaterra": ["England", "ENG"],
  "Croacia": ["Croatia", "CRO"],
  "Ghana": ["Ghana", "GHA"],
  "Panamá": ["Panama", "PAN"],
  "Uzbekistán": ["Uzbekistan", "UZB"],
  "Colombia": ["Colombia", "COL"]
};

function aliasesFor(team: string): string[] {
  return [team, ...(TEAM_ALIASES[team] ?? [])].map(normalize);
}

function apiTeamNames(team: FootballDataMatch["homeTeam"]): string[] {
  return [team.name, team.shortName, team.tla].filter(Boolean).map((value) => normalize(value));
}

function sameDate(apiDateTime: string, matchDate?: string): boolean {
  if (!matchDate) return true;
  return apiDateTime.slice(0, 10) === matchDate;
}

function matchStatus(status: string): MatchResult["status"] {
  if (["FINISHED", "AWARDED"].includes(status)) return "FINISHED";
  if (["IN_PLAY", "PAUSED"].includes(status)) return "LIVE";
  return "SCHEDULED";
}

function intersects(a: string[], b: string[]): boolean {
  return a.some((item) => b.includes(item));
}

function matchFixture(match: Match, fixture: FootballDataMatch): "direct" | "reverse" | null {
  const dateLooksClose = sameDate(fixture.utcDate, match.date);
  const matchHomeAliases = aliasesFor(match.home);
  const matchAwayAliases = aliasesFor(match.away);
  const apiHomeAliases = apiTeamNames(fixture.homeTeam);
  const apiAwayAliases = apiTeamNames(fixture.awayTeam);

  const direct = intersects(matchHomeAliases, apiHomeAliases) && intersects(matchAwayAliases, apiAwayAliases);
  const reverse = intersects(matchHomeAliases, apiAwayAliases) && intersects(matchAwayAliases, apiHomeAliases);

  if (direct && dateLooksClose) return "direct";
  if (reverse && dateLooksClose) return "reverse";
  if (direct) return "direct";
  if (reverse) return "reverse";

  return null;
}

function safeEmptyPayload(error: string): ApiResultsPayload {
  return {
    results: {},
    updatedAt: new Date().toISOString(),
    source: "football-data",
    matchedFixtures: 0,
    rawMatches: 0,
    error,
    cache: "empty"
  };
}

async function readPersistentCache(error?: string): Promise<ApiResultsPayload | null> {
  if (lastGoodPayload) {
    return {
      ...lastGoodPayload,
      stale: true,
      cache: "memory",
      error: error ? `Mostrando última actualización disponible. ${error}` : undefined
    };
  }

  const redis = getRedis();
  if (!redis) return null;

  try {
    const cached = await redis.get<ApiResultsPayload>(REDIS_KEY);
    if (!cached) return null;

    lastGoodPayload = cached;

    return {
      ...cached,
      stale: true,
      cache: "redis",
      error: error ? `Mostrando última actualización guardada. ${error}` : undefined
    };
  } catch {
    return null;
  }
}

async function writePersistentCache(payload: ApiResultsPayload): Promise<void> {
  lastGoodPayload = payload;

  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.set(REDIS_KEY, payload);
  } catch {
    // No rompemos la app si Redis falla.
  }
}

async function fetchFootballDataResults(): Promise<ApiResultsPayload> {
  const token = process.env.FOOTBALL_DATA_TOKEN;

  if (!token) {
    const cached = await readPersistentCache("Falta FOOTBALL_DATA_TOKEN en las variables de entorno.");
    return cached ?? safeEmptyPayload("Falta FOOTBALL_DATA_TOKEN en las variables de entorno.");
  }

  const url = `${API_URL}?season=${SEASON}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": token
      },
      next: {
        revalidate: CACHE_SECONDS
      }
    });

    const data = (await response.json()) as FootballDataResponse;

    if (!response.ok) {
      const message = data.message ?? `football-data respondió con HTTP ${response.status}.`;
      const cached = await readPersistentCache(message);
      return cached ?? safeEmptyPayload(message);
    }

    const apiMatches = data.matches ?? [];
    const results: Record<string, MatchResult> = {};
    let matchedFixtures = 0;

    for (const match of matches) {
      const found = apiMatches
        .map((fixture) => ({ fixture, direction: matchFixture(match, fixture) }))
        .find((item) => item.direction !== null);

      if (!found) continue;

      matchedFixtures += 1;

      const { fixture, direction } = found;
      const rawHome = direction === "direct" ? fixture.score.fullTime.home : fixture.score.fullTime.away;
      const rawAway = direction === "direct" ? fixture.score.fullTime.away : fixture.score.fullTime.home;

      if (typeof rawHome !== "number" || typeof rawAway !== "number") continue;

      results[match.id] = {
        homeGoals: rawHome,
        awayGoals: rawAway,
        status: matchStatus(fixture.status),
        updatedAt: new Date().toISOString()
      };
    }

    const payload: ApiResultsPayload = {
      results,
      updatedAt: new Date().toISOString(),
      source: "football-data",
      matchedFixtures,
      rawMatches: apiMatches.length,
      cache: "fresh"
    };

    // Guardamos también cuando todavía no hay resultados, porque confirma 72 emparejados.
    await writePersistentCache(payload);

    return payload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido consultando football-data.";
    const cached = await readPersistentCache(message);
    return cached ?? safeEmptyPayload(message);
  }
}

export async function getFootballDataResults(): Promise<ApiResultsPayload> {
  const now = Date.now();

  if (memoryCache && memoryCache.expiresAt > now) {
    return {
      ...memoryCache.payload,
      cache: memoryCache.payload.cache ?? "memory"
    };
  }

  if (!inFlight) {
    inFlight = fetchFootballDataResults().finally(() => {
      inFlight = null;
    });
  }

  const payload = await inFlight;

  memoryCache = {
    payload,
    expiresAt: now + CACHE_MS
  };

  return payload;
}
