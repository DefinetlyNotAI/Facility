import {useEffect, useState} from 'react';
import {MESSAGES, SYSTEM_CONFIG} from '@/lib/data/tree98';
import {signCookie} from "@/lib/cookies";

export const useSystemCorruption = (createWindow: any) => {
    const [systemCorruption, setSystemCorruption] = useState(0);
    const [errorPopups, setErrorPopups] = useState<string[]>([]);
    const [isSystemCrashing, setIsSystemCrashing] = useState(false);
    const [showBlueScreen, setShowBlueScreen] = useState(false);

    useEffect(() => {
        if (systemCorruption > 0) {
            const corruptionInterval = setInterval(() => {
                if (systemCorruption < SYSTEM_CONFIG.MAX_CORRUPTION_LEVEL) {
                    const randomMessage = MESSAGES.TREE[Math.floor(Math.random() * MESSAGES.TREE.length)];
                    setErrorPopups(prev => [...prev, randomMessage]);

                    if (Math.random() < SYSTEM_CONFIG.ERROR_POPUP_CHANCE) {
                        createWindow('System Error', null,
                            200 + Math.random() * 300,
                            100 + Math.random() * 200,
                            320, 180,
                            {message: MESSAGES.ERROR[Math.floor(Math.random() * MESSAGES.ERROR.length)]}
                        );
                    }

                    setSystemCorruption(prev => prev + 1);
                } else {
                    setIsSystemCrashing(true);
                    setTimeout(() => {
                        setShowBlueScreen(true);
                        setTimeout(async () => {
                            await signCookie(`${SYSTEM_CONFIG.CUTSCENE_COOKIE}=true`)
                            window.location.href = SYSTEM_CONFIG.REDIRECT_URL;
                        }, SYSTEM_CONFIG.BLUE_SCREEN_DELAY);
                    }, SYSTEM_CONFIG.CRASH_DELAY);
                }
            }, SYSTEM_CONFIG.CORRUPTION_INTERVAL);

            return () => clearInterval(corruptionInterval);
        }
    }, [systemCorruption, createWindow]);

    return {
        systemCorruption,
        setSystemCorruption,
        errorPopups,
        setErrorPopups,
        isSystemCrashing,
        showBlueScreen
    };
};