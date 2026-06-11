import { MatchCard } from "@/components/MatchCard";
import { StandingCard } from "@/components/StandingCard";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches, getNextMatch, getStandings } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const payload = await getFootballDataResults();
  const standings = getStandings(payload.results);
  const played = Object.keys(payload.results).length;
  const total = getMatches().length;
  const nextMatch = getNextMatch(payload.results);
  const leaders = standings.slice(0, 3);
  const rest = standings.slice(3);

  return (
    <section className="screen">
      <div className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow">Mundial 2026</div>
          <h1>Porra entre amigos</h1>
          <p>{played}/{total} partidos puntuados · actualización automática</p>
        </div>
        <div className="hero-trophy" aria-hidden="true">🏆</div>
      </div>

      {payload.error ? (
        <div className="notice">
          La API no ha respondido correctamente. La app seguirá intentando actualizarse.
        </div>
      ) : null}

      {nextMatch ? (
        <section className="next-block">
          <div className="section-title tight">
            <h2>Próximo partido</h2>
            <span>pulsa 1/X/2 para ver nombres</span>
          </div>
          <MatchCard match={nextMatch} result={payload.results[nextMatch.id]} featured />
        </section>
      ) : null}

      {played === 0 ? (
        <div className="start-state">
          <div>
            <h2>La porra empieza en breve</h2>
            <p>Todos parten de cero. En cuanto termine el primer partido, el ranking se moverá solo.</p>
          </div>
        </div>
      ) : null}

      <section className="leaderboard">
        <div className="section-title">
          <h2>Ranking</h2>
          <span>1 punto por acierto</span>
        </div>

        <div className="podium">
          {leaders.map((row, index) => (
            <div key={row.player} className={`podium-card pos-${index + 1}`}>
              <div className="podium-rank">#{index + 1}</div>
              <div className="podium-name">{row.player}</div>
              <div className="podium-points">{row.points}</div>
              <div className="muted">
                {row.played === 0 ? "Salida" : `${row.correct}/${row.played} · ${row.percentage}%`}
              </div>
            </div>
          ))}
        </div>

        <div className="stack">
          {rest.map((row, index) => (
            <StandingCard key={row.player} row={row} position={index + 4} compact />
          ))}
        </div>
      </section>
    </section>
  );
}
