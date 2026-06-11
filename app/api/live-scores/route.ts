import { NextResponse } from "next/server";

/**
 * Preparado para conectar una API real del Mundial.
 *
 * De momento no hace nada porque falta elegir proveedor y guardar la clave en Vercel.
 * Cuando lo conectemos, esta ruta devolverá un objeto:
 *
 * {
 *   "m01": { "homeGoals": 2, "awayGoals": 1, "status": "FINISHED" }
 * }
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    provider: null,
    message: "API pendiente de conectar. La app usa data/manualResults.ts.",
    results: {},
  });
}
