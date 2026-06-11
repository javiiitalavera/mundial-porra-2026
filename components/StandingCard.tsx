import Link from "next/link";
import type { Standing } from "@/lib/types";
import { normalizePlayerForUrl } from "@/lib/format";

export function StandingCard({
  row,
  position,
  compact = false
}: {
  row: Standing;
  position: number;
  compact?: boolean;
}) {
  const subtitle =
    row.played === 0
      ? "Esperando el primer resultado"
      : `${row.correct}/${row.played} aciertos · ${row.percentage}%`;

  return (
    <Link
      href={`/pronosticos/${normalizePlayerForUrl(row.player)}`}
      className={compact ? "standing-card compact" : "standing-card"}
    >
      <div className="rank">{position}</div>
      <div className="standing-main">
        <div className="standing-name">{row.player}</div>
        <div className="muted">{subtitle}</div>
      </div>
      <div className="points-block">
        <div className="points">{row.points}</div>
        <div className="points-label">pts</div>
      </div>
    </Link>
  );
}
