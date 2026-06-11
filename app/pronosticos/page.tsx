import Link from "next/link";
import { normalizePlayerForUrl } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getPlayerSummaries } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function PredictionsPage() {
  const payload = await getFootballDataResults();
  const players = getPlayerSummaries(payload.results);

  return (
    <section className="screen">
      <div className="page-header">
        <div className="eyebrow">Quinielas</div>
        <h1>Pronósticos</h1>
        <p>Revisa qué ha puesto cada jugador.</p>
      </div>

      <div className="players-grid">
        {players.map((row) => (
          <Link
            key={row.player}
            href={`/pronosticos/${normalizePlayerForUrl(row.player)}`}
            className="player-card"
          >
            <div className="player-avatar">{row.player.slice(0, 1)}</div>
            <div>
              <div className="player-name">{row.player}</div>
              <div className="muted">
                {row.played === 0 ? "Ver quiniela" : `${row.correct} aciertos · ${row.wrong} fallos`}
              </div>
            </div>
            <div className="chevron">›</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
