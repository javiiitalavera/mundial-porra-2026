import { NextResponse } from "next/server";
import { getFootballDataResults } from "@/lib/footballData";

export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getFootballDataResults();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800"
    }
  });
}
