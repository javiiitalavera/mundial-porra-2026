import { MatchCard } from "@/components/MatchCard";
import { getMatches, getResults } from "@/lib/scoring";

export default function MatchesPage() {
  const matches = getMatches();
  const results = getResults();

  return (
    <section>
      <div className="page-header">
        <h1>Partidos</h1>
        <p>Distribución de pronósticos y resultado real cuando esté cargado.</p>
      </div>

      <div className="stack">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} result={results[match.id]} />
        ))}
      </div>
    </section>
  );
}
