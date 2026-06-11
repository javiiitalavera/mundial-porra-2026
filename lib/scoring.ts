import matches from "@/data/matches.json";
import predictions from "@/data/predictions.json";
import players from "@/data/players.json";
import { manualResults } from "@/data/manualResults";
import type { Match, MatchResult, Pick, PlayerSummary, Prediction, ScoredPrediction, Standing } from "./types";

const allMatches = matches as Match[];
const allPredictions = predictions as Prediction[];
const allPlayers = players as string[];

export function signFromResult(result?: MatchResult): Pick | undefined {
  if (!result) return undefined;
  if (result.homeGoals > result.awayGoals) return "1";
  if (result.homeGoals < result.awayGoals) return "2";
  return "X";
}

export function scorePrediction(prediction: Prediction, result?: MatchResult): number {
  const actual = signFromResult(result);
  if (!actual) return 0;
  return prediction.pick === actual ? 1 : 0;
}

export function getResults(): Record<string, MatchResult> {
  return manualResults;
}

export function getMatches(): Match[] {
  return [...allMatches].sort((a, b) => {
    if (a.date !== b.date) return String(a.date).localeCompare(String(b.date));
    return (a.officialMatchNo ?? a.order) - (b.officialMatchNo ?? b.order);
  });
}

export function getPlayers(): string[] {
  return allPlayers;
}

export function getPredictions(): Prediction[] {
  return allPredictions;
}

export function getMatchesByDate(): Array<[string, Match[]]> {
  const grouped = new Map<string, Match[]>();

  for (const match of getMatches()) {
    const key = match.date ?? "Fecha pendiente";
    const list = grouped.get(key) ?? [];
    list.push(match);
    grouped.set(key, list);
  }

  return [...grouped.entries()];
}

export function getScoredPredictions(results = getResults()): ScoredPrediction[] {
  const matchById = new Map(allMatches.map((match) => [match.id, match]));

  return allPredictions.map((prediction) => {
    const match = matchById.get(prediction.matchId);
    if (!match) {
      throw new Error(`Missing match ${prediction.matchId}`);
    }

    const result = results[prediction.matchId];
    const actual = signFromResult(result);
    const points = scorePrediction(prediction, result);

    return {
      ...prediction,
      match,
      result,
      actual,
      points,
      isCorrect: actual ? prediction.pick === actual : null,
    };
  });
}

export function getStandings(results = getResults()): Standing[] {
  const scored = getScoredPredictions(results);
  const table = new Map<string, Standing>();

  for (const player of allPlayers) {
    table.set(player, {
      player,
      points: 0,
      played: 0,
      correct: 0,
      pending: allMatches.length,
      percentage: 0,
    });
  }

  for (const item of scored) {
    const row = table.get(item.player);
    if (!row) continue;

    if (item.actual) {
      row.played += 1;
      row.pending -= 1;
      row.points += item.points;
      if (item.isCorrect) row.correct += 1;
    }
  }

  return [...table.values()]
    .map((row) => ({
      ...row,
      percentage: row.played > 0 ? Math.round((row.correct / row.played) * 100) : 0,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return a.player.localeCompare(b.player, "es");
    });
}

export function getPlayerSummary(player: string, results = getResults()): PlayerSummary {
  const row = getStandings(results).find((item) => item.player === player) ?? {
    player,
    points: 0,
    played: 0,
    correct: 0,
    pending: allMatches.length,
    percentage: 0,
  };

  return {
    ...row,
    totalPredictions: allMatches.length,
    wrong: row.played - row.correct,
  };
}

export function getPlayerSummaries(results = getResults()): PlayerSummary[] {
  return allPlayers
    .map((player) => getPlayerSummary(player, results))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return a.player.localeCompare(b.player, "es");
    });
}

export function getPlayerPredictions(player: string, results = getResults()): ScoredPrediction[] {
  return getScoredPredictions(results)
    .filter((item) => item.player.toLowerCase() === decodeURIComponent(player).toLowerCase())
    .sort((a, b) => {
      if (a.match.date !== b.match.date) return String(a.match.date).localeCompare(String(b.match.date));
      return (a.match.officialMatchNo ?? a.match.order) - (b.match.officialMatchNo ?? b.match.order);
    });
}

export function getMatchPredictions(matchId: string, results = getResults()): ScoredPrediction[] {
  return getScoredPredictions(results)
    .filter((item) => item.matchId === matchId)
    .sort((a, b) => a.player.localeCompare(b.player, "es"));
}
