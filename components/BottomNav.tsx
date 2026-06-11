import Link from "next/link";

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <Link href="/">Ranking</Link>
      <Link href="/partidos">Partidos</Link>
      <Link href="/pronosticos">Pronósticos</Link>
    </nav>
  );
}
