import { MatchCard } from "@/components/MatchCard";
import { formatDateSection, formatLongMatchDate } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches } from "@/lib/scoring";

export const revalidate = 60;

export default async function MatchesPage() {
  const matches = getMatches();
  const payload = await getFootballDataResults();

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
        <h1>Partidos</h1>
        <p>Horario español, grupo y reparto de quinielas.</p>
      </header>

      {payload.error ? (
        <div className="system-notice">La API no está devolviendo resultados ahora mismo.</div>
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
