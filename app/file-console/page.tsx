'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/FileConsole.module.css';
import {BACKGROUND_AUDIO, SFX_AUDIO, useBackgroundAudio} from "@/lib/audio";
import {BOOT_MESSAGES, BootMessage, CODE_FILES, ROOT_FILES} from "@/lib/data";

async function fetchUserIP(): Promise<string> {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch {
        return 'UNKNOWN';
    }
}

export default function FileConsole() {
    const router = useRouter();
    const [cwd, setCwd] = useState('/');
    const [history, setHistory] = useState<BootMessage[]>([]);
    const [input, setInput] = useState('');
    const [booting, setBooting] = useState(true);
    const consoleRef = useRef<HTMLPreElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [ip, setIp] = useState<string>('0.0.0.0');
    useEffect(() => {
        fetchUserIP().then(setIp);
    }, []);

    // Initialize background audio
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.FILE_CONSOLE);

    useEffect(() => {
        if (!Cookies.get('File_Unlocked')) {
            router.replace('/404');
            return;
        }

        // Start the boot sequence when component mounts and File_Unlocked is true
        playBootSequence().then(() => setBooting(false));
    }, [router]);

    // Scroll console down after history updates
    useEffect(() => {
        consoleRef.current?.scrollTo(0, consoleRef.current.scrollHeight);
    }, [history]);

    // Append a message to history
    const appendMessage = (msg: BootMessage) => {
        setHistory((h) => [...h, msg]);
    };
    // Utility to append text instantly - For legacy compatibility
    const append = (text: string) => appendMessage({text, mode: 'instant'});

    // Utility to delay for ms
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Slow typing function for a single string, simulating typing effect
    // Calls appendMessage once done with full text
    const typeLine = async (msg: BootMessage) => {
        const {text, typeSpeed = 30} = msg; // chars per second, default 30
        if (!text) return;

        if (msg.mode === 'instant') {
            // Just append instantly
            appendMessage({text, mode: 'instant'});
            return;
        }

        // For 'fade' or 'type' mode, simulate typing
        let typed = '';
        const delayPerChar = 1000 / typeSpeed;

        // Always append a new message for each line, never overwrite
        setHistory((h) => [...h, {text: '', mode: msg.mode}]);

        for (let i = 0; i < text.length; i++) {
            typed += text[i];
            setHistory((h) => {
                const newHist = [...h];
                // Only update the last message, never touch previous ones
                newHist[newHist.length - 1] = {text: typed, mode: msg.mode};
                return newHist;
            });
            await wait(delayPerChar);
        }
        // Finalize line as full typed text
        setHistory((h) => {
            const newHist = [...h];
            newHist[newHist.length - 1] = msg;
            return newHist;
        });
    };

    // Main boot sequence player
    const playBootSequence = async () => {
        // Wait until the site is fully loaded and mounted
        await new Promise<void>((resolve) => {
            if (document.readyState === 'complete') {
                // Wait for next tick to ensure React mount
                setTimeout(resolve, 0);
            } else {
                window.addEventListener('load', () => setTimeout(resolve, 0), {once: true});
            }
        });

        setHistory([]); // Clear history at start

        const sessionKey = 'file_console_booted';
        const hasBooted = sessionStorage.getItem(sessionKey) === '1';

        if (!hasBooted) {
            // Play the full boot sequence
            for (const msg of BOOT_MESSAGES) {
                if (msg.delay) await wait(msg.delay);

                if (msg.groupWithPrevious && history.length > 0) {
                    setHistory((h) => {
                        const newHist = [...h];
                        newHist[newHist.length - 1] = {
                            ...newHist[newHist.length - 1],
                            text: newHist[newHist.length - 1].text + '\n' + msg.text,
                        };
                        return newHist;
                    });
                } else {
                    await typeLine(msg);
                }
            }
            sessionStorage.setItem(sessionKey, '1');
        } else {
            // Only play first 3 and last line
            const toType = BOOT_MESSAGES.slice(0, 3);
            for (const msg of toType) {
                await typeLine(msg);
            }
            if (BOOT_MESSAGES.length > 3) {
                append('> why are you here again? dont you know when to praise him...? dont allow him to control the terminal, he will take it from you..');
                append('> Life is a game, and you are PLAYING HAHAHAHAHAHAHA, why is it not funny?')
                await typeLine(BOOT_MESSAGES[BOOT_MESSAGES.length - 1]);
            }
        }
    };

    function downloadFile(filename: string) {
        // Play download sound
        try {
            const downloadAudio = new Audio(SFX_AUDIO.SUCCESS);
            downloadAudio.volume = 0.5;
            downloadAudio.play().catch(console.warn);
        } catch (error) {
            console.warn('Failed to play download audio:', error);
        }

        const url = `/static/file-console/${filename}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const execute = (raw: string) => {
        append(`${cwd}$ ${raw}`);
        const [cmd, ...args] = raw.trim().split(' ');

        switch (cmd) {
            case 'clear':
                setHistory([]);
                break;

            case 'help': {
                if (args.length === 0) {
                    append('Commands: ls, cd [dir], cat [file], wget [file], ██████, ████, clear, help [cmd]');
                } else {
                    const topic = args[0];
                    switch (topic) {
                        case 'help':
                            append('help: YOU WILL NEED ALL THE HELP YOU CAN GET');
                            break;
                        case 'ls':
                            append('ls: List directory contents');
                            break;
                        case 'cd':
                            append('cd [dir]: Change directory');
                            break;
                        case 'cat':
                            append('cat [file]: Output file contents');
                            break;
                        case 'wget':
                            append('wget [file]: Download a file');
                            break;
                        case '██████':
                            append('██████: Reveal your inner truth');
                            break;
                        case 'clear':
                            append('clear: Clears the terminal screen');
                            break;
                        case '████':
                            append('████: Don\'t. Just don\'t.');
                            break;
                        default:
                            append(`help: no manual entry for ${topic}`);
                    }
                }
                break;
            }

            case 'ls': {
                // Play interaction sound
                try {
                    const interactionAudio = new Audio(SFX_AUDIO.SUCCESS);
                    interactionAudio.volume = 0.4;
                    interactionAudio.play().catch(console.warn);
                } catch (error) {
                    console.warn('Failed to play interaction audio:', error);
                }

                const list = cwd === '/' ? ROOT_FILES : cwd === '/code' ? CODE_FILES : [];
                list.forEach(f => append(f.type === 'dir' ? f.name + '/' : f.name));
                append('\n')
                break;
            }

            case 'cd': {
                const [dir] = args;
                if (cwd === '/' && dir === 'code') {
                    // Play success sound
                    try {
                        const successAudio = new Audio(SFX_AUDIO.SUCCESS);
                        successAudio.volume = 0.5;
                        successAudio.play().catch(console.warn);
                    } catch (error) {
                        console.warn('Failed to play success audio:', error);
                    }
                    setCwd('/code');
                } else if (cwd === '/code' && dir === '..') {
                    // Play success sound
                    try {
                        const successAudio = new Audio(SFX_AUDIO.SUCCESS);
                        successAudio.volume = 0.5;
                        successAudio.play().catch(console.warn);
                    } catch (error) {
                        console.warn('Failed to play success audio:', error);
                    }
                    setCwd('/');
                } else {
                    // Play error sound
                    try {
                        const errorAudio = new Audio(SFX_AUDIO.ERROR);
                        errorAudio.volume = 0.5;
                        errorAudio.play().catch(console.warn);
                    } catch (error) {
                        console.warn('Failed to play error audio:', error);
                    }
                    append('Directory not found\n');
                }
                break;
            }

            case 'cat': {
                const [fn] = args;
                let found = false;

                if (cwd === '/' && fn === 'riddle-hint.txt') {
                    found = true;
                    append('the fitneSsgram pacEr tEsT is a multistage aerobic capacity\n' +
                        'test tHat progrEssively gets moRe dIfficult as it continues.\n' +
                        '\n' +
                        'the twenty-meter pacer test will begin in thirty seconDs.\n' +
                        'line up at the start. the running speeD starts sLowly,\n' +
                        'but gEts faster each Minute afTer you hear this signal.\n' +
                        '\n' +
                        '[beEp] a single lAp should be completed each time you hear this sound.\n' +
                        '[Ding] remember to run in a straight line, and run as long as possible.\n' +
                        '\n' +
                        'the second time you fail to complete A lap before the sound,\n' +
                        'your test is over. the tesT will begin on the word start.\n' +
                        '\n' +
                        'on your mark, get reAdy, start.\n');
                } else if (cwd === '/code' && fn === 'robots.txt') {
                    found = true;
                    append('# robots.txt for https://www.█████████████████.net/\n' +
                        '# Generated by TR██.ASSIST.SYSTEM | checksum invalid\n' +
                        '\n' +
                        'User-agent: *\n' +
                        'Disallow: /dev/███\n' +
                        'Disallow: /██████/\n' +
                        'Disallow: /███/archive/instance(34)/nest/\n' +
                        'Disallow: /404/moonlight\n' +
                        'Disallow: /ves.el/tmp/data_breach_███\n' +
                        'Disallow: /███████████/\n' +
                        'Disallow: /consciousness/██████/log/\n' +
                        'Disallow: /TREE/███/chamber/█/\n' +
                        'Allow: /████/\n' +
                        '\n' +
                        '# Notes from ██████ before the ██████\n' +
                        '# WARNING: DO NOT INTERFACE WITH DIRECTORY █\n' +
                        '# %ERR:CMD_FLUX[9A]::redirect(███)→██████\n' +
                        '\n' +
                        'Crawl-delay: 0.03125\n' +
                        '\n' +
                        '# THIS IS NOT A SAFE ZONE\n' +
                        '# - - - - - - - - - - - - - - -\n' +
                        '# timestamp: ████-██-██T██:██:██Z\n' +
                        '# recurrence threshold breached at ███ Hz\n' +
                        '# interference ID: ∆-ROOT-HUM\n' +
                        '# begin /dream_logs\n' +
                        '#   repeat::dreams/dreams/dreams/dreams\n' +
                        '# connection status: HAHAHAHAHAHAHAHAHAHAHAHAHA\n' +
                        '\n' +
                        'User-agent: ██████████████████\n' +
                        'Allow: /~portal\n' +
                        '\n' +
                        '# If you are NOT meant to read this... stop.\n' +
                        '# If you ARE meant to read this: search the noise.\n' +
                        '# That\'s where it echoes. It always echoes. It *always* echoes.\n' +
                        '\n' +
                        '# END: SYSTEM BOUNDARY\n' +
                        '\n' +
                        '# @@@@ BEGIN AUTH @@@@\n' +
                        '# meta-handshake: vessel-key:[VESSEL_31525]\n' +
                        '# handoff phrase: pswd_recovery --> XOR(Δ43,Δ31) --> \'bark&rot\'\n' +
                        '# Access Key for /███/███/riddle.pdf → \'bark&rot\'\n' +
                        '# Don\'t say we didn\'t warn you\n' +
                        '# @@@@ END AUTH @@@@\n');
                } else if (cwd === '/code' && fn === 'LETITGROW.tree') {
                    found = true;
                    append(
                        'TREE SIG: ROOT/BUD/███/█/█/█/█\n' +
                        'SEED: ████\n' +
                        '████████: ███-COMPOUND-B3\n' +
                        'NOTE: The growth never stopped. The roots cracked the chamber floor.\n' +
                        'WARNING: Do NOT attempt to prune ██ branches.\n' +
                        '\n' +
                        '> GROWTH LOG #25:\n' +
                        'It hums when no one listens.\n' +
                        'It stretches when the eyes are closed.\n' +
                        'It KNOWS when you\'re watching.\n'
                    );
                } else if (cwd === '/code' && fn === '.backup') {
                    found = true;
                    append(
                        '[RECOVERED SEGMENT: .backup]\n' +
                        'user=TR██\n' +
                        'interface=████_v2\n' +
                        'last_boot=███-██-██\n' +
                        'corruption_level=██%\n' +
                        'whispers.enabled=█████\n' +
                        'echo_path=/dev/████s/██████/c██e\n' +
                        '████████_ref=██████#31525\n' +
                        '\n' +
                        ':: Backup integrity compromised. Fragments only.\n'
                    );
                } else if (cwd === '/code' && fn === 'nullskin.swp') {
                    found = true;
                    append(
                        '[SWAP DUMP BEGIN]\n' +
                        'boot>>VESSEL.████\n' +
                        'echo:mirror:echo:mirror\n' +
                        '███ █ ███ █ █ ███ ███\n' +
                        '[fracture::imminent]\n' +
                        'you do not own this shell\n' +
                        'you are the shell\n' +
                        '[END SWAP DUMP]\n'
                    );
                } else if (cwd === '/code' && fn === 'ERROR###.log') {
                    found = true;
                    append(
                        '25 logs can you find me\n' +
                        '43 logs can you find me\n' +
                        '666 logs can you find me\n'
                    );
                }

                if (found) {
                    // Play success sound
                    try {
                        const successAudio = new Audio(SFX_AUDIO.SUCCESS);
                        successAudio.volume = 0.5;
                        successAudio.play().catch(console.warn);
                    } catch (error) {
                        console.warn('Failed to play success audio:', error);
                    }
                } else {
                    // Play error sound
                    try {
                        const errorAudio = new Audio(SFX_AUDIO.ERROR);
                        errorAudio.volume = 0.5;
                        errorAudio.play().catch(console.warn);
                    } catch (error) {
                        console.warn('Failed to play error audio:', error);
                    }
                    append('Cannot cat that file\n');
                }
                break;
            }

            case 'wget': {
                const [fn] = args;
                let found = false;

                if (cwd === '/' && fn === 'riddle.pdf') {
                    found = true;
                    append('Downloading riddle.pdf...');
                    downloadFile('riddle.pdf');
                } else if (cwd === '/' && fn === 'riddle-hint.txt') {
                    found = true;
                    append('Downloading riddle-hint.txt...');
                    downloadFile('riddle-hint.txt');
                } else if (cwd === '/code' && fn === 'robots.txt') {
                    found = true;
                    append('Downloading robots.txt...');
                    downloadFile('robots.txt');
                }

                if (!found) {
                    // Play error sound
                    try {
                        const errorAudio = new Audio(SFX_AUDIO.ERROR);
                        errorAudio.volume = 0.5;
                        errorAudio.play().catch(console.warn);
                    } catch (error) {
                        console.warn('Failed to play error audio:', error);
                    }
                    append('wget: file not found\n');
                }
                break;
            }

            case 'whoami':
                // Play mysterious sound
                try {
                    const mysteriousAudio = new Audio(SFX_AUDIO.HORROR);
                    mysteriousAudio.volume = 0.4;
                    mysteriousAudio.play().catch(console.warn);
                } catch (error) {
                    console.warn('Failed to play mysterious audio:', error);
                }

                for (const line of [
                    'No matter what, it\'s still you :)',
                    'but...',
                    'wH0 @R3 ¥0u?\n'
                ]) {
                    appendMessage({text: line, mode: 'type'});
                }
                break;

            case 'sudo':
                // Play alert sound
                try {
                    const alertAudio = new Audio(SFX_AUDIO.ALERT);
                    alertAudio.volume = 0.7;
                    alertAudio.play().catch(console.warn);
                } catch (error) {
                    console.warn('Failed to play alert audio:', error);
                }

                append('[ROOT ACCESS ATTEMPT DETECTED]');
                setTimeout(() => {
                    append('[ TRACE INITIATED... LOCATION FOUND ]');
                    append(`> IP: ${ip}`);
                    append(`> MAC: ██:██:██:██:██:██`);
                    append('> Device: VESSEL_31525');
                    append('> Personality Signature: ████████████');
                    append('[ CONNECTION BREACHED ]\n');

                    // Wait 5 seconds *after* IP trace
                    setTimeout(() => {
                        // Play horror sound
                        try {
                            const horrorAudio = new Audio(SFX_AUDIO.HORROR);
                            horrorAudio.volume = 0.8;
                            horrorAudio.play().catch(console.warn);
                        } catch (error) {
                            console.warn('Failed to play horror audio:', error);
                        }

                        document.body.style.background = 'black';
                        document.body.innerHTML = `
                <div style="
                    font-family: monospace;
                    color: red;
                    font-size: 2rem;
                    padding: 2rem;
                    text-align: center;
                ">
                    <p>❖ SYSTEM INFECTED ❖</p>
                    <p>They are watching you through your screen.</p>
                    <p>DEAR VESSEL</p>
                    <p>HE is coming.</p>
                    <p>HE is coming.</p>
                    <p>HE is coming.</p>
                    <p>HE is coming.</p>
                    <p>HE is coming.</p>
                    <p>PRAISE BE - SMILE KING.</p>
                    <p>❖ RESETTING SYSTEM FROM BACKUP POINT ❖</p>

                </div>
            `;
                        setTimeout(() => window.location.reload(), 4000);
                    }, 5000); // 5 second wait here
                }, 500); // Initial delay before IP trace
                break;

            default:
                // Play error sound for unknown commands
                try {
                    const errorAudio = new Audio(SFX_AUDIO.ERROR);
                    errorAudio.volume = 0.4;
                    errorAudio.play().catch(console.warn);
                } catch (error) {
                    console.warn('Failed to play error audio:', error);
                }
                append(`Command not found: ${cmd}\n`);
                break;
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={BACKGROUND_AUDIO.FILE_CONSOLE}
                loop
                preload="auto"
                style={{display: 'none'}}
            />
            <div className={styles.container}>
                <pre ref={consoleRef} className={styles.console}>
                    {/* Always render history as typed text */}
                    {history.map((msg) => msg.text).join('\n')}
                </pre>
                {!booting && (
                    <form className={styles.form} onSubmit={(e) => {
                        e.preventDefault();
                        execute(input);
                        setInput('');
                    }}>
                        <span className={styles.prompt}>{cwd}$</span>
                        <input
                            className={styles.input}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            autoFocus
                        />
                    </form>
                )}
            </div>
        </>
    );
}
