import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Facility Terminal Access",
  description: "Secure Research Facility Terminal",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#000000" />
        <title>Facility</title>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
