import { formatMatchDate, formatSpainTimeFromEt, resultLabel } from "@/lib/format";
import { getMatchPredictions, signFromResult } from "@/lib/scoring";
import type { Match, MatchResult, Pick } from "@/lib/types";

function statusLabel(result?: MatchResult): string {
  if (!result) return "Pendiente";
  if (result.status === "LIVE") return result.minute ? `En juego · ${result.minute}'` : "En juego";
  if (result.status === "FINISHED") return "Finalizado";
  return "Pendiente";
}

export function MatchCard({
  match,
  result,
  featured = false
}: {
  match: Match;
  result?: MatchResult;
  featured?: boolean;
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
        <summary className={actual === pick ? "pick-button is-hit" : "pick-button"}>
          <span>{pick}</span>
          <strong>{names.length}</strong>
        </summary>
        <div className="pick-panel">
          <div className="pick-panel-title">Han apostado por el {pick}</div>
          <div className="pick-names">{names.join(", ")}</div>
        </div>
      </details>
    );
  };

  return (
    <article className={featured ? "match-card featured" : "match-card"}>
      <div className="match-topline">
        <div className="match-kicker">
          <span>{formatMatchDate(match.date)}</span>
          <span>Grupo {match.group ?? "—"}</span>
        </div>
        <span className={result ? "match-state is-done" : "match-state"}>
          {statusLabel(result)}
        </span>
      </div>

      <div className="match-main">
        <div className="team home">{match.home}</div>
        <div className={result ? "score is-done" : "score"}>{resultLabel(result)}</div>
        <div className="team away">{match.away}</div>
      </div>

      <div className="match-time">
        <span>{match.timeEt ? formatSpainTimeFromEt(match.timeEt) : "Hora pendiente"}</span>
        {match.timeLocal ? <span>{match.timeLocal} local</span> : null}
        {match.city ? <span>{match.city}</span> : null}
      </div>

      <div className="pick-row">
        {renderPick("1")}
        {renderPick("X")}
        {renderPick("2")}
      </div>
    </article>
  );
}
