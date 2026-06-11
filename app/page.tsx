import { StandingCard } from "@/components/StandingCard";
import { getResults, getStandings } from "@/lib/scoring";

export default function HomePage() {
  const standings = getStandings();
  const results = getResults();
  const played = Object.keys(results).length;

  return (
    <section>
      <div className="hero">
        <div className="kicker">Mundial 2026</div>
        <h1>Porra primera fase</h1>
        <p>{played}/72 partidos puntuados</p>
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
