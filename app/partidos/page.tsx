import { MatchCard } from "@/components/MatchCard";
import { formatLongMatchDate } from "@/lib/format";
import { getApiFootballResults } from "@/lib/apiFootball";
import { getMatches } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const matches = getMatches();
  const payload = await getApiFootballResults();

  const grouped = matches.reduce((acc, match) => {
    const key = match.date ?? "Fecha pendiente";
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  return (
    <section>
      <div className="page-header">
        <h1>Partidos</h1>
        <p>
          Fecha, grupo, horario local, horario español y pronósticos de la porra.
          {payload.error ? " La API todavía no está devolviendo resultados." : ""}
        </p>
      </div>

      <div className="date-stack">
        {Object.entries(grouped).map(([date, dayMatches]) => (
          <section key={date} className="date-section">
            <h2>{formatLongMatchDate(date)}</h2>
            <div className="stack">
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
