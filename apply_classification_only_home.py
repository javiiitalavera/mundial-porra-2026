#!/usr/bin/env python3
from pathlib import Path

ROOT = Path.cwd()
required = ["package.json", "app"]
for rel in required:
    if not (ROOT / rel).exists():
        raise FileNotFoundError(f"No encuentro {rel}. Ejecuta este script desde la raíz del proyecto mundial-porra-2026.")

(ROOT / "app/page.tsx").write_text('import { StandingCard } from "@/components/StandingCard";\nimport { getFootballDataResults } from "@/lib/footballData";\nimport { getMatches, getStandings } from "@/lib/scoring";\n\nexport const revalidate = 600;\n\nfunction leaderText(standings: ReturnType<typeof getStandings>, played: number): string {\n  if (played === 0) return "Todos empiezan igual";\n  const top = standings[0]?.points ?? 0;\n  const tied = standings.filter((row) => row.points === top).length;\n  return tied > 1 ? "Empate en cabeza" : "Líder provisional";\n}\n\nconst podiumMedals = ["🥇", "🥈", "🥉"];\n\nexport default async function HomePage() {\n  const payload = await getFootballDataResults();\n  const standings = getStandings(payload.results);\n  const played = Object.keys(payload.results).length;\n  const total = getMatches().length;\n  const podium = standings.slice(0, 3);\n  const rest = standings.slice(3);\n\n  return (\n    <section className="screen">\n      <header className="page-header classification-header">\n        <div className="section-label">🏆 Mundial 2026</div>\n        <h1>Clasificación</h1>\n        <p>{played}/{total} partidos puntuados · 1 punto por acertar</p>\n      </header>\n\n      {payload.error ? (\n        <div className="system-notice">Actualizando resultados...</div>\n      ) : null}\n\n      <section className="block classification-only-block">\n        <div className="leader-note">{leaderText(standings, played)}</div>\n\n        <div className="podium">\n          {podium.map((row, index) => (\n            <a\n              key={row.player}\n              href={`/pronosticos/${encodeURIComponent(row.player)}`}\n              className={`podium-card rank-${index + 1}`}\n            >\n              <div className="podium-top">{podiumMedals[index]}</div>\n              <div className="podium-name">{row.player}</div>\n              <div className="podium-score">{row.points}</div>\n              <div className="muted">\n                {row.played === 0 ? "Salida" : `${row.correct}/${row.played} · ${row.percentage}%`}\n              </div>\n            </a>\n          ))}\n        </div>\n\n        <div className="standing-list">\n          {rest.map((row, index) => (\n            <StandingCard key={row.player} row={row} position={index + 4} compact />\n          ))}\n        </div>\n      </section>\n    </section>\n  );\n}\n', encoding="utf-8")

css_path = ROOT / "app/globals.css"
css = css_path.read_text(encoding="utf-8")
marker = "/* Classification-only home */"
if marker not in css:
    css_path.write_text(css.rstrip() + "\n\n" + '/* Classification-only home */\n.classification-header {\n  padding-top: 8px;\n  padding-bottom: 12px;\n}\n\n.classification-header h1 {\n  margin-top: 4px;\n  font-size: clamp(42px, 11vw, 56px);\n  line-height: 0.95;\n}\n\n.classification-header p {\n  margin-top: 10px;\n}\n\n.classification-only-block {\n  margin-top: 6px;\n}\n\n.classification-only-block .leader-note {\n  margin-bottom: 12px;\n}\n' + "\n", encoding="utf-8")

print("Home simplificada: solo clasificación.")
print("Ejecuta:")
print("npm run build")
print("git add .")
print("git commit -m 'Show classification only on home'")
print("git push")
print("npx vercel --prod")
