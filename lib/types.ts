export type Pick = "1" | "X" | "2";

export type Match = {
  id: string;
  home: string;
  away: string;
  label: string;
  order: number;
  officialMatchNo?: number;
  group?: string;
  date?: string;
  timeEt?: string;
  timeLocal?: string;
  venue?: string;
  city?: string;
};

export type Prediction = {
  matchId: string;
  player: string;
  pick: Pick;
};

export type MatchResult = {
  homeGoals: number;
  awayGoals: number;
  status?: "SCHEDULED" | "LIVE" | "FINISHED";
  minute?: number;
  updatedAt?: string;
};

export type ScoredPrediction = Prediction & {
  match: Match;
  result?: MatchResult;
  actual?: Pick;
  points: number;
  isCorrect: boolean | null;
};

export type Standing = {
  player: string;
  points: number;
  played: number;
  correct: number;
  pending: number;
  percentage: number;
};

export type PlayerSummary = Standing & {
  totalPredictions: number;
  wrong: number;
};
