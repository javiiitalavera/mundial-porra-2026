import { redirect } from "next/navigation";

export default async function OldPlayerPage({
  params,
}: {
  params: Promise<{ player: string }>;
}) {
  const { player } = await params;
  redirect(`/pronosticos/${encodeURIComponent(player)}`);
}
