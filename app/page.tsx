import { StandingCard } from "@/components/StandingCard";
import { getApiFootballResults } from "@/lib/apiFootball";
import { getMatches, getStandings } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const payload = await getApiFootballResults();
  const standings = getStandings(payload.results);
  const played = Object.keys(payload.results).length;
  const total = getMatches().length;

  return (
    <section>
      <div className="hero">
        <div className="kicker">Mundial 2026</div>
        <h1>Porra primera fase</h1>
        <p>
          {played}/{total} partidos puntuados
          {payload.error ? " · API pendiente" : ""}
        </p>
      </div>

      <div className="section-title">
        <h2>Clasificación</h2>
        <span>1 punto por signo acertado</span>
      </div>

      <div className="stack">
        {standings.map((row, index) => (
          <StandingCard key={row.player} row={row} position={index + 1} />
        ))}
      </div>
    </section>
  );
}
