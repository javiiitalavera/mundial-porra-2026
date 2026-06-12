export function formatUpdatedTime(updatedAt?: string): string {
  if (!updatedAt) return "";

  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid"
  }).format(date);
}

export function formatUpdatedAt(updatedAt?: string): string {
  const time = formatUpdatedTime(updatedAt);
  return time ? `Actualizado ${time}` : "Actualizando";
}
