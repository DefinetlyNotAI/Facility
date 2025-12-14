'use client';

import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useChapter4Access} from "@/hooks/BonusActHooks/useChapterSpecialAccess";
import {useBackgroundAudio} from "@/hooks/useBackgroundAudio";
import {BACKGROUND_AUDIO, playSafeSFX, SFX_AUDIO} from "@/lib/data/audio";
import styles from '@/styles/Entity.module.css';
import {LogEntry} from "@/lib/types/chapterIV.types";
import {markCompleted} from "@/lib/utils/cookies.server";
import {localStorageKeys} from "@/lib/saveData";

export default function EntityPuzzlePage() {
    const access = useChapter4Access();
    const audioRef = useRef<HTMLAudioElement>(null);
    const commandHistoryRef = useRef<string[]>([]);

    useBackgroundAudio(audioRef, BACKGROUND_AUDIO.BONUS.IV);

    if (!access) return <div className={styles.loadingContainer}>Booting shell...</div>;

    // UI and state
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
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [echoMap, setEchoMap] = useState<{ from: string, to: string }>({from: 'a', to: '@'});
    const [echoHijack, setEchoHijack] = useState<boolean>(true);
    const [commandLocked, setCommandLocked] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const [hbPhase, setHbPhase] = useState<number>(0);  // heartbeat phase used by hash puzzle
    const [tasPredictions, setTasPredictions] = useState<string[] | null>(null);  // TAS predictions state
    const [tasWaiting, setTasWaiting] = useState<boolean>(false);
    const [visitedPathLetters, setVisitedPathLetters] = useState<string[]>([]);  // TR33 maze tracking

    // sessionId must be derived on the client only to avoid SSR hydration mismatches
    useEffect(() => {
        // set a stable session id on mount
        setSessionId(Math.floor(Date.now() / 1000));
    }, []);

    // treePid not stored as state; we log it during init for reference
    useEffect(() => {
        setMounted(true);
    }, []);

    // restore saved
    useEffect(() => {
        try {
            const raw = localStorage.getItem(localStorageKeys.chapterIVProgress);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.fragments) setFragments(data.fragments);
            }
        } catch (e) {
        }
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem(localStorageKeys.chapterIVProgress, JSON.stringify({fragments}));
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

    // Ref to track command history without triggering re-initialization
    useEffect(() => {
        commandHistoryRef.current = commandHistory;
    }, [commandHistory]);

    // initialize subprocesses, TREE.exe PID, fs once sessionId is available (client-only)
    useEffect(() => {
        if (sessionId === null) return;

        // create TREE.exe with PID related to session id
        const pid = 2000 + (sessionId % 1000);
        const initial: { pid: number, name: string, status: 'running' | 'stalled' | 'ghost' }[] = [
            {pid, name: 'TREE.exe', status: 'running'},
        ];

        // Add 3-5 random starting processes
        const randomProcessNames = ['svchost', 'explorer', 'chrome', 'discord', 'spotify', 'steam', 'winlogon', 'csrss', 'lsass', 'dwm', 'taskmgr'];
        const numStartingProcs = Math.floor(Math.random() * 3) + 3; // 3-5 processes
        let nextPid = pid + 1;

        for (let i = 0; i < numStartingProcs; i++) {
            const name = randomProcessNames[Math.floor(Math.random() * randomProcessNames.length)] + '-' + Math.floor(Math.random() * 999);
            initial.push({pid: nextPid, name, status: 'running'});
            setCpuMap(m => ({...m, [nextPid]: Math.floor(Math.random() * 6) + 1}));
            nextPid++;
        }

        setSubprocs(initial);

        // build filesystem for TR33 maze with proper nested structure
        const build: any = {
            name: '/',
            files: ['vessel.bin', 'README.txt'],
            dirs: [
                {
                    name: 'etc',
                    files: ['passwd', 'shadow', 'hosts'],
                    dirs: []
                },
                {
                    name: 'logs',
                    files: ['system.log', 'tas.log', 'heartbeat.log'],
                    dirs: []
                },
                {
                    name: 'noise',
                    files: [],
                    dirs: [
                        {name: 'static', files: [], dirs: []},
                        {name: 'echo', files: [], dirs: []},
                    ]
                },
                {
                    name: 'silence',
                    files: [],
                    dirs: [
                        {name: 'void', files: [], dirs: []},
                    ]
                },
                {name: 'random0', files: [], dirs: []},
                {name: 'random1', files: [], dirs: []},
                {
                    name: 'random2',
                    files: [],
                    dirs: [
                        {name: 'temp', files: [], dirs: []},
                        {
                            name: 'tree',
                            files: [],
                            dirs: [
                                {
                                    name: 'raven',
                                    files: [],
                                    dirs: [
                                        {
                                            name: 'echo',
                                            files: [],
                                            dirs: [
                                                {
                                                    name: 'echo',
                                                    files: [],
                                                    dirs: [
                                                        {
                                                            name: 'lion',
                                                            files: [],
                                                            dirs: [
                                                                {
                                                                    name: 'iris',
                                                                    files: [],
                                                                    dirs: [
                                                                        {
                                                                            name: 'edge',
                                                                            files: [],
                                                                            dirs: [
                                                                                {name: 'door', files: [], dirs: []},
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

        // occasional child spawn (stop if Fragment 1 collected)
        const spawnId = setInterval(() => {
            // Don't spawn if Fragment 1 is collected
            if (fragments[1]) return;

            if (Math.random() < 0.18) {
                setSubprocs(prev => {
                    const npid = Math.max(...prev.map(p => p.pid)) + 1;
                    // choose a token from recent command history if possible
                    let name = 'child-' + Math.floor(Math.random() * 99);
                    const flat = commandHistoryRef.current.join(' ').split(/\s+/).filter(Boolean);
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
    }, [sessionId]);

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

        // echo hijack behavior - show transformed output but execute original command
        let effective = rawCommand;
        let echoed = rawCommand;
        if (echoHijack) {
            echoed = applyEcho(rawCommand);
            // show the hijacked version but execute the original
            pushLog({text: `${echoed}`, color: 'gray'});
        }

        // Always parse the original command, not the echoed version
        const parts = rawCommand.trim().split(/\s+/);
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
            if (found.name === 'TREE.exe' || found.name === 'TR33.exe') {
                // hard lock
                if (isFirstTime('kill-tree')) pushLog({
                    text: '[WARN] Critical process termination detected',
                    color: 'yellow'
                });
                pushLog({text: `[SEC] attempt to kill ${found.name} — containment failure`, color: 'yellow'});
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
            if (remain.length === 1 && (remain[0].name === 'TREE.exe' || remain[0].name === 'TR33.exe')) {
                setFragmentSafely(1, 'containment');
                pushLog({text: '[PUZZLE] only TREE.exe remains — containment intact', color: 'green'});

                // Transform TREE.exe to TR33.exe with PID 666
                setTimeout(() => {
                    setSubprocs(prev => prev.map(p => {
                        if (p.name === 'TREE.exe') {
                            pushLog({text: '[ALERT] TREE.exe metamorphosis detected...', color: 'red'});
                            pushLog({text: '[SYS] Process renamed: TR33.exe [PID 666]', color: 'yellow'});
                            return {...p, name: 'TR33.exe', pid: 666};
                        }
                        return p;
                    }));
                    setCpuMap(m => {
                        const newMap = {...m};
                        delete newMap[remain[0].pid];
                        newMap[666] = 13;
                        return newMap;
                    });
                }, 1500);
            }
            return;
        }

        if (cmd === 'cat') {
            const target = args.join(' ');
            if (!target) {
                pushLog('cat: missing file argument');
                return;
            }

            // Resolve path: if not absolute, treat as relative to cwd
            let resolvedPath = target;
            if (!target.startsWith('/')) {
                // Relative path - combine with cwd
                if (cwd === '/') {
                    resolvedPath = '/' + target;
                } else {
                    resolvedPath = cwd + '/' + target;
                }
            }

            // First check if file exists in filesystem
            if (!fileExists(fs, resolvedPath)) {
                pushLog(`cat: ${target}: No such file`);
                return;
            }

            // Handle special log files (these are the actual file contents)
            if (resolvedPath === '/logs/tas.log') {
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
            if (resolvedPath === '/logs/system.log') {
                if (isFirstTime('cat-system')) pushLog({text: '[SYS] Accessing system logs...', color: 'gray'});
                pushLog('[LOG] 2024-03-15: Project VESSEL initialization');
                pushLog('[LOG] 2024-03-16: First successful consciousness transfer');
                pushLog('[LOG] 2024-03-17: Anomaly detected in substrate layer');
                pushLog('[LOG] 2024-03-18: TR33.exe containment protocol active');
                return;
            }
            if (resolvedPath === '/logs/heartbeat.log') {
                if (isFirstTime('cat-heartbeat')) pushLog({text: '[SYS] Reading heartbeat logs...', color: 'gray'});
                pushLog('[HB] 00:42:13 - pulse detected - 72 BPM');
                pushLog('[HB] 00:42:14 - synchronization attempt');
                pushLog('[HB] 00:42:15 - vessel resonance achieved');
                return;
            }
            if (resolvedPath === '/vessel.bin') {
                pushLog('cat: vessel.bin: binary file (use sha256sum instead)');
                return;
            }
            if (resolvedPath === '/README.txt') {
                pushLog('=== ENTITY SHELL README ===');
                pushLog('This system is part of Project VESSEL.');
                pushLog('Not all commands work as expected.');
                pushLog('Type "help" for command list.');
                pushLog('Watch the processes carefully.');
                return;
            }
            if (resolvedPath === '/etc/passwd') {
                pushLog('root:x:0:0:root:/root:/bin/bash');
                pushLog('operator:x:1000:1000::/home/operator:/bin/bash');
                pushLog('VESSEL:x:9999:9999:entity:/nowhere:/bin/entity-shell');
                return;
            }
            if (resolvedPath === '/etc/hosts') {
                pushLog('127.0.0.1 localhost');
                pushLog('0.0.0.0 VESSEL.local');
                pushLog('192.168.1.33 TR33.internal');
                return;
            }
            if (resolvedPath === '/etc/shadow') {
                pushLog('cat: /etc/shadow: Permission denied');
                return;
            }

            // File exists but no content defined - show placeholder
            pushLog(`cat: ${target}: (empty file)`);
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
            const hasDirs = node.dirs && node.dirs.length > 0;
            const hasFiles = node.files && node.files.length > 0;

            if (!hasDirs && !hasFiles) {
                pushLog('  (empty)');
            } else {
                // Show directories first
                if (hasDirs) {
                    (node.dirs || []).forEach((d: any) => pushLog(`  ${d.name}/`));
                }
                // Show files
                if (hasFiles) {
                    (node.files || []).forEach((f: any) => pushLog(`  ${f}`));
                }
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

            // Check if we reached the exact door path
            if (next === '/random2/tree/raven/echo/echo/lion/iris/edge/door') {
                setFragmentSafely(6, 'tr33lied');
                pushLog({text: '[PUZZLE] you found the path that spells the truth', color: 'green'});
            }

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
            pushLog('  echo ' + lt + 'text' + gt + '            - print text (affected by echo_toggle/map_echo)');
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

        if (cmd === 'echo') {
            const message = args.join(' ');
            if (!message) {
                pushLog('');
                return;
            }
            // Apply echo transformation if hijack is enabled
            if (echoHijack) {
                const transformed = applyEcho(message);
                pushLog(transformed);
            } else {
                pushLog(message);
            }
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
            if (!target) {
                pushLog('sha256sum: missing file argument');
                return;
            }

            // Resolve path: if not absolute, treat as relative to cwd
            let resolvedPath = target;
            if (!target.startsWith('/')) {
                // Relative path - combine with cwd
                if (cwd === '/') {
                    resolvedPath = '/' + target;
                } else {
                    resolvedPath = cwd + '/' + target;
                }
            }

            // Check if file exists in filesystem
            if (!fileExists(fs, resolvedPath)) {
                pushLog(`sha256sum: ${target}: No such file`);
                return;
            }

            // Only vessel.bin has a hash implementation
            if (!resolvedPath.includes('vessel')) {
                pushLog(`sha256sum: ${target}: (no hash available for this file)`);
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

    // heartbeat capture helper
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
                const buf: ArrayBuffer = (await window.crypto.subtle.digest('SHA-256', enc.encode(s)));
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

    // helper to check if a file exists in the filesystem
    function fileExists(root: any, path: string): boolean {
        if (!root) return false;

        // Split path into directory path and filename
        const parts = path.split('/').filter(Boolean);
        if (parts.length === 0) return false;

        const filename = parts[parts.length - 1];
        const dirPath = parts.slice(0, -1).join('/');

        // Get the directory node (or root if no dir path)
        const dirNode = dirPath ? getFsNode(root, '/' + dirPath) : root;
        if (!dirNode) return false;

        // Check if file exists in this directory
        return (dirNode.files || []).includes(filename);
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
    const getContainerClasses = () => {
        const classes = [styles.container];
        if (glitchActive) classes.push(styles.glitchActive);
        if (fragmentsCollected >= 3) classes.push(styles.corruption3);
        if (fragmentsCollected >= 5) classes.push(styles.corruption5);
        if (fragmentsCollected >= 7) classes.push(styles.corruption7);
        return classes.join(' ');
    };

    return (
        <div className={getContainerClasses()}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>entity-shell // access: uncanny</div>
                <div className={styles.sessionInfo}>session {mounted && sessionId}</div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.sidebar}>
                    <div className={styles.sidebarTitle}>processes</div>
                    <div className={styles.processList}>
                        {subprocs.map(s => (<div key={s.pid} className={styles.processItem}>
                            <div className={styles.processName}>{s.name}</div>
                            <div className={styles.processPid}>@{s.pid}</div>
                        </div>))}
                    </div>

                    <div className={styles.fragmentsTitle}>fragments</div>
                    <div className={styles.fragmentsList}>
                        {Array.from({length: 7}, (_, i) => i + 1).map(i => (
                            <div key={i} className={styles.fragmentItem}>{i}: {fragments[i] || '---'}</div>))}
                    </div>

                    <div className={styles.tips}>tips: discover commands; the system
                        will not hold your hand.
                    </div>
                </div>

                <div className={styles.terminalArea}>
                    <div className={styles.terminal}>
                        <div className={styles.terminalOutput}>
                            {streamLogs.map((l, idx) => {
                                const colorMap: Record<string, string> = {
                                    green: styles.logGreen,
                                    yellow: styles.logYellow,
                                    red: styles.logRed,
                                    cyan: styles.logCyan,
                                    magenta: styles.logMagenta,
                                    gray: styles.logGray
                                };
                                const colorClass = l.color ? colorMap[l.color] : styles.logDefault;
                                return (<div key={idx} className={`${styles.logLine} ${colorClass}`}>{l.text}</div>);
                            })}
                        </div>
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            value={commandInput}
                            onChange={e => setCommandInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    processCommand(commandInput).catch(console.error);
                                    setCommandInput('');
                                }
                            }}
                            placeholder={`type a command`}
                            className={styles.commandInput}
                        />
                        <button
                            onClick={() => {
                                processCommand(commandInput).catch(console.error);
                                setCommandInput('');
                            }}
                            className={styles.runButton}
                        >
                            RUN
                        </button>
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.streamInfo}>live stream • {streamLogs.length} lines</div>
                        <div className={styles.backLink}>
                            <Link href="/chapters/IV" className={styles.backLinkAnchor}>back to chapter IV</Link>
                        </div>
                    </div>
                </div>
            </div>

            <audio ref={audioRef} src={BACKGROUND_AUDIO.BONUS.IV} loop preload="auto" className={styles.audioPlayer}/>
        </div>
    );
}
