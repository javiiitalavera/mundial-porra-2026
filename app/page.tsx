import { MatchCard } from "@/components/MatchCard";
import { StandingCard } from "@/components/StandingCard";
import { formatStartsIn } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches, getNextMatch, getStandings } from "@/lib/scoring";

export const revalidate = 600;

function leaderText(standings: ReturnType<typeof getStandings>, played: number): string {
  if (played === 0) return "Todos empiezan igual";
  const top = standings[0]?.points ?? 0;
  const tied = standings.filter((row) => row.points === top).length;
  return tied > 1 ? "Empate en cabeza" : "Líder provisional";
}

const podiumMedals = ["🥇", "🥈", "🥉"];

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
      </header>

      {payload.error ? (
        <div className="system-notice">Actualizando resultados...</div>
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
          <h2>Todo listo.</h2>
          <p>La clasificación empezará a moverse cuando termine el primer partido.</p>
        </section>
      ) : null}

      <section className="block">
        <div className="block-heading">
          <h2>Clasificación</h2>
          <span>1 punto por acertar</span>
        </div>

        <div className="leader-note">{leaderText(standings, played)}</div>

        <div className="podium">
          {podium.map((row, index) => (
            <a key={row.player} href={`/pronosticos/${encodeURIComponent(row.player)}`} className={`podium-card rank-${index + 1}`}>
              <div className="podium-top">{podiumMedals[index]}</div>
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
