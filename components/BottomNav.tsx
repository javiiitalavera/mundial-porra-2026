"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "Clasificación",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4.5A2.5 2.5 0 0 0 7 8.5" />
        <path d="M17 6h2.5A2.5 2.5 0 0 1 17 8.5" />
        <path d="M12 12v4" />
        <path d="M8.5 20h7" />
        <path d="M10 16h4" />
      </svg>
    )
  },
  {
    href: "/partidos",
    label: "Calendario",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3v3" />
        <path d="M17 3v3" />
        <path d="M4.5 8.5h15" />
        <rect x="4.5" y="5" width="15" height="15.5" rx="3" />
        <path d="M8 12h.01" />
        <path d="M12 12h.01" />
        <path d="M16 12h.01" />
        <path d="M8 16h.01" />
        <path d="M12 16h.01" />
      </svg>
    )
  },
  {
    href: "/pronosticos",
    label: "Quinielas",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.8 19a5.2 5.2 0 0 1 10.4 0" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M14.8 17.2a4.4 4.4 0 0 1 5.4 1.8" />
      </svg>
    )
  },
  {
    href: "/instalar",
    label: "Instalar",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v11" />
        <path d="m7.5 10 4.5 4.5L16.5 10" />
        <path d="M5 18.5h14" />
      </svg>
    )
  }
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
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
