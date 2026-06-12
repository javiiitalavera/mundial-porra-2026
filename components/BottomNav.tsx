"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Clasificación" },
  { href: "/partidos", label: "Calendario" },
  { href: "/pronosticos", label: "Quinielas" },
  { href: "/instalar", label: "Instalar" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={isActive(pathname, item.href) ? "active" : ""}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
