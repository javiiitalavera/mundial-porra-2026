import { NextResponse } from "next/server";
import { getApiFootballResults } from "@/lib/apiFootball";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getApiFootballResults();
  return NextResponse.json(payload);
}
