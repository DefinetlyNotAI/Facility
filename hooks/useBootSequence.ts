import {useEffect, useState} from 'react';
import {MESSAGES, SYSTEM_CONFIG} from '../lib/tree98data';

export const useBootSequence = () => {
    const [bootPhase, setBootPhase] = useState<'boot' | 'main' | 'loading' | 'login' | 'desktop'>('boot');
    const [tree98BootText, setTree98BootText] = useState('');
    const [bootText, setBootText] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        // Tree98 boot sequence
        let messageIndex = 0;
        let charIndex = 0;
        let currentText = '';

        const bootInterval = setInterval(() => {
            if (messageIndex < MESSAGES.TREE98_BOOT.length) {
                const currentMessage = MESSAGES.TREE98_BOOT[messageIndex];
                if (charIndex < currentMessage.length) {
                    currentText += currentMessage[charIndex];
                    charIndex++;
                } else {
                    currentText += '\n';
                    messageIndex++;
                    charIndex = 0;
                }
                setTree98BootText(currentText);
            } else {
                clearInterval(bootInterval);
                setTimeout(() => {
                    setBootPhase('main');
                    startMainBoot();
                }, 1000);
            }
        }, SYSTEM_CONFIG.BOOT_DELAY);

        const startMainBoot = () => {
            if (localStorage.getItem('SeenVesselBoot') === 'true') {
                setBootPhase('loading');
                startLoadingBar();
                return;
            }
            let mainMessageIndex = 0;
            let mainCharIndex = 0;
            let mainCurrentText = '';

            const mainBootInterval = setInterval(() => {
                if (mainMessageIndex < MESSAGES.VESSEL_BOOT.length) {
                    const currentMessage = MESSAGES.VESSEL_BOOT[mainMessageIndex];
                    if (mainCharIndex < currentMessage.length) {
                        mainCurrentText += currentMessage[mainCharIndex];
                        mainCharIndex++;
                    } else {
                        mainCurrentText += '\n';
                        mainMessageIndex++;
                        mainCharIndex = 0;
                    }
                    setBootText(mainCurrentText);
                } else {
                    clearInterval(mainBootInterval);
                    localStorage.setItem('SeenVesselBoot', 'true');
                    setTimeout(() => {
                        setBootPhase('loading');
                        startLoadingBar();
                    }, SYSTEM_CONFIG.BOOT_COMPLETE_DELAY);
                }
            }, SYSTEM_CONFIG.BOOT_MESSAGE_DELAY);
        };

        const startLoadingBar = () => {
            const loadingInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(loadingInterval);
                        setTimeout(() => setBootPhase('login'), 500);
                        return 100;
                    }
                    return Math.min(prev + Math.floor(Math.random() * (SYSTEM_CONFIG.LOADING_BAR_MAX_INC - SYSTEM_CONFIG.LOADING_BAR_MIN_INC + 1)) + SYSTEM_CONFIG.LOADING_BAR_MIN_INC, 100);
                });
            }, SYSTEM_CONFIG.LOADING_BAR_SPEED);
        };
    }, []);

    return {
        bootPhase,
        setBootPhase,
        tree98BootText,
        bootText,
        loadingProgress
    };
};