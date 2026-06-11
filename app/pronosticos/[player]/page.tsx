import Link from "next/link";
import { notFound } from "next/navigation";
import { formatMatchDate, resultLabel } from "@/lib/format";
import { getPlayerPredictions, getPlayerSummary, getPlayers, getResults } from "@/lib/scoring";

export function generateStaticParams() {
  return getPlayers().map((player) => ({ player }));
}

export default async function PlayerPredictionPage({
  params,
}: {
  params: Promise<{ player: string }>;
}) {
  const { player: rawPlayer } = await params;
  const player = decodeURIComponent(rawPlayer);

  const predictions = getPlayerPredictions(player);
  if (predictions.length === 0) notFound();

  const summary = getPlayerSummary(player);
  const results = getResults();

  return (
    <section>
      <div className="page-header">
        <Link href="/pronosticos" className="back">← Pronósticos</Link>
        <h1>{player}</h1>
        <p>
          {summary.played === 0
            ? "Quiniela completa"
            : `${summary.correct} aciertos · ${summary.wrong} fallos · ${summary.pending} pendientes`}
        </p>
      </div>

      <div className="stack">
        {predictions.map((item) => (
          <article key={item.matchId} className="prediction-card">
            <div>
              <div className="meta-row">
                <span>{formatMatchDate(item.match.date)}</span>
                <span className="group-chip">Grupo {item.match.group ?? "—"}</span>
              </div>
              <div className="match-label">{item.match.label}</div>
              <div className="muted">Resultado: {resultLabel(results[item.matchId])}</div>
            </div>
            <div className="prediction-right">
              <span className="chip">{item.pick}</span>
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
