export function formatUpdatedAt(updatedAt?: string): string {
  if (!updatedAt) return "Actualizando";

  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return "Actualizando";

  const time = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid"
  }).format(date);

  return `Actualizado ${time}`;
}
