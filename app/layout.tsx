"use client"

import React, {useEffect} from "react";
import {usePathname} from "next/navigation";
import "./globals.css";
import styles from "@/styles/Layout.module.css";
import TAS from "@/components/TAS";

function getTitle(pathname: string) {
    if (pathname === "/") return "Hope you have fun";
    if (pathname === "/moonlight") return "A night so cold he forgot to smile";
    if (pathname === "/smileking") return ":)";
    if (pathname === "/choices") return "So many choices..";
    if (pathname === "/h0m3") return "HELP ME FIND HOME";
    if (pathname === "/the-end") return "Thank you.. See you soon, may HE be with you, Praise Be";
    if (pathname === "/CHEATER") return "HYPOCRITE";
    if (pathname === "/smileking-auth") return "Authorized Access Only - Smile King Terminal";
    return "The Facility";
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    useEffect(() => {
        // Set document title
        const title = getTitle(pathname);
        document.title = title === pathname ? "Loading" : title;

        // Check if a favicon <link> already exists
        const hasFavicon = !!document.querySelector('link[rel~="icon"]');

        if (!hasFavicon) {
            // Create and add the default favicon link element
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = "/favicon.ico";
            document.head.appendChild(link);
        }

        return () => {
            if (!hasFavicon) {
                document.head.querySelector('link[rel="icon"][href="/favicon.ico"]')?.remove();
            }
        }
    }, [pathname]);

    const [isClient, setIsClient] = React.useState(false);

    // Hide loading screen after window load
    useEffect(() => {
        setIsClient(true);
        const hideLoadingScreen = () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }, 500);
                }
            }, 1500);
        };

        if (document.readyState === 'complete') {
            hideLoadingScreen();
        } else {
            window.addEventListener('load', hideLoadingScreen);
        }

        return () => {
            window.removeEventListener('load', hideLoadingScreen);
        };
    }, []);

    return (
        <html lang="en" className="dark">
        <head>
            <meta name="robots" content="noindex, nofollow"/>
            <meta name="theme-color" content="#000000"/>
            <meta name="classification" content="RESTRICTED"/>
            <meta name="clearance-level" content="LEVEL-5"/>
            <meta name="facility-id" content="05-B"/>
            <title></title>
        </head>
        <body className={`font-sans antialiased min-h-screen ${styles.body}`}>
        {isClient && (
            <div id="loading-screen" className={styles["loading-screen"]}>
                <div className="text-center">
                    <div className="text-green-400 text-2xl font-mono mb-4">FACILITY OS</div>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        )}
        <div className="scanlines crt-effect">
            {children}
            <TAS/>
        </div>
        </body>
        </html>
    );
}
