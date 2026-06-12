import { StandingCard } from "@/components/StandingCard";
import { UpdateStatus } from "@/components/UpdateStatus";
import { formatDateSection, resultLabel } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches, getStandings } from "@/lib/scoring";

export const revalidate = 600;

type ResultsPayload = Awaited<ReturnType<typeof getFootballDataResults>>;

function getLastFinishedMatch(results: ResultsPayload["results"]) {
  return getMatches()
    .filter((match) => results[match.id]?.status === "FINISHED")
    .sort((a, b) => {
      const dateA = `${a.date ?? ""}-${String(a.id).padStart(3, "0")}`;
      const dateB = `${b.date ?? ""}-${String(b.id).padStart(3, "0")}`;
      return dateB.localeCompare(dateA);
    })[0];
}

export default async function HomePage() {
  const payload = await getFootballDataResults();
  const standings = getStandings(payload.results);
  const played = Object.keys(payload.results).length;
  const total = getMatches().length;
  const lastMatch = getLastFinishedMatch(payload.results);
  const lastResult = lastMatch ? payload.results[lastMatch.id] : undefined;

  return (
    <section className="screen final-screen">
      <header className="page-header final-header">
        <div className="section-label">🏆 Mundial 2026</div>
        <h1>Clasificación</h1>
        <p>{played}/{total} partidos puntuados</p>
        <UpdateStatus payload={payload} />
      </header>

      {payload.error ? (
        <div className="system-notice">Actualizando resultados...</div>
      ) : null}

      {lastMatch && lastResult ? (
        <section className="last-result-card final-last-result">
          <div>
            <span className="section-label">Último resultado</span>
            <h2>{lastMatch.home} - {lastMatch.away}</h2>
            <p>{formatDateSection(lastMatch.date)}</p>
          </div>
          <strong>{resultLabel(lastResult)}</strong>
        </section>
      ) : null}

      <section className="final-ranking-list">
        {standings.map((row, index) => (
          <StandingCard key={row.player} row={row} position={index + 1} compact />
        ))}
      </section>
    </section>
  );
}
