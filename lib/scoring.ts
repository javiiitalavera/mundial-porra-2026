import matches from "@/data/matches.json";
import predictions from "@/data/predictions.json";
import players from "@/data/players.json";
import type { Match, MatchResult, Pick, Prediction, ScoredPrediction, Standing } from "./types";

const allMatches = matches as Match[];
const allPredictions = predictions as Prediction[];
const allPlayers = players as string[];

export type PlayerSummary = {
  player: string;
  played: number;
  correct: number;
  wrong: number;
  pending: number;
};

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
  return {};
}

export function getMatches(): Match[] {
  return allMatches;
}

export function getPlayers(): string[] {
  return allPlayers;
}

export function getPredictions(): Prediction[] {
  return allPredictions;
}

export function getUpcomingMatches(results: Record<string, MatchResult> = {}): Match[] {
  return allMatches
    .filter((match) => !results[match.id])
    .sort((a, b) => {
      const dateA = `${a.date ?? "9999-12-31"}-${a.order}`;
      const dateB = `${b.date ?? "9999-12-31"}-${b.order}`;
      return dateA.localeCompare(dateB);
    });
}

export function getNextMatch(results: Record<string, MatchResult> = {}): Match | undefined {
  return getUpcomingMatches(results)[0];
}

export function getScoredPredictions(results: Record<string, MatchResult> = {}): ScoredPrediction[] {
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
      isCorrect: actual ? prediction.pick === actual : null
    };
  });
}

export function getStandings(results: Record<string, MatchResult> = {}): Standing[] {
  const scored = getScoredPredictions(results);
  const table = new Map<string, Standing>();

  for (const player of allPlayers) {
    table.set(player, {
      player,
      points: 0,
      played: 0,
      correct: 0,
      pending: allMatches.length,
      percentage: 0
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
      percentage: row.played > 0 ? Math.round((row.correct / row.played) * 100) : 0
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return a.player.localeCompare(b.player, "es");
    });
}

export function getPlayerPredictions(
  player: string,
  results: Record<string, MatchResult> = {}
): ScoredPrediction[] {
  return getScoredPredictions(results)
    .filter((item) => item.player.toLowerCase() === decodeURIComponent(player).toLowerCase())
    .sort((a, b) => a.match.order - b.match.order);
}

export function getMatchPredictions(
  matchId: string,
  results: Record<string, MatchResult> = {}
): ScoredPrediction[] {
  return getScoredPredictions(results)
    .filter((item) => item.matchId === matchId)
    .sort((a, b) => a.player.localeCompare(b.player, "es"));
}

export function getPlayerSummary(
  player: string,
  results: Record<string, MatchResult> = {}
): PlayerSummary {
  const playerPredictions = getPlayerPredictions(player, results);
  const played = playerPredictions.filter((item) => item.actual).length;
  const correct = playerPredictions.filter((item) => item.isCorrect === true).length;
  const wrong = playerPredictions.filter((item) => item.isCorrect === false).length;

  return {
    player,
    played,
    correct,
    wrong,
    pending: allMatches.length - played
  };
}

export function getPlayerSummaries(results: Record<string, MatchResult> = {}): PlayerSummary[] {
  return allPlayers.map((player) => getPlayerSummary(player, results));
}
