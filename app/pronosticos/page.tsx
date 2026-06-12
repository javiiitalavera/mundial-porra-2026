import Link from "next/link";
import { UpdateStatus } from "@/components/UpdateStatus";
import { normalizePlayerForUrl } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getPlayerSummaries } from "@/lib/scoring";

export const revalidate = 600;

export default async function PredictionsPage() {
  const payload = await getFootballDataResults();
  const players = getPlayerSummaries(payload.results);

  return (
    <section className="screen">
      <header className="page-header">
        <div className="section-label">{players.length} participantes</div>
        <h1>Quinielas</h1>
        <p>Consulta la quiniela de cada participante.</p>
        <UpdateStatus payload={payload} />
      </header>

      <div className="player-list">
        {players.map((row) => (
          <Link
            key={row.player}
            href={`/pronosticos/${normalizePlayerForUrl(row.player)}`}
            className="player-row"
          >
            <div className="avatar">{row.player.slice(0, 1)}</div>
            <div className="player-info">
              <div className="player-name">{row.player}</div>
              <div className="muted">
                {row.played === 0 ? "Ver quiniela" : `${row.correct} aciertos · ${row.wrong} fallos`}
              </div>
            </div>
            <div className="row-arrow" aria-hidden="true">›</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
