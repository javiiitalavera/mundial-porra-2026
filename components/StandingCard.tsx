import Link from "next/link";
import type { Standing } from "@/lib/types";
import { normalizePlayerForUrl } from "@/lib/format";

const medals = ["🥇", "🥈", "🥉"];

function PositionDelta({ delta }: { delta?: number }) {
  if (typeof delta !== "number") return null;

  if (delta > 0) {
    return <span className="position-delta up">↑{delta}</span>;
  }

  if (delta < 0) {
    return <span className="position-delta down">↓{Math.abs(delta)}</span>;
  }

  return <span className="position-delta same">=</span>;
}

export function StandingCard({
  row,
  position
}: {
  row: Standing;
  position: number;
  compact?: boolean;
}) {
  const subtitle =
    row.played === 0
      ? "Sin partidos puntuados"
      : `${row.correct}/${row.played} aciertos · ${row.percentage}%`;

  return (
    <Link
      href={`/pronosticos/${normalizePlayerForUrl(row.player)}`}
      className="standing-row"
    >
      <div className="standing-position">
        {medals[position - 1] ?? position}
      </div>

      <div className="standing-person">
        <div className="standing-name">{row.player}</div>
        <div className="muted">{subtitle}</div>
      </div>

      <div className="standing-points">
        <strong>{row.points}</strong>
        <span>pts</span>
        <PositionDelta delta={row.positionDelta} />
      </div>
    </Link>
  );
}
