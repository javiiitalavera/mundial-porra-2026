import { formatUpdatedAt, formatUpdatedTime } from "@/lib/lastUpdated";

export type UpdateStatusPayload = {
  updatedAt?: string;
  error?: string;
  stale?: boolean;
};

export function UpdateStatus({ payload }: { payload: UpdateStatusPayload }) {
  if (!payload.updatedAt) {
    return (
      <div className="update-status neutral">
        <span aria-hidden="true" />
        <strong>Esperando actualización</strong>
      </div>
    );
  }

  if (payload.error || payload.stale) {
    return (
      <div className="update-status warning">
        <span aria-hidden="true" />
        <strong>Últimos datos disponibles</strong>
        <small>{formatUpdatedTime(payload.updatedAt)}</small>
      </div>
    );
  }

  return (
    <div className="update-status ok">
      <span aria-hidden="true" />
      <strong>{formatUpdatedAt(payload.updatedAt)}</strong>
    </div>
  );
}
