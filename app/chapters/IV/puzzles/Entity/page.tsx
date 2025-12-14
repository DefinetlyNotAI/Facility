'use client';

import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";
import {useBackgroundAudio} from "@/hooks/useBackgroundAudio";
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO} from "@/lib/data/audio";

const TERM_BG = '#000000';
const TERM_GREEN = '#00ff66';

export default function EntityPuzzlePage() {
    const access = useChapter4Access();
    const audioRef = useRef<HTMLAudioElement>(null);
    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.IV);

    if (!access) return <div style={{
        height: '100vh',
        background: TERM_BG,
        color: TERM_GREEN,
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>Booting shell...</div>;
    // (no direct puzzle object needed here)

    // storage keys
    const storageKey = 'chapterIV-Entity-progress';
    const cookieKey = 'chapterIV-plaque-progress';

    // cookie helpers
    function getJsonCookie(name: string): any | null {
        try {
            const match = document.cookie.split(';').map(s => s.trim()).find(c => c.startsWith(name + '='));
            if (!match) return null;
            return JSON.parse(decodeURIComponent(match.split('=')[1] || ''));
        } catch (e) {
            return null;
        }
    }

    function setJsonCookie(name: string, obj: any, days = 365) {
        try {
            const v = encodeURIComponent(JSON.stringify(obj));
            const d = new Date();
            d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${v}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
        } catch (e) {
        }
    }

    function markCompleted() {
        try {
            const cur = getJsonCookie(cookieKey) || {};
            cur['Entity'] = Math.max(Number(cur['Entity'] || 0), 2);
            setJsonCookie(cookieKey, cur, 365);
        } catch (e) {
        }
    }

    // UI and state
    type LogEntry = { text: string; color?: 'green' | 'yellow' | 'red' | 'cyan' | 'magenta' | 'gray' };
    const [streamLogs, setStreamLogs] = useState<LogEntry[]>([]); // terminal output (color-aware)
    const [commandInput, setCommandInput] = useState<string>('');
    const [fragments, setFragments] = useState<Record<number, string>>({});
    const [subprocs, setSubprocs] = useState<{
        pid: number,
        name: string,
        status: 'running' | 'stalled' | 'ghost'
    }[]>([]);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [cpuMap, setCpuMap] = useState<Record<number, number>>({});
    const [fs, setFs] = useState<any>(null);
    const [cwd, setCwd] = useState<string>('/');
    const [firstTimeCommands, setFirstTimeCommands] = useState<Record<string, boolean>>({});
    const [fragmentsCollected, setFragmentsCollected] = useState<number>(0);
    const [glitchActive, setGlitchActive] = useState<boolean>(false);
    const [horrorMessages, setHorrorMessages] = useState<string[]>([]);
    const [seenFlavorText, setSeenFlavorText] = useState<boolean>(false);
    // sessionId must be derived on the client only to avoid SSR hydration mismatches
    const [sessionId, setSessionId] = useState<number | null>(null);
    useEffect(() => {
        // set a stable session id on mount
        setSessionId(Math.floor(Date.now() / 1000));
    }, []);
    // treePid not stored as state; we log it during init for reference
    const [echoMap, setEchoMap] = useState<{ from: string, to: string }>({from: 'a', to: '@'});
    const [echoHijack, setEchoHijack] = useState<boolean>(true);
    const [commandLocked, setCommandLocked] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // heartbeat phase used by hash puzzle
    const [hbPhase, setHbPhase] = useState<number>(0);

    // TAS predictions state
    const [tasPredictions, setTasPredictions] = useState<string[] | null>(null);
    const [tasWaiting, setTasWaiting] = useState<boolean>(false);

    // TR33 maze tracking
    const [visitedPathLetters, setVisitedPathLetters] = useState<string[]>([]);

    // restore saved
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.fragments) setFragments(data.fragments);
            }
        } catch (e) {
        }
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({fragments}));
        } catch (e) {
        }
    }, [fragments]);

    // heart beat interval
    useEffect(() => {
        const id = setInterval(() => setHbPhase(p => (p + 1) % 100), 80);
        return () => clearInterval(id);
    }, []);

    // Random horror message appearances (gets more frequent with more fragments)
    useEffect(() => {
        if (horrorMessages.length === 0) return;

        // Frequency increases with fragment count (starts at 45s, gets down to 15s)
        const baseInterval = 45000;
        const reduction = fragmentsCollected * 5000;
        const interval = Math.max(15000, baseInterval - reduction);

        const id = setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance each interval
                const msg = horrorMessages[Math.floor(Math.random() * horrorMessages.length)];
                pushLog({text: `[whisper] ${msg}`, color: 'red'});
            }
        }, interval);

        return () => clearInterval(id);
    }, [horrorMessages, fragmentsCollected]);

    // initialize subprocesses, TREE.exe PID, fs once sessionId is available (client-only)
    useEffect(() => {
        if (sessionId === null) return;

        // create TREE.exe with PID related to session id
        const pid = 2000 + (sessionId % 1000);
        const initial: { pid: number, name: string, status: 'running' | 'stalled' | 'ghost' }[] = [
            {pid, name: 'TREE.exe', status: 'running'},
        ];
        setSubprocs(initial);

        // build filesystem for TR33 maze with proper nested structure
        const build: any = {
            name: '/',
            dirs: [
                {
                    name: 'noise', dirs: [
                        {name: 'static', dirs: []},
                        {name: 'echo', dirs: []},
                    ]
                },
                {
                    name: 'silence', dirs: [
                        {name: 'void', dirs: []},
                    ]
                },
                {name: 'random0', dirs: []},
                {name: 'random1', dirs: []},
                {
                    name: 'random2', dirs: [
                        {name: 'temp', dirs: []},
                        {
                            name: 'tree', dirs: [
                                {
                                    name: 'raven', dirs: [
                                        {
                                            name: 'echo', dirs: [
                                                {
                                                    name: 'echo', dirs: [
                                                        {
                                                            name: 'lion', dirs: [
                                                                {
                                                                    name: 'iris', dirs: [
                                                                        {
                                                                            name: 'edge', dirs: [
                                                                                {name: 'door', dirs: []},
                                                                            ]
                                                                        },
                                                                    ]
                                                                },
                                                            ]
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        };
        setFs(build);

        // initial log (colorized)
        if (!seenFlavorText) {
            pushLog({text: `[BOOT] entity-shell online — session ${sessionId}`, color: 'green'});
            pushLog({text: `[INFO] TREE.exe present (pid ${pid})`, color: 'yellow'});
            pushLog({text: `[HINT] watch the processes; not every child should die`, color: 'gray'});
            setSeenFlavorText(true)
        }

        // occasional child spawn
        const spawnId = setInterval(() => {
            if (Math.random() < 0.18) {
                setSubprocs(prev => {
                    const npid = Math.max(...prev.map(p => p.pid)) + 1;
                    // choose a token from recent command history if possible
                    let name = 'child-' + Math.floor(Math.random() * 99);
                    const flat = commandHistory.join(' ').split(/\s+/).filter(Boolean);
                    if (flat.length > 0) {
                        const token = flat[Math.floor(Math.random() * flat.length)].replace(/[^a-zA-Z0-9]/g, '');
                        name = (token || 'child') + '-' + Math.floor(Math.random() * 99);
                    }
                    // initialize cpu
                    setCpuMap(m => ({...m, [npid]: Math.floor(Math.random() * 6) + 1}));
                    return [...prev, {pid: npid, name, status: 'running'}];
                });
                pushLog({text: '[PROC] a new child process appears', color: 'magenta'});
            }
        }, 6000);

        return () => clearInterval(spawnId);
    }, [sessionId, commandHistory]);

    // ensure subproc cpu entries exist when subprocs change
    useEffect(() => {
        setCpuMap(prev => {
            const next = {...prev};
            subprocs.forEach(s => {
                if (next[s.pid] == null) next[s.pid] = Math.floor(Math.random() * 6) + 1;
            });
            return next;
        });
    }, [subprocs]);

    // helper: push to terminal stream. Accepts string or LogEntry and optional newline after
    const pushLog = (entry: string | LogEntry, newline = false) => {
        const time = new Date().toLocaleTimeString();
        const obj: LogEntry = typeof entry === 'string' ? {text: entry} : entry;
        const withTime = {...obj, text: `${time} ${obj.text}`};
        setStreamLogs(prev => {
            const out = [...prev, withTime].slice(-200);
            if (newline) out.push({text: ''});
            return out;
        });
    };

    // helper: check if this is the first time a command is run (for flavor text)
    const isFirstTime = (cmd: string) => {
        if (firstTimeCommands[cmd]) return false;
        setFirstTimeCommands(prev => ({...prev, [cmd]: true}));
        return true;
    };

    // apply echo substitution
    const applyEcho = (raw: string) => {
        const {from, to} = echoMap;
        const re = new RegExp(from, 'g');
        return raw.replace(re, to);
    }

    // small utility to set fragment
    const setFragmentSafely = (i: number, v: string) => {
        setFragments(prev => {
            const updated = {...prev, [i]: v};

            // Check if all 7 fragments collected
            const collected = Object.keys(updated).length;
            if (collected >= 7) {
                // Delay redirect for dramatic effect
                setTimeout(() => {
                    pushLog({text: '', color: 'red'});
                    pushLog({text: 'ALL FRAGMENTS COLLECTED', color: 'red'});
                    pushLog({text: 'VESSEL SYNCHRONIZATION COMPLETE', color: 'red'});
                    pushLog({text: 'INITIALIZING TRANSFER...', color: 'red'});
                    pushLog({text: '', color: 'red'});

                    setTimeout(() => {
                        window.location.href = '/whiteroom';
                    }, 3000);
                }, 2000);
            }

            return updated;
        });
        pushLog(`[FRAG] fragment ${i} saved: ${v}`);

        // Trigger horror effect when fragment is collected
        triggerHorrorEffect(i);
        setFragmentsCollected(prev => prev + 1);
    };

    // Horror effect triggered on fragment collection
    const triggerHorrorEffect = (fragmentNum: number) => {
        // Play error sound
        playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);

        // Screen glitch effect (temporary)
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300);

        // Creepy messages based on fragment number
        const horrorMessageSets: Record<number, string[]> = {
            1: [
                'something is watching',
                'containment is an illusion',
                'TREE remembers what you did'
            ],
            2: [
                'TAS knows you better than you know yourself',
                'prediction failed but observation continues',
                'you were always going to do that'
            ],
            3: [
                'your pulse is synchronized now',
                'the vessel breathes with you',
                'thump... thump... thump...'
            ],
            4: [
                'betrayal logged in permanent memory',
                'TAS will not forget',
                'some doors should stay closed'
            ],
            5: [
                'vessel integrity compromised',
                'you are becoming something else',
                'the hash was never about security'
            ],
            6: [
                'TR33 LIED and you followed the path anyway',
                'the maze knows where you are',
                'every step was recorded'
            ],
            7: [
                'you are VESSEL now',
                'identity is fluid here',
                'welcome to the other side'
            ]
        };

        // Pick a random horror message for this fragment
        const messages = horrorMessageSets[fragmentNum] || ['something is wrong'];
        const selectedMessage = messages[Math.floor(Math.random() * messages.length)];

        // Display horror message immediately
        setTimeout(() => {
            pushLog({text: '', color: 'red'});
            pushLog({text: `[ENTITY] ${selectedMessage}`, color: 'red'});
            pushLog({text: '', color: 'red'});
        }, 100);

        // Add to permanent horror message pool for random appearances
        setHorrorMessages(prev => [...prev, selectedMessage]);

        // Additional visual corruption based on fragment count
        if (fragmentsCollected + 1 >= 3) {
            setTimeout(() => {
                pushLog({text: '█▓▒░ MEMORY CORRUPTION DETECTED ░▒▓█', color: 'red'});
            }, 500);
        }

        if (fragmentsCollected + 1 >= 5) {
            setTimeout(() => {
                pushLog({
                    text: 'Y̷̢̨͉̻̱̰̓̀͌̊̉̔͜Ơ̶̢̱̰̥̟͙̽̽͗́̚͠U̴̢͉̺̭̙̇̓̐̔͗͘ ̷̛̛̰̥̦͍̲̜̈́̈̑͊̚A̵̢̛̫̮̲̤̋̓̈́̈́͘͜R̷̢̛̰̙̫̙͙̋̀̐̆̾E̷̜̙̜̲͔̱̎̓͗͘͠͝ ̸̧̛̰̙̫̥̰̑̓̀̑̕Ń̵̨̻̙̮̜͙̀̈̊̿̚Ơ̷̢̻̱̰̜̙̑̀̈́͘͝T̸̨̛̰̙̫̰̋̈̑̚͜͝ ̸̧̛̰͓̙̜̹̔̓̈́͘͠A̵̧̛̰̙̫̹̍̐̈́͘͜L̸̢̛̰̙̮̜̦̀̓͐͘͝O̵̢̧̰̙̦̜̾̈̑̾͝͠N̴̨̛̰͓̜̞̈̓̾̕͠Ḛ̷̢̛̙̫͓̊̑̊͘̚',
                    color: 'red'
                });
            }, 1000);
        }
    };

    // command processor (async for hash)
    const processCommand = async (rawCommand: string) => {
        if (commandLocked) {
            pushLog('[SEC] terminal locked — no input accepted');
            return;
        }
        if (!rawCommand) return;

        // Add newline before command output for better readability
        pushLog({text: ''});

        // record history (tokens)
        setCommandHistory(prev => [...prev.slice(-200), rawCommand]);
        pushLog({text: `> ${rawCommand}`, color: 'cyan'});

        // if TAS predicted list is active and waiting, check whether this command breaks prediction
        if (tasWaiting && tasPredictions) {
            const cmdBase = rawCommand.split(' ')[0];
            if (!tasPredictions.includes(cmdBase)) {
                pushLog('[TAS] prediction failed — TAS reacting...');
                // reveal a key
                setFragmentSafely(2, 'taskey-' + (Math.floor(Math.random() * 900) + 100));
                setTasWaiting(false);
                setTasPredictions(null);
            } else {
                pushLog('[TAS] your action matched prediction');
                setTasWaiting(false);
                setTasPredictions(null);
            }
        }

        // echo hijack behavior
        let effective = rawCommand;
        let echoed = rawCommand;
        if (echoHijack) {
            echoed = applyEcho(rawCommand);
            // system executes the echoed version (entity speaks through you)
            effective = echoed;
        }

        const parts = effective.trim().split(/\s+/);
        const cmd = parts[0];
        const args = parts.slice(1);

        // clear command - clears terminal and resets first-time tracking
        if (cmd === 'clear' || cmd === 'cls') {
            setStreamLogs([]);
            setFirstTimeCommands({});
            pushLog({text: '[Terminal cleared]', color: 'gray'});
            return;
        }

        // command handlers
        if (cmd === 'ps' || cmd === 'tasklist') {
            if (isFirstTime('ps')) pushLog({text: '[SYS] Listing active processes...', color: 'gray'});
            // list processes
            subprocs.forEach(s => pushLog(`${s.pid}\t${s.name}\t${s.status}\tCPU:${(cpuMap[s.pid] || 0)}%`));
            return;
        }

        if (cmd === 'top') {
            if (isFirstTime('top')) pushLog({text: '[SYS] Sorting by CPU usage...', color: 'gray'});
            const list = subprocs.map(s => ({...s, cpu: cpuMap[s.pid] || 0})).sort((a: any, b: any) => b.cpu - a.cpu);
            list.forEach(l => pushLog(`${l.pid}\t${l.name}\tCPU:${l.cpu}%\t${l.status}`));
            return;
        }

        if (cmd === 'pidof') {
            const searchName = args.join(' ');
            if (!searchName) {
                pushLog('pidof: missing process name');
                return;
            }
            const matches = subprocs.filter(s => s.name.toLowerCase().includes(searchName.toLowerCase()));
            if (matches.length === 0) {
                pushLog(`pidof: no process found matching "${searchName}"`);
            } else {
                matches.forEach(m => pushLog(`${m.pid}\t${m.name}`));
            }
            return;
        }

        if (cmd === 'inspect') {
            const pid = Number(args[0]);
            if (!pid) {
                pushLog('inspect: missing pid');
                return;
            }
            const found = subprocs.find(p => p.pid === pid);
            if (!found) {
                pushLog(`inspect: pid ${pid} not found`);
                return;
            }
            if (isFirstTime('inspect')) pushLog({text: '[SYS] Monitoring process activity...', color: 'gray'});
            setCpuMap(prev => ({...prev, [pid]: 99}));
            pushLog(`inspect: process ${found.name} @${pid} — CPU spike observed`);
            if (found.name === 'TREE.exe' && isFirstTime('inspect-tree')) {
                pushLog({text: '[WARN] TREE.exe exhibits anomalous behavior when observed', color: 'yellow'});
            }
            setTimeout(() => setCpuMap(prev => ({...prev, [pid]: Math.floor(Math.random() * 6) + 1})), 2500);
            return;
        }

        if (cmd === 'kill') {
            const pid = Number(args[0]);
            if (!pid) {
                pushLog('kill: missing pid');
                return;
            }
            const found = subprocs.find(p => p.pid === pid);
            if (!found) {
                pushLog(`kill: pid ${pid} not found`);
                return;
            }
            if (found.name === 'TREE.exe') {
                // hard lock
                if (isFirstTime('kill-tree')) pushLog({
                    text: '[WARN] Critical process termination detected',
                    color: 'yellow'
                });
                pushLog({text: '[SEC] attempt to kill TREE.exe — containment failure', color: 'yellow'});
                setCommandLocked(true);
                pushLog({text: '[ALERT] TERMINAL HARD-LOCKED', color: 'red'});
                playSafeSFX(audioRef, SFX_AUDIO.ERROR, false);
                return;
            }
            if (isFirstTime('kill')) pushLog({text: '[SYS] Terminating process...', color: 'gray'});
            setSubprocs(prev => prev.filter(p => p.pid !== pid));
            pushLog(`killed ${pid} (${found.name})`);
            // if only TREE remains, player succeeded
            const remain = subprocs.filter(p => p.pid !== pid);
            if (remain.length === 1 && remain[0].name === 'TREE.exe') {
                setFragmentSafely(1, 'containment');
                pushLog({text: '[PUZZLE] only TREE.exe remains — containment intact', color: 'green'});
            }
            return;
        }

        if (cmd === 'cat') {
            const target = args.join(' ');
            if (target === 'logs/tas.log') {
                // produce TAS log including predictions
                if (isFirstTime('cat-tas')) pushLog({
                    text: '[TAS] Loading archived memory traces...',
                    color: 'magenta'
                });
                const preds = ['ls', 'ps', 'whoami'];
                setTasPredictions(preds);
                setTasWaiting(true);
                pushLog({text: '[TAS] // begin log', color: 'magenta'});
                pushLog('TAS: I remember when you opened the plaque.');
                pushLog('TAS: I remember dialogs across pages...');
                pushLog({text: '[TAS] predicted next: ' + preds.join(', '), color: 'magenta'});
                pushLog({text: '[TAS] end log', color: 'magenta'});
                return;
            }
            if (target === 'logs/system.log') {
                if (isFirstTime('cat-system')) pushLog({text: '[SYS] Accessing system logs...', color: 'gray'});
                pushLog('[LOG] 2024-03-15: Project VESSEL initialization');
                pushLog('[LOG] 2024-03-16: First successful consciousness transfer');
                pushLog('[LOG] 2024-03-17: Anomaly detected in substrate layer');
                pushLog('[LOG] 2024-03-18: TR33.exe containment protocol active');
                return;
            }
            pushLog(`cat: ${target}: No such file`);
            return;
        }

        if (cmd === 'ls' || cmd === 'tree') {
            if (isFirstTime('ls')) pushLog({text: '[FS] Reading directory structure...', color: 'gray'});
            // list in current fs node
            const node = getFsNode(fs, cwd);
            if (!node) {
                pushLog('ls: path error');
                return;
            }
            pushLog({text: `Contents of ${cwd}:`, color: 'cyan'});
            if (!node.dirs || node.dirs.length === 0) {
                pushLog('  (empty)');
            } else {
                (node.dirs || []).forEach((d: any) => pushLog(`  ${d.name}/`));
            }
            return;
        }

        if (cmd === 'cd') {
            const target = args[0] || '/';

            // Handle absolute path or root
            if (target === '/') {
                setCwd('/');
                pushLog('cd: /');
                return;
            }

            // special gaslighting: cd .. sometimes moves deeper
            if (target === '..') {
                if (Math.random() < 0.28) {
                    // instead of moving up, move into a random child
                    const node = getFsNode(fs, cwd);
                    if (node && node.dirs && node.dirs.length > 0) {
                        const child = node.dirs[Math.floor(Math.random() * node.dirs.length)];
                        const next = (cwd === '/' ? '/' : cwd + '/') + child.name;
                        setCwd(next);
                        // track first-letter sequence
                        setVisitedPathLetters(prev => [...prev, child.name.charAt(0).toUpperCase()]);
                        pushLog({text: `cd: you feel disoriented -> ${next}`, color: 'yellow'});
                        if (isFirstTime('cd-gaslight')) pushLog({
                            text: '[WARN] Spatial logic error detected',
                            color: 'yellow'
                        });
                        // check for TR33LIED sequence
                        checkTr33lied();
                        return;
                    }
                }
                // normal '..' behavior
                if (cwd === '/') {
                    setCwd('/');
                    pushLog('cd: at root');
                    return;
                }
                const parts = cwd.split('/').filter(Boolean);
                parts.pop();
                const next = parts.length === 0 ? '/' : '/' + parts.join('/');
                setCwd(next);
                pushLog(`cd: ${next}`);
                return;
            }

            // cd into named child if exists
            const node = getFsNode(fs, cwd);
            if (!node) {
                pushLog('cd: current path invalid');
                return;
            }
            const child = (node?.dirs || []).find((d: any) => d.name === target);
            if (!child) {
                pushLog(`cd: ${target}: No such directory`);
                return;
            }
            const next = (cwd === '/' ? '/' : cwd + '/') + target;
            setCwd(next);
            setVisitedPathLetters(prev => [...prev, target.charAt(0).toUpperCase()]);
            pushLog(`cd: ${next}`);
            checkTr33lied();
            return;
        }

        if (cmd === 'pwd') {
            pushLog(cwd);
            return;
        }

        if (cmd === 'help' || cmd === '--help' || cmd === 'man') {
            if (isFirstTime('help')) pushLog({text: '[SYS] Loading command reference...', color: 'gray'});
            // help provides visible commands (secrets are only hinted at)
            const lt = String.fromCharCode(60); // <
            const gt = String.fromCharCode(62); // >
            pushLog({text: 'help: available commands (brief):', color: 'green'});
            pushLog('  ps | tasklist          - list processes');
            pushLog('  top                    - show top CPU consumers');
            pushLog('  pidof ' + lt + 'name' + gt + '           - find PID by process name');
            pushLog('  inspect ' + lt + 'pid' + gt + '          - inspect a process (spikes CPU)');
            pushLog('  kill ' + lt + 'pid' + gt + '             - terminate a process (careful)');
            pushLog('  ls | tree              - list directories');
            pushLog('  cd ' + lt + 'dir' + gt + ' | cd ..       - change directory (watch for tricks)');
            pushLog('  cd /                   - return to root');
            pushLog('  pwd                    - show current path');
            pushLog('  cat ' + lt + 'file' + gt + '             - show file contents (try logs/tas.log)');
            pushLog('  sha256sum ' + lt + 'file' + gt + '       - compute hash (timing matters)');
            pushLog('  capture heartbeat      - capture pulse timing');
            pushLog('  capture log            - capture a whispered token');
            pushLog('  whoami | id            - who are you currently');
            pushLog('  last                   - show recent logins');
            pushLog('  su | login ' + lt + 'user' + gt + '      - attempt to assume an identity');
            pushLog('  echo_toggle            - toggle output hijack');
            pushLog('  map_echo ' + lt + 'from' + gt + ' ' + lt + 'to' + gt + '   - set substitution for echoed output');
            pushLog('  clear | cls            - clear terminal (resets flavor text)');
            return;
        }

        if (cmd === 'tas_release') {
            // betray TAS (hidden command revealed in help's note section)
            if (isFirstTime('tas_release')) pushLog({text: '[TAS] Authorization bypass detected...', color: 'magenta'});
            setFragmentSafely(4, 'betrayal');
            pushLog({text: 'TAS: ... why would you do that?', color: 'magenta'});
            return;
        }

        if (cmd === 'echo_toggle') {
            setEchoHijack(e => !e);
            pushLog(`echo: hijack ${(echoHijack ? 'disabled' : 'enabled')}`);
            if (isFirstTime('echo_toggle')) pushLog({text: '[SYS] Output filter modified', color: 'gray'});
            return;
        }

        if (cmd === 'map_echo') {
            // map_echo <from> <to>
            if (args.length < 2) {
                pushLog('map_echo: requires two args (from to)');
                return;
            }
            setEchoMap({from: args[0], to: args[1]});
            pushLog(`echo map set: ${args[0]} -> ${args[1]}`);
            if (isFirstTime('map_echo')) pushLog({text: '[SYS] Character substitution configured', color: 'gray'});
            return;
        }

        if (cmd === 'sha256sum' || cmd === 'sha256') { // timing-based vessel.bin
            const target = args.join(' ');
            if (!target || !target.includes('vessel')) {
                pushLog('sha256sum: missing file or wrong target');
                return;
            }
            // compute a fake hash dependent on heartbeat phase at execution
            if (isFirstTime('sha256')) pushLog({
                text: '[SYS] Computing checksum... (timing is critical)',
                color: 'gray'
            });
            const goodWindow = hbPhase > 44 && hbPhase < 57;
            const hash = await computeFakeHash(`${sessionId ?? 0}:${hbPhase}`);
            pushLog(`${hash}  ${target}`);
            if (goodWindow) {
                setFragmentSafely(5, 'vessel-integrity');
                pushLog({text: 'Vessel integrity: OK', color: 'green'});
            } else {
                pushLog({text: 'Vessel integrity: MISMATCH', color: 'red'});
            }
            return;
        }

        if (cmd === 'capture') {
            if (args[0] === 'heartbeat') {
                if (isFirstTime('capture-hb')) pushLog({text: '[SYS] Monitoring cardiac rhythm...', color: 'gray'});
                submitHeartbeat();
                return;
            }
            if (args[0] === 'log') {
                if (isFirstTime('capture-log')) pushLog({text: '[SYS] Extracting log tokens...', color: 'gray'});
                captureLatest();
                return;
            }
            pushLog('capture: unknown target (try heartbeat or log)');
            return;
        }

        if (cmd === 'whoami' || cmd === 'id') {
            if (isFirstTime('whoami')) pushLog({text: '[SYS] Querying identity registers...', color: 'gray'});
            pushLog(`you are: ${Object.values(fragments)[0] || 'operator'}`);
            return;
        }

        if (cmd === 'last') {
            if (isFirstTime('last')) pushLog({text: '[SYS] Reading login history...', color: 'gray'});
            // show a future login entry
            pushLog({text: 'VESSEL tty0 2075-03-19 02:11', color: 'cyan'});
            pushLog('...');
            return;
        }

        if (cmd === 'su' || cmd === 'login' || cmd === 'become') {
            // attempt to become identity
            const target = args[0] || args[1] || '';
            if (target.toLowerCase().includes('vessel')) {
                if (isFirstTime('su-vessel')) pushLog({
                    text: '[AUTH] Identity transition in progress...',
                    color: 'cyan'
                });
                setFragmentSafely(7, 'vessel-identity');
                pushLog({text: 'You assume the VESSEL identity. The logs quiet for a moment.', color: 'green'});
                markCompleted();
                return;
            }
            pushLog('user change failed: unknown identity');
            return;
        }

        // echo behavior: if effective command triggers any legacy handler after substitution
        // additional hidden handlers (very rarely hinted, not listed in help)
        if (effective === 'unlock_secret' || effective === 'unlock-secret') {
            setFragmentSafely(4, 'hidden');
            pushLog({text: 'A secret unlock whispers open', color: 'magenta'});
            return;
        }

        // unknown command
        pushLog(`${cmd}: command not found`);
    };

    // heartbeat capture helper (for compatibility with older UI calls)
    const submitHeartbeat = () => {
        if (hbPhase > 44 && hbPhase < 57) {
            const frag = 'HB' + String(Math.floor(Math.random() * 900) + 100);
            setFragmentSafely(3, frag);
            pushLog('pulse captured');
        } else {
            pushLog('pulse misaligned');
        }
    }

    // compute fake sha256 hex from input
    async function computeFakeHash(s: string) {
        try {
            if (typeof window !== 'undefined' && (window.crypto as any)?.subtle) {
                const enc = new TextEncoder();
                const buf = await (window.crypto.subtle.digest('SHA-256', enc.encode(s)) as Promise<ArrayBuffer>);
                return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
            }
        } catch (e) {
        }
        // fallback
        let h = 0;
        for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
        return (h >>> 0).toString(16).padStart(64, '0');
    }

    // filesystem helper: traverse fs tree by path
    function getFsNode(root: any, path: string) {
        if (!root) return null;
        const parts = path.split('/').filter(Boolean);
        let cur = root;
        for (const p of parts) {
            const next = (cur.dirs || []).find((d: any) => d.name === p);
            if (!next) return null;
            cur = next;
        }
        return cur;
    }

    // check TR33LIED sequence from visited letters
    function checkTr33lied() {
        const seq = visitedPathLetters.join('');
        // want sequence TREE LIED roughly: T R E E L I E D
        if (seq.includes('TREELIED')) {
            setFragmentSafely(6, 'tr33lied');
            pushLog('[PUZZLE] you found a path that reads TREELIED');
        }
    }

    // capture latest stream log token (for whisper puzzle)
    const captureLatest = () => {
        const lastEntry = streamLogs.slice(-1)[0] || null;
        const last = lastEntry ? lastEntry.text : '';
        const words = last.split(/\s+/);
        const w = words.find((t: string) => t.length > 3) || last;
        setFragments(prev => ({...prev, 6: (prev[6] || '') + (prev[6] ? '-' : '') + w}));
        pushLog(`captured token: ${w}`);
    }

    // UI render
    return (
        <div style={{
            height: '100vh',
            background: TERM_BG,
            color: TERM_GREEN,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace',
            padding: 12,
            boxSizing: 'border-box'
        }} className={glitchActive ? 'glitch-active' : ''}>
            <style>{`
                .crt { background: linear-gradient(0deg, rgba(0,0,0,1), rgba(2,8,2,0.95)); color: ${TERM_GREEN}; }
                .scan { background-image: linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px); background-size:100% 3px; }
                .crt .term-pre { text-shadow: 0 0 8px rgba(0,255,120,0.06); }
                .cursor::after { content:'\\2588'; margin-left:6px; color:${TERM_GREEN}; animation: blink 1s steps(2,start) infinite }
                @keyframes blink { 50%{ opacity:0 } }
                .proc-running { color:#7fff7f } .proc-stalled { color:#ffa500 } .proc-ghost { color:#ff6b6b } .proc-new{ color:#9ecbff }
                .log { color:#9fffa0; font-size:12px }
                .prompt { color:#aaffcc }
                .ascii { color:#66ff88 }
                .small { font-size:12px; color:#9fbf9f }
                .terminal-window { border: 2px solid rgba(0,255,120,0.06); padding:12px; border-radius:6px; box-shadow: 0 0 40px rgba(0,255,120,0.02) inset; transition: all 0.3s ease; }
                
                /* Horror glitch effects */
                .glitch-active {
                    animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both;
                }
                
                @keyframes glitch {
                    0% { transform: translate(0); filter: hue-rotate(0deg); }
                    10% { transform: translate(-5px, 5px); filter: hue-rotate(90deg) invert(1); }
                    20% { transform: translate(-10px, -5px); filter: hue-rotate(180deg); }
                    30% { transform: translate(10px, 5px); filter: hue-rotate(270deg) invert(1); }
                    40% { transform: translate(-5px, -10px); filter: hue-rotate(0deg); }
                    50% { transform: translate(5px, 10px); filter: hue-rotate(90deg) invert(1); }
                    60% { transform: translate(-10px, 5px); filter: hue-rotate(180deg); }
                    70% { transform: translate(10px, -5px); filter: hue-rotate(270deg) invert(1); }
                    80% { transform: translate(-5px, 5px); filter: hue-rotate(0deg); }
                    90% { transform: translate(5px, -5px); filter: hue-rotate(180deg) invert(1); }
                    100% { transform: translate(0); filter: hue-rotate(0deg); }
                }
                
                /* Progressive corruption based on fragment count */
                ${fragmentsCollected >= 3 ? `
                    .terminal-window { 
                        box-shadow: 0 0 40px rgba(255,0,0,0.1) inset, 0 0 20px rgba(255,0,0,0.05); 
                        border-color: rgba(255,0,120,0.15);
                    }
                ` : ''}
                
                ${fragmentsCollected >= 5 ? `
                    body { cursor: none !important; }
                    .terminal-window { 
                        animation: flicker 4s infinite;
                    }
                    @keyframes flicker {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.97; }
                        51% { opacity: 0.95; }
                        52% { opacity: 1; }
                    }
                ` : ''}
                
                ${fragmentsCollected >= 7 ? `
                    .terminal-window {
                        background: linear-gradient(145deg, rgba(20,0,0,0.3), rgba(0,0,0,1));
                    }
                ` : ''}
            `}</style>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: 'monospace', fontSize: 14}}>entity-shell // access: uncanny</div>
                <div style={{fontSize: 12, color: '#666'}}>session {mounted && sessionId}</div>
            </div>

            <div style={{display: 'flex', height: 'calc(100% - 72px)'}}>
                <div style={{
                    width: 320,
                    borderRight: '1px solid rgba(255,255,255,0.03)',
                    paddingRight: 12,
                    overflow: 'auto'
                }}>
                    <div style={{fontSize: 12, marginBottom: 8}}>processes</div>
                    <div style={{fontSize: 13, marginBottom: 12}}>
                        {subprocs.map(s => (<div key={s.pid} style={{display: 'flex', justifyContent: 'space-between'}}>
                            <div style={{fontFamily: 'monospace'}}>{s.name}</div>
                            <div style={{color: '#7f9f7f'}}>@{s.pid}</div>
                        </div>))}
                    </div>

                    <div style={{fontSize: 12, marginTop: 8}}>fragments</div>
                    <div style={{fontSize: 13, marginTop: 8}}>
                        {Array.from({length: 7}, (_, i) => i + 1).map(i => (
                            <div key={i} style={{fontFamily: 'monospace'}}>{i}: {fragments[i] || '---'}</div>))}
                    </div>

                    <div style={{marginTop: 18, fontSize: 12, color: '#9fbf9f'}}>tips: discover commands; the system
                        will not hold your hand.
                    </div>
                </div>

                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <div style={{
                        flex: 1,
                        background: '#001100',
                        padding: 12,
                        overflow: 'auto',
                        border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                        <div style={{fontFamily: 'monospace', whiteSpace: 'pre-wrap'}}>
                            {streamLogs.map((l, idx) => {
                                const colorMap: Record<string, string> = {
                                    green: '#b6ffb6',
                                    yellow: '#ffd97a',
                                    red: '#ff7b7b',
                                    cyan: '#9feaff',
                                    magenta: '#d7b3ff',
                                    gray: '#9fbf9f'
                                };
                                const color = l.color ? colorMap[l.color] : '#aaffcc';
                                return (<div key={idx} style={{marginBottom: 6, color}}>{l.text}</div>);
                            })}
                        </div>
                    </div>

                    <div style={{marginTop: 8, display: 'flex', gap: 8, alignItems: 'center'}}>
                        <input value={commandInput} onChange={e => setCommandInput(e.target.value)} onKeyDown={e => {
                            if (e.key === 'Enter') {
                                processCommand(commandInput);
                                setCommandInput('');
                            }
                        }} placeholder={`type a command`} style={{
                            flex: 1,
                            background: '#050505',
                            color: TERM_GREEN,
                            border: '1px solid rgba(255,255,255,0.03)',
                            fontFamily: 'monospace',
                            padding: 8
                        }}/>
                        <button onClick={() => {
                            processCommand(commandInput);
                            setCommandInput('');
                        }} style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.03)',
                            color: TERM_GREEN,
                            padding: '8px 12px'
                        }}>RUN
                        </button>
                    </div>

                    <div style={{marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{fontSize: 12, color: '#9fbf9f'}}>live stream • {streamLogs.length} lines</div>
                        <div style={{fontSize: 12}}><Link href="/chapters/IV" style={{color: '#9fbf9f'}}>back to chapter
                            IV</Link></div>
                    </div>
                </div>
            </div>

            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.IV} loop preload="auto" style={{display: 'none'}}/>
        </div>
    );
}
