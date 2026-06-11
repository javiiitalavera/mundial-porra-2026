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
        <summary className={actual === pick ? "pick-chip hit" : "pick-chip"}>
          <span className="pick-value">{pick}</span>
          <span>{names.length}</span>
        </summary>
        <div className="pick-tooltip">
          <div className="pick-tooltip-title">Han puesto {pick}</div>
          <div>{names.join(", ")}</div>
        </div>
      </details>
    );
  };

  return (
    <article className={featured ? "match-card featured-match" : "match-card"}>
      <div className="match-card-head">
        <div className="match-meta">
          <span>{formatMatchDate(match.date)}</span>
          <span>Grupo {match.group ?? "—"}</span>
        </div>
        <span className={result ? "status-pill done" : "status-pill"}>
          {statusLabel(result)}
        </span>
      </div>

      <div className="match-score-line">
        <div className="team-name">{match.home}</div>
        <div className={result ? "score done" : "score"}>{resultLabel(result)}</div>
        <div className="team-name right">{match.away}</div>
      </div>

      <div className="match-subline">
        <span className="primary-time">{match.timeEt ? formatSpainTimeFromEt(match.timeEt) : "Hora pendiente"}</span>
        {match.timeLocal ? <span>{match.timeLocal} local</span> : null}
        {match.city ? <span>{match.city}</span> : null}
      </div>

      <div className="pick-row" aria-label="Distribución de pronósticos">
        {renderPick("1")}
        {renderPick("X")}
        {renderPick("2")}
      </div>
    </article>
  );
}
