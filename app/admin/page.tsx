import { getMatches } from "@/lib/scoring";

export default function AdminPage() {
  const matches = getMatches();

  return (
    <section>
      <div className="page-header">
        <h1>Resultados</h1>
        <p>
          Versión inicial: se editan en <code>data/manualResults.ts</code>.
          Después podemos cambiar esta pantalla por un formulario protegido con PIN.
        </p>
      </div>

      <div className="code-card">
        <p>Ejemplo:</p>
        <pre>{`export const manualResults = {
  m01: { homeGoals: 2, awayGoals: 1 },
  m02: { homeGoals: 0, awayGoals: 0 },
};`}</pre>
      </div>

      <div className="stack">
        {matches.map((match) => (
          <article key={match.id} className="admin-row">
            <code>{match.id}</code>
            <span>{match.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
