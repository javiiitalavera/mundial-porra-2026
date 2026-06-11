import { getApiFootballResults } from "@/lib/apiFootball";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const payload = await getApiFootballResults();

  return (
    <section>
      <div className="page-header">
        <h1>Estado API</h1>
        <p>Pantalla oculta para comprobar si API-Football está respondiendo.</p>
      </div>

      <div className="code-card">
        <p>Fuente: {payload.source}</p>
        <p>Partidos emparejados: {payload.matchedFixtures}</p>
        <p>Resultados con marcador: {Object.keys(payload.results).length}</p>
        <p>Última actualización: {payload.updatedAt}</p>
        {payload.error ? <p>Error: {payload.error}</p> : null}
      </div>

      <div className="code-card">
        <p>Respuesta resumida:</p>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </div>
    </section>
  );
}
