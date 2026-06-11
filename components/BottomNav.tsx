import Link from "next/link";

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <Link href="/">Ranking</Link>
      <Link href="/partidos">Partidos</Link>
      <Link href="/jugadores">Jugadores</Link>
      <Link href="/admin">Resultados</Link>
    </nav>
  );
}
