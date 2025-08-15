import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/contexts/auth-context"
import { GamificationProvider } from "@/contexts/gamification-context"
import { StoriesProvider } from "@/contexts/stories-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "PrithviPath - Sustainable Travel Companion",
  description: "Your indispensable mobile companion for sustainable tourism in India",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
@media (max-width: 768px) {
  body {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }
}
        `}</style>
      </head>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <GamificationProvider>
            <StoriesProvider>{children}</StoriesProvider>
          </GamificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
