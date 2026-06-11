import { NextResponse } from "next/server";
import { getFootballDataResults } from "@/lib/footballData";

export const revalidate = 600;

export async function GET() {
  const payload = await getFootballDataResults();

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=600, stale-while-revalidate=1800"
    }
  });
}
