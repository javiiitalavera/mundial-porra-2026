import Link from "next/link";
import { normalizePlayerForUrl } from "@/lib/format";
import { getApiFootballResults } from "@/lib/apiFootball";
import { getPlayerSummaries } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function PredictionsPage() {
  const payload = await getApiFootballResults();
  const players = getPlayerSummaries(payload.results);

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
                <>Ver quiniela</>
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
