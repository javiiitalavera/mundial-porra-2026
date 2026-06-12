#!/usr/bin/env python3
from pathlib import Path

ROOT = Path.cwd()
required = ["package.json", "app", "lib"]
for rel in required:
    if not (ROOT / rel).exists():
        raise FileNotFoundError(f"No encuentro {rel}. Ejecuta este script desde la raíz del proyecto mundial-porra-2026.")

(ROOT / "lib/lastUpdated.ts").write_text('export function formatUpdatedAt(updatedAt?: string): string {\n  if (!updatedAt) return "Actualizando";\n\n  const date = new Date(updatedAt);\n  if (Number.isNaN(date.getTime())) return "Actualizando";\n\n  const time = new Intl.DateTimeFormat("es-ES", {\n    hour: "2-digit",\n    minute: "2-digit",\n    timeZone: "Europe/Madrid"\n  }).format(date);\n\n  return `Actualizado ${time}`;\n}\n', encoding="utf-8")

def ensure_import(path: Path):
    text = path.read_text(encoding="utf-8")
    if 'from "@/lib/lastUpdated"' not in text:
        lines = text.splitlines()
        insert_at = 0
        for i, line in enumerate(lines):
            if line.startswith("import "):
                insert_at = i + 1
        lines.insert(insert_at, 'import { formatUpdatedAt } from "@/lib/lastUpdated";')
        text = "\n".join(lines) + "\n"
    return text

home = ROOT / "app/page.tsx"
text = ensure_import(home)
text = text.replace(
    "{played}/{total} partidos puntuados</p>",
    "{played}/{total} partidos puntuados · {formatUpdatedAt(payload.updatedAt)}</p>"
)
home.write_text(text, encoding="utf-8")

partidos = ROOT / "app/partidos/page.tsx"
if partidos.exists():
    text = ensure_import(partidos)
    text = text.replace(
        "<p>72 partidos. Horarios, grupos y lo que ha puesto cada uno.</p>",
        "<p>72 partidos · {formatUpdatedAt(payload.updatedAt)}</p>"
    )
    text = text.replace(
        "<p>Horarios, grupos y lo que ha puesto cada uno.</p>",
        "<p>Horarios, grupos y quinielas · {formatUpdatedAt(payload.updatedAt)}</p>"
    )
    text = text.replace(
        "<p>{matches.length} partidos · {played} puntuados</p>",
        "<p>{matches.length} partidos · {played} puntuados · {formatUpdatedAt(payload.updatedAt)}</p>"
    )
    partidos.write_text(text, encoding="utf-8")

pronosticos = ROOT / "app/pronosticos/page.tsx"
if pronosticos.exists():
    text = ensure_import(pronosticos)
    text = text.replace(
        "<p>Consulta la quiniela de cada participante.</p>",
        "<p>Consulta la quiniela de cada participante · {formatUpdatedAt(payload.updatedAt)}</p>"
    )
    pronosticos.write_text(text, encoding="utf-8")

css_path = ROOT / "app/globals.css"
css = css_path.read_text(encoding="utf-8")
marker = "/* Last update text */"
patch = """
/* Last update text */
.page-header p {
  max-width: 100%;
}
""".strip()
if marker not in css:
    css_path.write_text(css.rstrip() + "\n\n" + patch + "\n", encoding="utf-8")

print("Añadida hora de última actualización en Clasificación, Calendario y Quinielas.")
print("Formato: Actualizado 22:06, en hora de Madrid.")
print("")
print("Ejecuta:")
print("npm run build")
print("git add .")
print("git commit -m 'Show last update time'")
print("git push")
print("npx vercel --prod")
