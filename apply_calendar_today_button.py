#!/usr/bin/env python3
from pathlib import Path

ROOT = Path.cwd()
required = ["package.json", "app", "lib"]
for rel in required:
    if not (ROOT / rel).exists():
        raise FileNotFoundError(f"No encuentro {rel}. Ejecuta este script desde la raíz del proyecto mundial-porra-2026.")

partidos = ROOT / "app/partidos/page.tsx"
partidos.write_text('import { MatchCard } from "@/components/MatchCard";\nimport { formatDateSection, formatLongMatchDate } from "@/lib/format";\nimport { getFootballDataResults } from "@/lib/footballData";\nimport { getMatches, getNextMatch } from "@/lib/scoring";\nimport { formatUpdatedAt } from "@/lib/lastUpdated";\n\nexport const revalidate = 600;\n\nexport default async function MatchesPage() {\n  const matches = getMatches();\n  const payload = await getFootballDataResults();\n  const played = Object.keys(payload.results).length;\n  const nextMatch = getNextMatch(payload.results);\n\n  const grouped = matches.reduce((acc, match) => {\n    const key = match.date ?? "Fecha pendiente";\n    if (!acc[key]) acc[key] = [];\n    acc[key].push(match);\n    return acc;\n  }, {} as Record<string, typeof matches>);\n\n  return (\n    <section className="screen">\n      <header className="page-header">\n        <div className="section-label">Calendario</div>\n        <h1>Calendario</h1>\n        <p>{matches.length} partidos · {played} puntuados · {formatUpdatedAt(payload.updatedAt)}</p>\n\n        {nextMatch ? (\n          <a className="jump-today-button" href={`#partido-${nextMatch.id}`}>\n            Ver hoy\n          </a>\n        ) : null}\n      </header>\n\n      {payload.error ? (\n        <div className="system-notice">Actualizando resultados...</div>\n      ) : null}\n\n      <div className="date-stack">\n        {Object.entries(grouped).map(([date, dayMatches]) => (\n          <section key={date} className="date-section">\n            <div className="date-title">\n              <h2>{formatDateSection(date)}</h2>\n              <span>{formatLongMatchDate(date)}</span>\n            </div>\n            <div className="match-stack">\n              {dayMatches.map((match) => (\n                <div\n                  key={match.id}\n                  id={`partido-${match.id}`}\n                  className={nextMatch?.id === match.id ? "match-anchor next-match-anchor" : "match-anchor"}\n                >\n                  <MatchCard match={match} result={payload.results[match.id]} />\n                </div>\n              ))}\n            </div>\n          </section>\n        ))}\n      </div>\n    </section>\n  );\n}\n', encoding="utf-8")

css_path = ROOT / "app/globals.css"
css = css_path.read_text(encoding="utf-8")
marker = "/* Calendar jump to current match */"
if marker not in css:
    css_path.write_text(css.rstrip() + "\n\n" + '/* Calendar jump to current match */\nhtml {\n  scroll-behavior: smooth;\n}\n\n.jump-today-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 14px;\n  min-height: 40px;\n  padding: 0 16px;\n  border: 1px solid rgba(20, 16, 9, 0.12);\n  border-radius: 999px;\n  background: #ffb21a;\n  color: #17130c;\n  font-size: 15px;\n  font-weight: 800;\n  text-decoration: none;\n  box-shadow: 0 8px 20px rgba(58, 42, 13, 0.08);\n}\n\n.match-anchor {\n  scroll-margin-top: 18px;\n}\n\n.next-match-anchor .match-card {\n  border-color: rgba(255, 178, 26, 0.75) !important;\n}\n' + "\n", encoding="utf-8")

print("Añadido botón 'Ver hoy' en Calendario.")
print("Al tocarlo, baja directamente al próximo partido pendiente.")
print("")
print("Ejecuta:")
print("npm run build")
print("git add .")
print("git commit -m 'Add calendar today jump'")
print("git push")
print("npx vercel --prod")
