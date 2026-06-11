import { MatchCard } from "@/components/MatchCard";
import { formatLongMatchDate } from "@/lib/format";
import { getMatchesByDate, getResults } from "@/lib/scoring";

export default function MatchesPage() {
  const groupedMatches = getMatchesByDate();
  const results = getResults();

  return (
    <section>
      <div className="page-header">
        <h1>Partidos</h1>
        <p>Calendario de la primera fase, con grupo, fecha y pronósticos 1/X/2.</p>
      </div>

      <div className="stack">
        {groupedMatches.map(([date, matches]) => (
          <section key={date} className="date-section">
            <h2 className="date-heading">{formatLongMatchDate(date)}</h2>
            <div className="stack">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} result={results[match.id]} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
