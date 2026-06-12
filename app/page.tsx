import { StandingCard } from "@/components/StandingCard";
import { UpdateStatus } from "@/components/UpdateStatus";
import { formatDateSection, resultLabel } from "@/lib/format";
import { getFootballDataResults } from "@/lib/footballData";
import { getMatches, getStandings } from "@/lib/scoring";
import type { Match, MatchResult } from "@/lib/types";

export const revalidate = 600;

type ResultsPayload = Awaited<ReturnType<typeof getFootballDataResults>>;

function getFeaturedMatch(results: ResultsPayload["results"]): { match: Match; result: MatchResult; label: string } | null {
  const matches = getMatches();

  const liveMatch = matches.find((match) => results[match.id]?.status === "LIVE");
  if (liveMatch) {
    return {
      match: liveMatch,
      result: results[liveMatch.id],
      label: "En juego"
    };
  }

  const finishedMatch = matches
    .filter((match) => results[match.id]?.status === "FINISHED")
    .sort((a, b) => {
      const dateA = `${a.date ?? ""}-${String(a.order).padStart(3, "0")}`;
      const dateB = `${b.date ?? ""}-${String(b.order).padStart(3, "0")}`;
      return dateB.localeCompare(dateA);
    })[0];

  if (finishedMatch) {
    return {
      match: finishedMatch,
      result: results[finishedMatch.id],
      label: "Último resultado"
    };
  }

  return null;
}

export default async function HomePage() {
  const payload = await getFootballDataResults();
  const standings = getStandings(payload.results);
  const played = Object.keys(payload.results).length;
  const total = getMatches().length;
  const featured = getFeaturedMatch(payload.results);

  return (
    <section className="screen">
      <header className="page-header">
        <div className="section-label">🏆 Mundial 2026</div>
        <h1>Clasificación</h1>
        <p>{played}/{total} partidos puntuados</p>
        <UpdateStatus payload={payload} />
      </header>

      {featured ? (
        <section className={featured.label === "En juego" ? "last-result-card live-result-card" : "last-result-card"}>
          <div>
            <span className="section-label">{featured.label}</span>
            <h2>{featured.match.home} - {featured.match.away}</h2>
            <p>{formatDateSection(featured.match.date)}</p>
          </div>
          <strong>{resultLabel(featured.result)}</strong>
        </section>
      ) : null}

      <section className="ranking-list">
        {standings.map((row, index) => (
          <StandingCard key={row.player} row={row} position={index + 1} />
        ))}
      </section>
    </section>
  );
}
