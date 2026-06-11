import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateSection, resultLabel } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getPlayerPredictions, getPlayerSummary, getPlayers } from "@/lib/scoring";

export const revalidate = 60;

export function generateStaticParams() {
  return getPlayers().map((player) => ({ player }));
}

export default async function PlayerPredictionPage({
  params
}: {
  params: Promise<{ player: string }>;
}) {
  const { player: rawPlayer } = await params;
  const player = decodeURIComponent(rawPlayer);

  const payload = await getFootballDataResults();
  const predictions = getPlayerPredictions(player, payload.results);
  if (predictions.length === 0) notFound();

  const summary = getPlayerSummary(player, payload.results);

  const grouped = predictions.reduce((acc, item) => {
    const key = item.match.date ?? "Fecha pendiente";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof predictions>);

  return (
    <section className="screen">
      <header className="page-header">
        <Link href="/pronosticos" className="back-link">← Quinielas</Link>
        <div className="section-label">Jugador</div>
        <h1>{player}</h1>
        <p>
          {summary.played === 0
            ? "Quiniela completa"
            : `${summary.correct} aciertos · ${summary.wrong} fallos · ${summary.pending} pendientes`}
        </p>
      </header>

      <div className="date-stack">
        {Object.entries(grouped).map(([date, items]) => (
          <section key={date} className="date-section">
            <div className="date-title slim">
              <h2>{formatDateSection(date)}</h2>
            </div>

            <div className="prediction-stack">
              {items.map((item) => (
                <article key={item.matchId} className="prediction-row">
                  <div>
                    <div className="fixture-name">{item.match.label}</div>
                    <div className="muted">Grupo {item.match.group ?? "—"}</div>
                  </div>
                  <div className="prediction-right">
                    <span className="pick-badge">{item.pick}</span>
                    {item.isCorrect === null ? null : item.isCorrect ? (
                      <span className="result-pill ok">+1</span>
                    ) : (
                      <span className="result-pill ko">0</span>
                    )}
                    {item.actual ? <span className="muted score-mini">{resultLabel(payload.results[item.matchId])}</span> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
