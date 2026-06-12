#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path.cwd()
required = ["package.json", "app", "components", "lib"]
for rel in required:
    if not (ROOT / rel).exists():
        raise FileNotFoundError(f"No encuentro {rel}. Ejecuta este script desde la raíz del proyecto mundial-porra-2026.")

(ROOT / "components/UpdateStatus.tsx").write_text('import { formatUpdatedAt } from "@/lib/lastUpdated";\n\ntype UpdatePayload = {\n  updatedAt?: string;\n  error?: string;\n  stale?: boolean;\n  cache?: string;\n  results?: Record<string, unknown>;\n};\n\nfunction hasAnyResult(payload: UpdatePayload): boolean {\n  return Boolean(payload.results && Object.keys(payload.results).length > 0);\n}\n\nexport function UpdateStatus({ payload }: { payload: UpdatePayload }) {\n  const updated = formatUpdatedAt(payload.updatedAt);\n\n  if (!payload.updatedAt) {\n    return (\n      <div className="update-status neutral">\n        <span aria-hidden="true" />\n        <strong>Esperando resultados</strong>\n      </div>\n    );\n  }\n\n  if (payload.error || payload.stale) {\n    return (\n      <div className="update-status warning">\n        <span aria-hidden="true" />\n        <strong>Últimos datos disponibles</strong>\n        <small>{updated.replace("Actualizado ", "")}</small>\n      </div>\n    );\n  }\n\n  if (!hasAnyResult(payload)) {\n    return (\n      <div className="update-status neutral">\n        <span aria-hidden="true" />\n        <strong>Esperando resultados</strong>\n        <small>{updated.replace("Actualizado ", "")}</small>\n      </div>\n    );\n  }\n\n  return (\n    <div className="update-status ok">\n      <span aria-hidden="true" />\n      <strong>{updated}</strong>\n    </div>\n  );\n}\n', encoding="utf-8")
(ROOT / "app/page.tsx").write_text('import { StandingCard } from "@/components/StandingCard";\nimport { UpdateStatus } from "@/components/UpdateStatus";\nimport { formatDateSection, resultLabel } from "@/lib/format";\nimport { getFootballDataResults } from "@/lib/footballData";\nimport { getMatches, getStandings } from "@/lib/scoring";\n\nexport const revalidate = 600;\n\ntype ResultsPayload = Awaited<ReturnType<typeof getFootballDataResults>>;\n\nfunction getLastFinishedMatch(results: ResultsPayload["results"]) {\n  return getMatches()\n    .filter((match) => results[match.id]?.status === "FINISHED")\n    .sort((a, b) => {\n      const dateA = `${a.date ?? ""}-${String(a.id).padStart(3, "0")}`;\n      const dateB = `${b.date ?? ""}-${String(b.id).padStart(3, "0")}`;\n      return dateB.localeCompare(dateA);\n    })[0];\n}\n\nexport default async function HomePage() {\n  const payload = await getFootballDataResults();\n  const standings = getStandings(payload.results);\n  const played = Object.keys(payload.results).length;\n  const total = getMatches().length;\n  const lastMatch = getLastFinishedMatch(payload.results);\n  const lastResult = lastMatch ? payload.results[lastMatch.id] : undefined;\n\n  return (\n    <section className="screen final-screen">\n      <header className="page-header final-header">\n        <div className="section-label">🏆 Mundial 2026</div>\n        <h1>Clasificación</h1>\n        <p>{played}/{total} partidos puntuados</p>\n        <UpdateStatus payload={payload} />\n      </header>\n\n      {payload.error ? (\n        <div className="system-notice">Actualizando resultados...</div>\n      ) : null}\n\n      {lastMatch && lastResult ? (\n        <section className="last-result-card final-last-result">\n          <div>\n            <span className="section-label">Último resultado</span>\n            <h2>{lastMatch.home} - {lastMatch.away}</h2>\n            <p>{formatDateSection(lastMatch.date)}</p>\n          </div>\n          <strong>{resultLabel(lastResult)}</strong>\n        </section>\n      ) : null}\n\n      <section className="final-ranking-list">\n        {standings.map((row, index) => (\n          <StandingCard key={row.player} row={row} position={index + 1} compact />\n        ))}\n      </section>\n    </section>\n  );\n}\n', encoding="utf-8")

def ensure_update_status_import(text: str) -> str:
    if 'from "@/components/UpdateStatus"' in text:
        return text
    lines = text.splitlines()
    insert_at = 0
    for i, line in enumerate(lines):
        if line.startswith("import "):
            insert_at = i + 1
    lines.insert(insert_at, 'import { UpdateStatus } from "@/components/UpdateStatus";')
    return "\n".join(lines) + "\n"

def remove_updated_from_header_text(text: str) -> str:
    # Quita los añadidos previos tipo "· {formatUpdatedAt(payload.updatedAt)}"
    text = text.replace(" · {formatUpdatedAt(payload.updatedAt)}", "")
    text = text.replace(" · {formatUpdatedAt(payload.updatedAt)}</p>", "</p>")
    # Si el import ya no se usa, no pasa nada; TypeScript fallaría si está no usado solo con noUnusedLocals true.
    return text

def add_status_after_first_payload_p(text: str) -> str:
    if "<UpdateStatus payload={payload} />" in text:
        return text

    # Inserta tras el primer </p> dentro del header si existe.
    marker = "</p>"
    idx = text.find(marker)
    if idx != -1:
        return text[:idx + len(marker)] + "\n        <UpdateStatus payload={payload} />" + text[idx + len(marker):]
    return text

for rel in ["app/partidos/page.tsx", "app/pronosticos/page.tsx"]:
    path = ROOT / rel
    if path.exists():
        text = path.read_text(encoding="utf-8")
        text = ensure_update_status_import(text)
        text = remove_updated_from_header_text(text)
        text = add_status_after_first_payload_p(text)
        path.write_text(text, encoding="utf-8")

css_path = ROOT / "app/globals.css"
css = css_path.read_text(encoding="utf-8")
marker = "/* Update status pill */"
if marker not in css:
    css_path.write_text(css.rstrip() + "\n\n" + '/* Update status pill */\n.update-status {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  width: fit-content;\n  max-width: 100%;\n  margin-top: 10px;\n  padding: 7px 10px;\n  border: 1px solid rgba(20, 16, 9, 0.10);\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.72);\n  color: #17130c;\n  font-size: 13px;\n  line-height: 1;\n  font-weight: 750;\n  box-shadow: 0 5px 14px rgba(58, 42, 13, 0.04);\n}\n\n.update-status span {\n  width: 8px;\n  height: 8px;\n  border-radius: 999px;\n  background: #8d806d;\n  flex: 0 0 auto;\n}\n\n.update-status strong {\n  font-size: 13px;\n  line-height: 1;\n  font-weight: 800;\n  white-space: nowrap;\n}\n\n.update-status small {\n  color: #7c705f;\n  font-size: 12px;\n  line-height: 1;\n  font-weight: 750;\n  white-space: nowrap;\n}\n\n.update-status.ok span {\n  background: #16a05f;\n}\n\n.update-status.ok {\n  background: rgba(22, 160, 95, 0.10);\n  color: #0f7045;\n}\n\n.update-status.warning span {\n  background: #d98a00;\n}\n\n.update-status.warning {\n  background: rgba(255, 178, 26, 0.18);\n  color: #8a5b00;\n}\n\n.update-status.neutral span {\n  background: #9b8d76;\n}\n\n.update-status.neutral {\n  background: rgba(255, 255, 255, 0.66);\n  color: #6d6253;\n}\n\n@media (max-width: 390px) {\n  .update-status {\n    margin-top: 9px;\n    padding: 7px 9px;\n  }\n\n  .update-status strong {\n    font-size: 12px;\n  }\n\n  .update-status small {\n    font-size: 11px;\n  }\n}\n' + "\n", encoding="utf-8")

print("Añadida pastilla visual de estado de actualización.")
print("- Actualizado HH:MM si todo va bien y hay resultados.")
print("- Últimos datos disponibles · HH:MM si hay fallo y se usan datos guardados.")
print("- Esperando resultados antes del primer marcador.")
print("")
print("Ejecuta:")
print("npm run build")
print("git add .")
print("git commit -m 'Add update status pill'")
print("git push")
print("npx vercel --prod")
