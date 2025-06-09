'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../../styles/FileConsole.module.css';

async function fetchUserIP(): Promise<string> {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch {
        return 'UNKNOWN';
    }
}


type Dirent = { name: string; type: 'file' | 'dir'; };
const DUMMY_FILES: Dirent[] = Array.from({length: 6}, (_, i) => ({
    name: `broken_shadow${i + 1}${Math.random() > 0.5 ? '.bin' : ''}`,
    type: Math.random() > 0.4 ? 'file' : 'dir'
}));

const ROOT_FILES: Dirent[] = [
    {name: 'riddle.pdf', type: 'file'},
    {name: 'riddle-hint.txt', type: 'file'},
    {name: 'code', type: 'dir'},
    ...DUMMY_FILES
];

const CODE_FILES: Dirent[] = [
    {name: 'robots.txt', type: 'file'},
    {name: 'LETITGROW.tree', type: 'file'},
    {name: '.backup', type: 'file'},
    {name: 'nullskin.swp', type: 'file'},
    {name: 'tmp_env/', type: 'dir'},
    {name: 'ERROR###.log', type: 'file'}
];

export default function FileConsole() {
    const router = useRouter();
    const [cwd, setCwd] = useState('/');
    const [history, setHistory] = useState<string[]>([
        '> FACILITY 3.15.25 BOOT SYSTEM [OK]',
        '> Mounting /dev/TREE',
        '> Syncing consciousness...',
        '> Establishing dream-link...',
        '> [TR33] AUTHORITY OVERRIDE DETECTED',
        '> Welcome, VESSEL_31525\n'
    ]);
    const [input, setInput] = useState('');
    const [booting, setBooting] = useState(true);
    const consoleRef = useRef<HTMLPreElement>(null);

    const [ip, setIp] = useState<string>('0.0.0.0');
    useEffect(() => {
        fetchUserIP().then(setIp);
    }, []);

    useEffect(() => {
        if (!Cookies.get('File_Unlocked')) {
            router.replace('/404');
            return;
        }
        setTimeout(() => setBooting(false), 3000);
    }, [router]);

    const append = (line: string) => {
        setHistory((h) => [...h, line]);
        setTimeout(() => consoleRef.current?.scrollTo(0, consoleRef.current.scrollHeight), 0);
    };

    const slowType = async (lines: string[], delay = 300) => {
        for (const line of lines) {
            await new Promise(r => setTimeout(r, delay));
            append(line);
        }
    };

    function downloadFile(filename: string) {
        const url = `/file-console/${filename}`;
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
                            append('████: Don’t. Just don’t.');
                            break;
                        default:
                            append(`help: no manual entry for ${topic}`);
                    }
                }
                break;
            }

            case 'ls': {
                const list = cwd === '/' ? ROOT_FILES : cwd === '/code' ? CODE_FILES : [];
                list.forEach(f => append(f.type === 'dir' ? f.name + '/' : f.name));
                append('\n')
                break;
            }

            case 'cd': {
                const [dir] = args;
                if (cwd === '/' && dir === 'code') setCwd('/code');
                else if (cwd === '/code' && dir === '..') setCwd('/');
                else append('Directory not found\n');
                break;
            }

            case 'cat': {
                const [fn] = args;
                if (cwd === '/' && fn === 'riddle-hint.txt') {
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
                    append('# robots.txt for http://www.█████████████████.net/\n' +
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
                        '# That’s where it echoes. It always echoes. It *always* echoes.\n' +
                        '\n' +
                        '# END: SYSTEM BOUNDARY\n' +
                        '\n' +
                        '# @@@@ BEGIN AUTH @@@@\n' +
                        '# meta-handshake: vessel-key:[VESSEL_31525]\n' +
                        '# handoff phrase: pswd_recovery --> XOR(Δ43,Δ31) --> \'bark&rot\'\n' +
                        '# Access Key for /███/███/riddle.pdf → \'bark&rot\'\n' +
                        '# Don’t say we didn’t warn you\n' +
                        '# @@@@ END AUTH @@@@\n');
                } else if (cwd === '/code' && fn === 'LETITGROW.tree') {
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
                        'It KNOWS when you’re watching.\n'
                    );
                } else if (cwd === '/code' && fn === '.backup') {
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
                    append(
                        '25 logs can you find me\n' +
                        '43 logs can you find me\n' +
                        '666 logs can you find me\n'
                    );
                } else {
                    append('Cannot cat that file\n');
                }
                break;
            }

            case 'wget': {
                const [fn] = args;
                if (cwd === '/' && fn === 'riddle.pdf') {
                    append('Downloading riddle.pdf...');
                    downloadFile('riddle.pdf');
                } else if (cwd === '/' && fn === 'riddle-hint.txt') {
                    append('Downloading riddle-hint.txt...');
                    downloadFile('riddle-hint.txt');
                } else if (cwd === '/code' && fn === 'robots.txt') {
                    append('Downloading robots.txt...');
                    downloadFile('robots.txt');
                } else {
                    append('wget: file not found\n');
                }
                break;
            }

            case 'whoami':
                slowType([
                    'No matter what, it’s still you :)',
                    'but...',
                    'wH0 @R3 ¥0u?\n'
                ]).catch(error => {
                    console.error('Error caught:', error);
                });
                break;
            case 'sudo':
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
                    <p>VESSEL ID: <span style="color:white">#31525</span></p>
                    <p>HE is coming.</p>
                    <p>HE is coming.</p>
                    <p>HE is coming.</p>
                    <p>HE is coming.</p>
                    <p>HE is coming.</p>
                    <p>PRAISE BE - SMILE KING.</p>
                    <p>❖ RESETTING SYSTEM FROM BACKUP POINT ❖</p>

                </div>
            `;
                        const scream = new Audio('/sounds/scream.mp3');
                        scream.play().catch(() => {
                        });
                        setTimeout(() => window.location.reload(), 4000);
                    }, 5000); // 5 second wait here
                }, 500); // Initial delay before IP trace
                break;
        }
    };

    return (
        <div className={styles.container}>
            <pre ref={consoleRef} className={styles.console}>
                {booting ? 'Booting...\n' : history.join('\n')}
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
    );
}
