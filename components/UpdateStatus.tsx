import { formatUpdatedAt } from "@/lib/lastUpdated";

type UpdatePayload = {
  updatedAt?: string;
  error?: string;
  stale?: boolean;
  cache?: string;
  results?: Record<string, unknown>;
};

function hasAnyResult(payload: UpdatePayload): boolean {
  return Boolean(payload.results && Object.keys(payload.results).length > 0);
}

export function UpdateStatus({ payload }: { payload: UpdatePayload }) {
  const updated = formatUpdatedAt(payload.updatedAt);

  if (!payload.updatedAt) {
    return (
      <div className="update-status neutral">
        <span aria-hidden="true" />
        <strong>Esperando resultados</strong>
      </div>
    );
  }

  if (payload.error || payload.stale) {
    return (
      <div className="update-status warning">
        <span aria-hidden="true" />
        <strong>Últimos datos disponibles</strong>
        <small>{updated.replace("Actualizado ", "")}</small>
      </div>
    );
  }

  if (!hasAnyResult(payload)) {
    return (
      <div className="update-status neutral">
        <span aria-hidden="true" />
        <strong>Esperando resultados</strong>
        <small>{updated.replace("Actualizado ", "")}</small>
      </div>
    );
  }

  return (
    <div className="update-status ok">
      <span aria-hidden="true" />
      <strong>{updated}</strong>
    </div>
  );
}
