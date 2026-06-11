import Link from "next/link";
import { getStandings } from "@/lib/scoring";
import { normalizePlayerForUrl } from "@/lib/format";

export default function PlayersPage() {
  const standings = getStandings();

  return (
    <section>
      <div className="page-header">
        <h1>Jugadores</h1>
        <p>Detalle individual de todos los pronósticos.</p>
      </div>

      <div className="grid-list">
        {standings.map((row) => (
          <Link key={row.player} href={`/jugador/${normalizePlayerForUrl(row.player)}`} className="player-tile">
            <span>{row.player}</span>
            <strong>{row.points}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
