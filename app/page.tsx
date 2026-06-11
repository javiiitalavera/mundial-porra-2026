import { MatchCard } from "@/components/MatchCard";
import { StandingCard } from "@/components/StandingCard";
import { formatStartsIn } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches, getNextMatch, getStandings } from "@/lib/scoring";

export const revalidate = 60;

export default async function HomePage() {
  const payload = await getFootballDataResults();
  const standings = getStandings(payload.results);
  const played = Object.keys(payload.results).length;
  const total = getMatches().length;
  const nextMatch = getNextMatch(payload.results);
  const podium = standings.slice(0, 3);
  const rest = standings.slice(3);

  return (
    <section className="screen">
      <header className="app-header hero-sport">
        <div>
          <div className="section-label">Ranking en directo</div>
          <h1>🏆 Mundial 2026</h1>
          {nextMatch ? (
            <div className="hero-next">
              <div>{nextMatch.home} - {nextMatch.away}</div>
              <span>{formatStartsIn(nextMatch.date, nextMatch.timeEt)}</span>
            </div>
          ) : (
            <p>{played}/{total} partidos puntuados</p>
          )}
        </div>
        <div className="live-badge">Live</div>
      </header>

      {payload.error ? (
        <div className="system-notice">La API no ha respondido correctamente. Reintentará en la próxima carga.</div>
      ) : null}

      {nextMatch ? (
        <section className="block">
          <div className="block-heading">
            <h2>Próximo partido</h2>
            <span>{played}/{total} puntuados</span>
          </div>
          <MatchCard match={nextMatch} result={payload.results[nextMatch.id]} featured />
        </section>
      ) : null}

      {played === 0 ? (
        <section className="quiet-card">
          <h2>Todo preparado</h2>
          <p>La clasificación empezará a moverse en cuanto finalice el primer partido.</p>
        </section>
      ) : null}

      <section className="block">
        <div className="block-heading">
          <h2>Ranking</h2>
          <span>1 punto por acierto</span>
        </div>

        <div className="podium">
          {podium.map((row, index) => (
            <a key={row.player} href={`/pronosticos/${encodeURIComponent(row.player)}`} className={`podium-card rank-${index + 1}`}>
              <div className="podium-top">#{index + 1}</div>
              <div className="podium-name">{row.player}</div>
              <div className="podium-score">{row.points}</div>
              <div className="muted">{row.played === 0 ? "Salida" : `${row.correct}/${row.played} · ${row.percentage}%`}</div>
            </a>
          ))}
        </div>

        <div className="standing-list">
          {rest.map((row, index) => (
            <StandingCard key={row.player} row={row} position={index + 4} compact />
          ))}
        </div>
      </section>
    </section>
  );
}
