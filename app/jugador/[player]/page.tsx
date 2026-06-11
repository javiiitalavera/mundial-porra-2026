import Link from "next/link";
import { notFound } from "next/navigation";
import { resultLabel } from "@/lib/format";
import { getPlayerPredictions, getPlayers, getResults, getStandings } from "@/lib/scoring";

export function generateStaticParams() {
  return getPlayers().map((player) => ({ player: encodeURIComponent(player) }));
}

export default function PlayerPage({ params }: { params: { player: string } }) {
  const player = decodeURIComponent(params.player);
  const predictions = getPlayerPredictions(player);
  if (predictions.length === 0) notFound();

  const row = getStandings().find((item) => item.player === player);
  const results = getResults();

  return (
    <section>
      <div className="page-header">
        <Link href="/jugadores" className="back">← Jugadores</Link>
        <h1>{player}</h1>
        <p>{row?.points ?? 0} puntos · {row?.correct ?? 0}/{row?.played ?? 0} aciertos</p>
      </div>

      <div className="stack">
        {predictions.map((item) => (
          <article key={item.matchId} className="prediction-card">
            <div>
              <div className="match-label">{item.match.label}</div>
              <div className="muted">Resultado: {resultLabel(results[item.matchId])}</div>
            </div>
            <div className="prediction-right">
              <span className="chip">Pronóstico {item.pick}</span>
              {item.isCorrect === null ? (
                <span className="pill pending">Pendiente</span>
              ) : item.isCorrect ? (
                <span className="pill ok">+1</span>
              ) : (
                <span className="pill ko">0</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
