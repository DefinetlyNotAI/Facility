import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Facility Terminal Access",
  description: "Secure Research Facility Terminal - Authorized Personnel Only",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  generator: 'Facility OS v3.15.25',
  robots: "noindex, nofollow",
  other: {
    'classification': 'RESTRICTED',
    'clearance-level': 'LEVEL-5',
    'facility-id': '05-B'
  }
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en" className="dark">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#000000" />
        <meta name="classification" content="RESTRICTED" />
        <meta name="clearance-level" content="LEVEL-5" />
        <meta name="facility-id" content="05-B" />
        <title>Facility Terminal Access</title>
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              background: #000; 
              overflow: hidden; 
            }
            .loading-screen {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
              transition: opacity 0.5s ease-out;
            }
            .loading-screen.hidden {
              opacity: 0;
              pointer-events: none;
            }
          `
        }} />
      </head>
      <body className="font-sans antialiased bg-black text-white min-h-screen">
      <div id="loading-screen" className="loading-screen">
        <div className="text-center">
          <div className="text-green-400 text-2xl font-mono mb-4">FACILITY OS</div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="scanlines crt-effect">
        {children}
      </div>
      <script dangerouslySetInnerHTML={{
        __html: `
            window.addEventListener('load', function() {
              setTimeout(function() {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                  loadingScreen.classList.add('hidden');
                  setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                  }, 500);
                }
              }, 1500);
            });
          `
      }} />
      </body>
      </html>
  )
}