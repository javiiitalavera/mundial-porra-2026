#!/usr/bin/env python3
from pathlib import Path

ROOT = Path.cwd()
required = ["package.json", "app"]
for rel in required:
    if not (ROOT / rel).exists():
        raise FileNotFoundError(f"No encuentro {rel}. Ejecuta este script desde la raíz del proyecto mundial-porra-2026.")

(ROOT / "app/page.tsx").write_text('import { StandingCard } from "@/components/StandingCard";\nimport { formatDateSection, resultLabel } from "@/lib/format";\nimport { getFootballDataResults } from "@/lib/footballData";\nimport { getMatches, getStandings } from "@/lib/scoring";\n\nexport const revalidate = 600;\n\ntype ResultsPayload = Awaited<ReturnType<typeof getFootballDataResults>>;\n\nfunction getLastFinishedMatch(results: ResultsPayload["results"]) {\n  return getMatches()\n    .filter((match) => results[match.id]?.status === "FINISHED")\n    .sort((a, b) => {\n      const dateA = `${a.date ?? ""}-${String(a.id).padStart(3, "0")}`;\n      const dateB = `${b.date ?? ""}-${String(b.id).padStart(3, "0")}`;\n      return dateB.localeCompare(dateA);\n    })[0];\n}\n\nconst podiumMedals = ["🥇", "🥈", "🥉"];\n\nexport default async function HomePage() {\n  const payload = await getFootballDataResults();\n  const standings = getStandings(payload.results);\n  const played = Object.keys(payload.results).length;\n  const total = getMatches().length;\n  const podium = standings.slice(0, 3);\n  const rest = standings.slice(3);\n  const lastMatch = getLastFinishedMatch(payload.results);\n  const lastResult = lastMatch ? payload.results[lastMatch.id] : undefined;\n\n  return (\n    <section className="screen">\n      <header className="page-header">\n        <div className="section-label">🏆 Mundial 2026</div>\n        <h1>Clasificación</h1>\n        <p>{played}/{total} partidos puntuados</p>\n      </header>\n\n      {payload.error ? (\n        <div className="system-notice">Actualizando resultados...</div>\n      ) : null}\n\n      {lastMatch && lastResult ? (\n        <section className="last-result-card">\n          <div>\n            <span className="section-label">Último resultado</span>\n            <h2>{lastMatch.home} - {lastMatch.away}</h2>\n            <p>{formatDateSection(lastMatch.date)}</p>\n          </div>\n          <strong>{resultLabel(lastResult)}</strong>\n        </section>\n      ) : null}\n\n      <section className="block classification-only-block">\n        <div className="podium">\n          {podium.map((row, index) => (\n            <a\n              key={row.player}\n              href={`/pronosticos/${encodeURIComponent(row.player)}`}\n              className={`podium-card rank-${index + 1}`}\n            >\n              <div className="podium-top">{podiumMedals[index]}</div>\n              <div className="podium-name">{row.player}</div>\n              <div className="podium-score">{row.points}</div>\n              <div className="muted">\n                {row.played === 0 ? "Salida" : `${row.correct}/${row.played} · ${row.percentage}%`}\n              </div>\n            </a>\n          ))}\n        </div>\n\n        <div className="standing-list">\n          {rest.map((row, index) => (\n            <StandingCard key={row.player} row={row} position={index + 4} compact />\n          ))}\n        </div>\n      </section>\n    </section>\n  );\n}\n', encoding="utf-8")

css_path = ROOT / "app/globals.css"
css = css_path.read_text(encoding="utf-8")

# Limpiar bloques previos problemáticos o contradictorios para evitar acumulación de estilos.
markers = [
    "/* V8 final design */",
    "/* Compact home polish */",
    "/* Classification-only home */",
    "/* Sports polish: typography, classification and non-technical status */",
    "/* Rescue clean design after V8 rollback */",
    "/* Stable visual baseline */",
    "/* UI consistency pass */",
]

for marker in markers:
    while marker in css:
        start = css.index(marker)
        next_positions = [css.find(m, start + len(marker)) for m in markers if css.find(m, start + len(marker)) != -1]
        end = min(next_positions) if next_positions else len(css)
        css = css[:start].rstrip() + "\n\n" + css[end:].lstrip()

css = css.rstrip() + "\n\n" + '/* UI consistency pass */\n:root {\n  --app-bg: #fff4d8;\n  --app-surface: rgba(255, 255, 255, 0.82);\n  --app-surface-strong: #fffdf7;\n  --app-border: rgba(31, 24, 12, 0.12);\n  --app-text: #17130c;\n  --app-muted: #7f725f;\n  --app-accent: #ffb21a;\n  --app-accent-soft: #fff0c2;\n}\n\nhtml,\nbody {\n  background: var(--app-bg);\n  color: var(--app-text);\n  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Arial, sans-serif;\n}\n\n.screen {\n  max-width: 520px;\n  margin: 0 auto;\n  padding: 22px 24px 116px;\n}\n\n.page-header,\n.app-header {\n  padding: 10px 0 18px;\n  margin: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n}\n\n.section-label {\n  color: #9a6a00;\n  font-size: 13px;\n  line-height: 1.2;\n  font-weight: 800;\n  letter-spacing: 0.03em;\n  text-transform: uppercase;\n}\n\n.page-header h1,\n.app-header h1 {\n  margin: 6px 0 0;\n  color: var(--app-text);\n  font-size: clamp(40px, 10vw, 54px);\n  line-height: 0.98;\n  font-weight: 850;\n  letter-spacing: -0.055em;\n}\n\n.page-header p,\n.app-header p {\n  margin: 10px 0 0;\n  color: var(--app-muted);\n  font-size: 17px;\n  line-height: 1.35;\n  font-weight: 600;\n}\n\n.block,\n.quiet-card,\n.match-card,\n.player-row,\n.standing-row,\n.last-result-card {\n  border: 1px solid var(--app-border);\n  background: var(--app-surface);\n  box-shadow: 0 14px 38px rgba(58, 42, 13, 0.07);\n}\n\n.block {\n  margin-top: 16px;\n  padding: 16px;\n  border-radius: 26px;\n}\n\n.block-heading {\n  margin-bottom: 14px;\n}\n\n.block-heading h2,\n.date-title h2,\n.quiet-card h2 {\n  color: var(--app-text);\n  font-size: 28px;\n  line-height: 1.05;\n  font-weight: 850;\n  letter-spacing: -0.045em;\n}\n\n.block-heading span,\n.date-title span,\n.muted {\n  color: var(--app-muted);\n}\n\n.classification-only-block {\n  margin-top: 14px;\n}\n\n.last-result-card {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin-top: 4px;\n  padding: 16px 18px;\n  border-radius: 24px;\n}\n\n.last-result-card h2 {\n  margin: 5px 0 3px;\n  color: var(--app-text);\n  font-size: 24px;\n  line-height: 1.05;\n  font-weight: 850;\n  letter-spacing: -0.04em;\n}\n\n.last-result-card p {\n  margin: 0;\n  color: var(--app-muted);\n  font-size: 14px;\n  font-weight: 600;\n}\n\n.last-result-card strong {\n  flex: 0 0 auto;\n  padding: 12px 14px;\n  border-radius: 18px;\n  background: var(--app-text);\n  color: #fff7df;\n  font-size: 22px;\n  line-height: 1;\n  font-weight: 850;\n  letter-spacing: -0.04em;\n}\n\n.podium {\n  display: grid;\n  gap: 10px;\n}\n\n.podium-card {\n  min-height: 78px;\n  padding: 12px;\n  border-radius: 24px;\n}\n\n.podium-top {\n  font-size: 22px;\n}\n\n.podium-name,\n.standing-name,\n.player-name,\n.team {\n  color: var(--app-text);\n  font-weight: 800;\n  letter-spacing: -0.035em;\n}\n\n.podium-score {\n  font-weight: 850;\n}\n\n.system-notice {\n  margin-top: 4px;\n  border: 1px solid rgba(154, 106, 0, 0.18);\n  border-radius: 18px;\n  background: var(--app-accent-soft);\n  color: #8a5b00;\n  font-size: 14px;\n  font-weight: 750;\n}\n\n.date-stack,\n.player-list {\n  margin-top: 14px;\n}\n\n.date-section {\n  margin-top: 22px;\n}\n\n.date-section:first-child {\n  margin-top: 0;\n}\n\n.bottom-nav {\n  border-top-color: var(--app-border);\n  background: rgba(255, 250, 237, 0.92);\n}\n\n.bottom-nav a {\n  font-size: 15px;\n  font-weight: 800;\n}\n\n.bottom-nav a.active {\n  background: var(--app-accent);\n  color: var(--app-text);\n}\n\n@media (max-width: 390px) {\n  .screen {\n    padding-left: 18px;\n    padding-right: 18px;\n  }\n\n  .page-header h1,\n  .app-header h1 {\n    font-size: 40px;\n  }\n\n  .block-heading h2,\n  .date-title h2,\n  .quiet-card h2 {\n    font-size: 26px;\n  }\n\n  .last-result-card h2 {\n    font-size: 22px;\n  }\n\n  .last-result-card strong {\n    font-size: 20px;\n  }\n}\n' + "\n"
css_path.write_text(css, encoding="utf-8")

print("Aplicada revisión pensada:")
print("- Clasificación sin próximo partido.")
print("- Último resultado solo cuando exista un partido finalizado.")
print("- Eliminado 'Todos empiezan igual'.")
print("- Eliminado '1 punto por acertar'.")
print("- Homogeneizados títulos, espaciados, fondos, tarjetas y navegación.")
print("")
print("Ejecuta:")
print("npm run build")
print("git add .")
print("git commit -m 'Unify UI and add last result'")
print("git push")
print("npx vercel --prod")
