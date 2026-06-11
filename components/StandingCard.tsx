import Link from "next/link";
import type { Standing } from "@/lib/types";
import { normalizePlayerForUrl } from "@/lib/format";

export function StandingCard({ row, position }: { row: Standing; position: number }) {
  return (
    <Link href={`/jugador/${normalizePlayerForUrl(row.player)}`} className="standing-card">
      <div className="rank">{position}</div>
      <div className="standing-main">
        <div className="standing-name">{row.player}</div>
        <div className="muted">
          {row.played === 0
            ? "Sin partidos puntuados"
            : `${row.correct}/${row.played} aciertos · ${row.percentage}%`}
        </div>
      </div>
      <div className="points">{row.points}</div>
    </Link>
  );
}
