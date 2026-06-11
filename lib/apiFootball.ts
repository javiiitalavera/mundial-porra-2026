import matchesJson from "@/data/matches.json";
import type { Match, MatchResult } from "@/lib/types";

const API_URL = "https://v3.football.api-sports.io/fixtures";
const WORLD_CUP_LEAGUE_ID = "1";
const WORLD_CUP_SEASON = "2026";

type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string | null;
      long: string | null;
      elapsed: number | null;
    };
  };
  league: {
    round?: string;
  };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

type ApiFootballResponse = {
  response?: ApiFootballFixture[];
  errors?: unknown;
};

export type ApiResultsPayload = {
  results: Record<string, MatchResult>;
  updatedAt: string;
  source: "api-football";
  error?: string;
  matchedFixtures: number;
};

const matches = matchesJson as Match[];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/&/g, "and")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

const TEAM_ALIASES: Record<string, string[]> = {
  "México": ["Mexico"],
  "Sudáfrica": ["South Africa"],
  "Corea del Sur": ["South Korea", "Korea Republic", "Korea Rep"],
  "República Checa": ["Czech Republic", "Czechia"],
  "Canadá": ["Canada"],
  "Bosnia y Herzegovina": ["Bosnia and Herzegovina", "Bosnia-Herzegovina", "Bosnia"],
  "Estados Unidos": ["United States", "USA", "United States of America"],
  "Paraguay": ["Paraguay"],
  "Catar": ["Qatar"],
  "Suiza": ["Switzerland"],
  "Brasil": ["Brazil"],
  "Marruecos": ["Morocco"],
  "Haití": ["Haiti"],
  "Escocia": ["Scotland"],
  "Australia": ["Australia"],
  "Turquía": ["Turkey", "Türkiye", "Turkiye"],
  "Alemania": ["Germany"],
  "Curazao": ["Curacao", "Curaçao"],
  "Países Bajos": ["Netherlands", "Holland"],
  "Japón": ["Japan"],
  "Costa de Marfil": ["Ivory Coast", "Cote d'Ivoire", "Côte d'Ivoire"],
  "Ecuador": ["Ecuador"],
  "Suecia": ["Sweden"],
  "Túnez": ["Tunisia"],
  "España": ["Spain"],
  "Cabo Verde": ["Cape Verde", "Cabo Verde"],
  "Bélgica": ["Belgium"],
  "Egipto": ["Egypt"],
  "Arabia Saudí": ["Saudi Arabia"],
  "Uruguay": ["Uruguay"],
  "Irán": ["Iran"],
  "Nueva Zelanda": ["New Zealand"],
  "Francia": ["France"],
  "Senegal": ["Senegal"],
  "Irak": ["Iraq"],
  "Noruega": ["Norway"],
  "Argentina": ["Argentina"],
  "Argelia": ["Algeria"],
  "Austria": ["Austria"],
  "Jordania": ["Jordan"],
  "Portugal": ["Portugal"],
  "RD Congo": ["DR Congo", "Congo DR", "Congo Democratic Republic", "Democratic Republic of the Congo"],
  "Inglaterra": ["England"],
  "Croacia": ["Croatia"],
  "Ghana": ["Ghana"],
  "Panamá": ["Panama"],
  "Uzbekistán": ["Uzbekistan"],
  "Colombia": ["Colombia"]
};

function aliasesFor(team: string): string[] {
  return [team, ...(TEAM_ALIASES[team] ?? [])].map(normalize);
}

function sameDate(apiDateTime: string, matchDate?: string): boolean {
  if (!matchDate) return true;
  return apiDateTime.slice(0, 10) === matchDate;
}

function fixtureStatus(short: string | null): MatchResult["status"] {
  if (!short) return "SCHEDULED";

  if (["FT", "AET", "PEN"].includes(short)) return "FINISHED";
  if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(short)) return "LIVE";
  return "SCHEDULED";
}

function matchFixture(match: Match, fixture: ApiFootballFixture): "direct" | "reverse" | null {
  if (!sameDate(fixture.fixture.date, match.date)) return null;

  const matchHomeAliases = aliasesFor(match.home);
  const matchAwayAliases = aliasesFor(match.away);
  const apiHome = normalize(fixture.teams.home.name);
  const apiAway = normalize(fixture.teams.away.name);

  if (matchHomeAliases.includes(apiHome) && matchAwayAliases.includes(apiAway)) {
    return "direct";
  }

  if (matchHomeAliases.includes(apiAway) && matchAwayAliases.includes(apiHome)) {
    return "reverse";
  }

  return null;
}

export async function getApiFootballResults(): Promise<ApiResultsPayload> {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return {
      results: {},
      updatedAt: new Date().toISOString(),
      source: "api-football",
      matchedFixtures: 0,
      error: "Falta API_FOOTBALL_KEY en las variables de entorno."
    };
  }

  const url = `${API_URL}?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}`;

  try {
    const response = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey
      },
      next: {
        revalidate: 60
      }
    });

    if (!response.ok) {
      return {
        results: {},
        updatedAt: new Date().toISOString(),
        source: "api-football",
        matchedFixtures: 0,
        error: `API-Football respondió con HTTP ${response.status}.`
      };
    }

    const data = (await response.json()) as ApiFootballResponse;
    const fixtures = data.response ?? [];
    const results: Record<string, MatchResult> = {};
    let matchedFixtures = 0;

    for (const match of matches) {
      const found = fixtures
        .map((fixture) => ({ fixture, direction: matchFixture(match, fixture) }))
        .find((item) => item.direction !== null);

      if (!found) continue;

      matchedFixtures += 1;

      const { fixture, direction } = found;
      const homeGoals = direction === "direct" ? fixture.goals.home : fixture.goals.away;
      const awayGoals = direction === "direct" ? fixture.goals.away : fixture.goals.home;

      if (typeof homeGoals !== "number" || typeof awayGoals !== "number") {
        continue;
      }

      results[match.id] = {
        homeGoals,
        awayGoals,
        status: fixtureStatus(fixture.fixture.status.short),
        minute: fixture.fixture.status.elapsed ?? undefined,
        updatedAt: new Date().toISOString()
      };
    }

    return {
      results,
      updatedAt: new Date().toISOString(),
      source: "api-football",
      matchedFixtures
    };
  } catch (error) {
    return {
      results: {},
      updatedAt: new Date().toISOString(),
      source: "api-football",
      matchedFixtures: 0,
      error: error instanceof Error ? error.message : "Error desconocido consultando API-Football."
    };
  }
}
