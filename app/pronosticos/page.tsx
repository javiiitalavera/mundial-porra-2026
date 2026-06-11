import Link from "next/link";
import { normalizePlayerForUrl } from "@/lib/format";
import { getPlayerSummaries } from "@/lib/scoring";

export default function PredictionsPage() {
  const players = getPlayerSummaries();

  return (
    <section>
      <div className="page-header">
        <h1>Pronósticos</h1>
        <p>La quiniela individual de cada jugador.</p>
      </div>

      <div className="grid-list">
        {players.map((row) => (
          <Link key={row.player} href={`/pronosticos/${normalizePlayerForUrl(row.player)}`} className="player-tile">
            <span>{row.player}</span>
            <div className="pronostic-summary">
              {row.played === 0 ? (
                <>72 pendientes</>
              ) : (
                <>{row.correct} aciertos · {row.wrong} fallos</>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
