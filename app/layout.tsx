import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Porra Mundial 2026",
  description: "Ranking en directo de la porra del Mundial 2026",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <main className="app-shell">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
