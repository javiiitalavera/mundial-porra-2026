"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Clasificación", icon: "♕" },
  { href: "/partidos", label: "Calendario", icon: "□" },
  { href: "/pronosticos", label: "Quinielas", icon: "◌" },
  { href: "/instalar", label: "Instalar", icon: "↓" }
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
        <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? "active" : ""}>
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
