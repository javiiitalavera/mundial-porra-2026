import { StandingCard } from "@/components/StandingCard";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches, getStandings } from "@/lib/scoring";

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
  const podium = standings.slice(0, 3);
  const rest = standings.slice(3);

  return (
    <section className="screen">
      <header className="page-header classification-header">
        <div className="section-label">🏆 Mundial 2026</div>
        <h1>Clasificación</h1>
        <p>{played}/{total} partidos puntuados · 1 punto por acertar</p>
      </header>

      {payload.error ? (
        <div className="system-notice">Actualizando resultados...</div>
      ) : null}

      <section className="block classification-only-block">
        <div className="leader-note">{leaderText(standings, played)}</div>

        <div className="podium">
          {podium.map((row, index) => (
            <a
              key={row.player}
              href={`/pronosticos/${encodeURIComponent(row.player)}`}
              className={`podium-card rank-${index + 1}`}
            >
              <div className="podium-top">{podiumMedals[index]}</div>
              <div className="podium-name">{row.player}</div>
              <div className="podium-score">{row.points}</div>
              <div className="muted">
                {row.played === 0 ? "Salida" : `${row.correct}/${row.played} · ${row.percentage}%`}
              </div>
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
