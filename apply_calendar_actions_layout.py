#!/usr/bin/env python3
from pathlib import Path

ROOT = Path.cwd()
required = ["package.json", "app", "components", "lib"]
for rel in required:
    if not (ROOT / rel).exists():
        raise FileNotFoundError(f"No encuentro {rel}. Ejecuta este script desde la raíz del proyecto mundial-porra-2026.")

(ROOT / "app/partidos/page.tsx").write_text('import { MatchCard } from "@/components/MatchCard";\nimport { UpdateStatus } from "@/components/UpdateStatus";\nimport { formatDateSection, formatLongMatchDate } from "@/lib/format";\nimport { getFootballDataResults } from "@/lib/footballData";\nimport { getMatches, getNextMatch } from "@/lib/scoring";\n\nexport const revalidate = 600;\n\nexport default async function MatchesPage() {\n  const matches = getMatches();\n  const payload = await getFootballDataResults();\n  const played = Object.keys(payload.results).length;\n  const nextMatch = getNextMatch(payload.results);\n\n  const grouped = matches.reduce((acc, match) => {\n    const key = match.date ?? "Fecha pendiente";\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(match);\n    return acc;\n  }, {} as Record<string, typeof matches>);\n\n  return (\n    <section className="screen">\n      <header className="page-header">\n        <div className="section-label">Calendario</div>\n        <h1>Calendario</h1>\n        <p>{matches.length} partidos · {played} puntuados</p>\n\n        <div className="calendar-actions">\n          <UpdateStatus payload={payload} />\n\n          {nextMatch ? (\n            <a className="jump-today-button" href={`#partido-${nextMatch.id}`}>\n              Ver hoy\n            </a>\n          ) : null}\n        </div>\n      </header>\n\n      {payload.error ? (\n        <div className="system-notice">Actualizando resultados...</div>\n      ) : null}\n\n      <div className="date-stack">\n        {Object.entries(grouped).map(([date, dayMatches]) => (\n          <section key={date} className="date-section">\n            <div className="date-title">\n              <h2>{formatDateSection(date)}</h2>\n              <span>{formatLongMatchDate(date)}</span>\n            </div>\n            <div className="match-stack">\n              {dayMatches.map((match) => (\n                <div\n                  key={match.id}\n                  id={`partido-${match.id}`}\n                  className={nextMatch?.id === match.id ? "match-anchor next-match-anchor" : "match-anchor"}\n                >\n                  <MatchCard match={match} result={payload.results[match.id]} />\n                </div>\n              ))}\n            </div>\n          </section>\n        ))}\n      </div>\n    </section>\n  );\n}\n', encoding="utf-8")

css_path = ROOT / "app/globals.css"
css = css_path.read_text(encoding="utf-8")
marker = "/* Calendar actions alignment */"
if marker not in css:
    css_path.write_text(css.rstrip() + "\n\n" + '/* Calendar actions alignment */\n.calendar-actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 14px;\n  width: 100%;\n}\n\n.calendar-actions .update-status {\n  margin-top: 0;\n}\n\n.calendar-actions .jump-today-button {\n  margin-top: 0;\n  margin-left: auto;\n  flex: 0 0 auto;\n}\n\n@media (max-width: 390px) {\n  .calendar-actions {\n    gap: 8px;\n  }\n\n  .calendar-actions .jump-today-button {\n    padding-left: 14px;\n    padding-right: 14px;\n  }\n}\n' + "\n", encoding="utf-8")

print("Alineado el botón Ver hoy a la derecha y separado del estado de actualización.")
print("")
print("Ejecuta:")
print("npm run build")
print("git add .")
print("git commit -m 'Align calendar actions'")
print("git push")
print("npx vercel --prod")
