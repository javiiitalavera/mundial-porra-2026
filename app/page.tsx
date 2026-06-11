import Link from "next/link";
import { MatchCard } from "@/components/MatchCard";
import { StandingCard } from "@/components/StandingCard";
import { formatStartsIn, resultLabel } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches, getNextMatch, getStandings } from "@/lib/scoring";

export const revalidate = 600;

function getLastFinishedMatch(results: Awaited<ReturnType<typeof getFootballDataResults>>["results"]) {
  const matches = getMatches();

  return matches
    .filter((match) => results[match.id]?.status === "FINISHED")
    .sort((a, b) => {
      const aTime = new Date(`${a.date ?? "1900-01-01"}T00:00:00`).getTime();
      const bTime = new Date(`${b.date ?? "1900-01-01"}T00:00:00`).getTime();
      return bTime - aTime;
    })[0];
}

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
  const matches = getMatches();
  const total = matches.length;
  const nextMatch = getNextMatch(payload.results);
  const lastMatch = getLastFinishedMatch(payload.results);
  const podium = standings.slice(0, 3);
  const rest = standings.slice(3);
  const heroMatch = lastMatch ?? nextMatch;
  const heroResult = heroMatch ? payload.results[heroMatch.id] : undefined;

  return (
    <section className="screen v8-screen">
      <header className="v8-hero">
        <div className="v8-hero-top">
          <div className="v8-brand">🏆 Mundial 2026</div>
          <div className="v8-mini-stats">
            <span>{standings.length} participantes</span>
            <span>{total} partidos</span>
          </div>
        </div>

        {heroMatch ? (
          <div className="v8-hero-match">
            <div className="v8-kicker">{lastMatch ? "Último resultado" : "Partido inaugural"}</div>
            <h1>{heroMatch.home} - {heroMatch.away}</h1>
            <p>
              {lastMatch && heroResult
                ? resultLabel(heroResult)
                : formatStartsIn(heroMatch.date, heroMatch.timeEt)}
            </p>
          </div>
        ) : (
          <div className="v8-hero-match">
            <div className="v8-kicker">Mundial completado</div>
            <h1>Porra terminada</h1>
            <p>{played}/{total} partidos puntuados</p>
          </div>
        )}

        <div className="v8-hero-actions">
          <Link href="/partidos">Ver calendario</Link>
          <Link href="/pronosticos">Ver quinielas</Link>
        </div>
      </header>

      {payload.error ? (
        <div className="system-notice">Actualizando resultados...</div>
      ) : null}

      {nextMatch ? (
        <section className="block v8-block">
          <div className="block-heading">
            <h2>Próximo partido</h2>
            <span>{played}/{total} puntuados</span>
          </div>
          <MatchCard match={nextMatch} result={payload.results[nextMatch.id]} featured />
        </section>
      ) : null}

      {played === 0 ? (
        <section className="quiet-card v8-empty">
          <h2>Todo listo.</h2>
          <p>La clasificación empezará a moverse cuando termine el primer partido.</p>
        </section>
      ) : null}

      <section className="block v8-block">
        <div className="block-heading">
          <h2>Clasificación</h2>
          <span>1 punto por acertar</span>
        </div>

        <div className="leader-note">{leaderText(standings, played)}</div>

        <div className="podium v8-podium">
          {podium.map((row, index) => (
            <Link
              key={row.player}
              href={`/pronosticos/${encodeURIComponent(row.player)}`}
              className={`podium-card v8-podium-card rank-${index + 1}`}
            >
              <div className="podium-top">{podiumMedals[index]}</div>
              <div className="podium-name">{row.player}</div>
              <div className="podium-score">{row.points}</div>
              <div className="muted">
                {row.played === 0 ? "Salida" : `${row.correct}/${row.played} · ${row.percentage}%`}
              </div>
            </Link>
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
