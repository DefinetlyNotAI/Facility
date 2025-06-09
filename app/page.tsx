'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

export default function RootPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [showConsoleWarning, setShowConsoleWarning] = useState(false);

  useEffect(() => {
    const cookieAccepted = Cookies.get("accepted");
    if (cookieAccepted) {
      // Already accepted -> redirect immediately
      router.replace("/home");
    } else {
      // Not accepted yet, show permission screen
      setAccepted(false);
    }
  }, [router]);

  // Called when user clicks Accept button
  function handleAccept() {
    Cookies.set("accepted", "true", { expires: 365 }); // 1 year expiration
    setAccepted(true);
    setShowConsoleWarning(true);

    // After a short delay, redirect to /home
    setTimeout(() => {
      router.replace("/home");
    }, 8000); // 8 seconds to read the console warning
  }

  if (accepted === null) {
    // Loading state while checking cookie
    return <div>Loading...</div>;
  }

  if (!accepted) {
    // Show permission & trigger warning screen
    return (
        <main style={{ padding: "2rem", fontFamily: "monospace", color: "#eee", backgroundColor: "#111", height: "100vh" }}>
          <h1>Required Site Permissions</h1>
          <p>
            This site requires certain permissions to proceed, including notifications and audio.
            Please accept to continue.
          </p>

          <h2>Trigger Warnings</h2>
          <ul>
            <li>Psychological horror</li>
            <li>Visual and audio disturbing content</li>
            <li>Possible flashing lights</li>
            <li>Content may be distressing</li>
          </ul>

          <button onClick={handleAccept} style={{ marginTop: "2rem", fontSize: "1.2rem", padding: "0.5rem 1rem" }}>
            Accept
          </button>
        </main>
    );
  }

  if (showConsoleWarning) {
    // Show console warning before redirect
    return (
        <main style={{ padding: "2rem", fontFamily: "monospace", color: "#eee", backgroundColor: "#111", height: "100vh" }}>
          <h1>Warning</h1>
          <p>
            The console of this site should <strong>NOT</strong> be used unless explicitly stated. Using it may ruin or break the puzzle for everyone.
          </p>
          <p>You will be redirected shortly...</p>
        </main>
    );
  }

  return null; // This should never be reached but needed to satisfy TS
}
