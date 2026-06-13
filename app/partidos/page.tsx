import { MatchCard } from "@/components/MatchCard";
import { UpdateStatus } from "@/components/UpdateStatus";
import { formatDateSection, formatLongMatchDate } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getCurrentOrNextMatch } from "@/lib/matchTiming";
import { getMatches } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const matches = getMatches();
  const payload = await getFootballDataResults();
  const played = Object.keys(payload.results).length;
  const targetMatch = getCurrentOrNextMatch(matches, payload.results);

  const grouped = matches.reduce((acc, match) => {
    const key = match.date ?? "Fecha pendiente";
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <section className="screen">
      <header className="page-header">
        <div className="section-label">Calendario</div>
        <h1>Calendario</h1>
        <p>{matches.length} partidos · {played} puntuados</p>

        <div className="header-actions">
          <UpdateStatus payload={payload} />

          {targetMatch ? (
            <a className="jump-button" href={`#partido-${targetMatch.id}`}>
              Ver hoy
            </a>
          ) : null}
        </div>
      </header>

      <div className="date-stack">
        {Object.entries(grouped).map(([date, dayMatches]) => (
          <section key={date} className="date-section">
            <div className="date-title">
              <h2>{formatDateSection(date)}</h2>
              <span>{formatLongMatchDate(date)}</span>
            </div>

            <div className="match-stack">
              {dayMatches.map((match) => (
                <div
                  key={match.id}
                  id={`partido-${match.id}`}
                  className={targetMatch?.id === match.id ? "match-anchor next-match-anchor" : "match-anchor"}
                >
                  <MatchCard match={match} result={payload.results[match.id]} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
