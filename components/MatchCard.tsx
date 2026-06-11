import { getMatchPredictions, signFromResult } from "@/lib/scoring";
import { resultLabel } from "@/lib/format";
import type { Match, MatchResult } from "@/lib/types";

export function MatchCard({
  match,
  result,
}: {
  match: Match;
  result?: MatchResult;
}) {
  const actual = signFromResult(result);
  const predictions = getMatchPredictions(match.id);

  const counts = predictions.reduce(
    (acc, item) => {
      acc[item.pick] += 1;
      return acc;
    },
    { "1": 0, X: 0, "2": 0 } as Record<"1" | "X" | "2", number>
  );

  return (
    <article className="match-card">
      <div className="match-top">
        <div>
          <div className="match-label">{match.home} - {match.away}</div>
          <div className="muted">Partido {match.order}</div>
        </div>
        <div className={result ? "score done" : "score"}>{resultLabel(result)}</div>
      </div>

      <div className="pick-row">
        <span className={actual === "1" ? "chip hit" : "chip"}>1 · {counts["1"]}</span>
        <span className={actual === "X" ? "chip hit" : "chip"}>X · {counts.X}</span>
        <span className={actual === "2" ? "chip hit" : "chip"}>2 · {counts["2"]}</span>
      </div>
    </article>
  );
}
