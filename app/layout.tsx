import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/BottomNav";
import { PullToRefresh } from "@/components/PullToRefresh";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mundial 2026",
  description: "Ranking en directo de Mundial 2026",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  appleWebApp: {
    capable: true,
    title: "Mundial 2026",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#ffb31a",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <PullToRefresh />
        <main className="app-shell">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
