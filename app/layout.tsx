"use client"

import React, {useEffect} from "react";
import {usePathname} from "next/navigation";
import "./globals.css";
import TAS from "@/components/TAS";

function getTitle(pathname: string) {
    if (pathname === "/") return "Hope you have fun";
    if (pathname === "/moonlight") return "A night so cold he forgot to smile";
    if (pathname === "/smileking") return ":)";
    if (pathname === "/smileking-auth") return "Authorized Access Only - Smile King Terminal";
    return "Facility Terminal Access";
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    useEffect(() => {
        const title = getTitle(pathname);
        document.title = title === pathname ? "Loading" : title;
    }, [pathname]);

    return (
        <html lang="en" className="dark">
        <head>
            <meta name="robots" content="noindex, nofollow"/>
            <meta name="theme-color" content="#000000"/>
            <meta name="classification" content="RESTRICTED"/>
            <meta name="clearance-level" content="LEVEL-5"/>
            <meta name="facility-id" content="05-B"/>
            <link rel="icon" href="/favicon.ico"/>
            <title></title>
        </head>
        <body className="font-sans antialiased bg-black text-white min-h-screen">
        <div id="loading-screen" className="loading-screen">
            <div className="text-center">
                <div className="text-green-400 text-2xl font-mono mb-4">FACILITY OS</div>
                <div className="loading-dots"><span></span><span></span><span></span></div>
            </div>
        </div>
        <div className="scanlines crt-effect">
            {children}
            <TAS/>
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
        }}/>
        </body>
        </html>
    );
}
