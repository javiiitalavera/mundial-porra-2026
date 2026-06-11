import Link from "next/link";
import type { Standing } from "@/lib/types";
import { normalizePlayerForUrl } from "@/lib/format";

const medals = ["🥇", "🥈", "🥉"];

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
      ? "Sin partidos puntuados"
      : `${row.correct}/${row.played} aciertos · ${row.percentage}%`;

  const rank = medals[position - 1] ?? position;

  return (
    <Link
      href={`/pronosticos/${normalizePlayerForUrl(row.player)}`}
      className={compact ? "standing-row compact v8-standing-row" : "standing-row v8-standing-row"}
    >
      <div className="standing-position">{rank}</div>
      <div className="standing-person">
        <div className="standing-name">{row.player}</div>
        <div className="muted">{subtitle}</div>
      </div>
      <div className="standing-points">
        <strong>{row.points}</strong>
        <span>pts</span>
      </div>
    </Link>
  );
}
