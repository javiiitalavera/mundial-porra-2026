import { formatMatchDate, formatSpainTimeFromEt, resultLabel } from "@/lib/format";
import { getMatchPredictions, signFromResult } from "@/lib/scoring";
import type { Match, MatchResult, Pick } from "@/lib/types";

export function MatchCard({
  match,
  result,
}: {
  match: Match;
  result?: MatchResult;
}) {
  const actual = signFromResult(result);
  const predictions = getMatchPredictions(match.id);

  const grouped = predictions.reduce(
    (acc, item) => {
      acc[item.pick].push(item.player);
      return acc;
    },
    { "1": [], X: [], "2": [] } as Record<Pick, string[]>
  );

  const renderPick = (pick: Pick) => {
    const names = grouped[pick];

    return (
      <details className="pick-details">
        <summary className={actual === pick ? "chip hit pick-summary" : "chip pick-summary"}>
          {pick} · {names.length}
        </summary>
        <div className="pick-tooltip">
          <div className="pick-tooltip-title">Han puesto {pick}</div>
          <div>{names.join(", ")}</div>
        </div>
      </details>
    );
  };

  return (
    <article className="match-card">
      <div className="match-top">
        <div>
          <div className="meta-row">
            <span>{formatMatchDate(match.date)}</span>
            <span className="group-chip">Grupo {match.group ?? "—"}</span>
          </div>
          <div className="match-label">{match.home} - {match.away}</div>
          <div className="muted match-time-row">
            {match.city ? <span>{match.city}</span> : null}
            {match.timeLocal ? <span>{match.timeLocal} local</span> : null}
            {match.timeEt ? <span>{formatSpainTimeFromEt(match.timeEt)}</span> : null}
          </div>
        </div>
        <div className={result ? "score done" : "score"}>{resultLabel(result)}</div>
      </div>

      <div className="pick-row">
        {renderPick("1")}
        {renderPick("X")}
        {renderPick("2")}
      </div>
    </article>
  );
}
