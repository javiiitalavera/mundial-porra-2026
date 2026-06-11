import { MatchCard } from "@/components/MatchCard";
import { formatDateSection, formatLongMatchDate } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches } from "@/lib/scoring";

export const revalidate = 600;

export default async function MatchesPage() {
  const matches = getMatches();
  const payload = await getFootballDataResults();
  const played = Object.keys(payload.results).length;

  const grouped = matches.reduce((acc, match) => {
    const key = match.date ?? "Fecha pendiente";
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <section className="screen v8-screen">
      <header className="page-header v8-page-header">
        <div className="section-label">Calendario</div>
        <h1>Todos los partidos</h1>
        <p>{matches.length} partidos · {played} puntuados</p>
      </header>

      {payload.error ? (
        <div className="system-notice">Actualizando resultados...</div>
      ) : null}

      <div className="date-stack">
        {Object.entries(grouped).map(([date, dayMatches]) => (
          <section key={date} className="date-section">
            <div className="date-title">
              <h2>{formatDateSection(date)}</h2>
              <span>{formatLongMatchDate(date)}</span>
            </div>
            <div className="match-stack">
              {dayMatches.map((match) => (
                <MatchCard key={match.id} match={match} result={payload.results[match.id]} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
