'use client';
import React, {useEffect, useRef, useState} from 'react';
import {FILE_SYSTEM, FONTS} from '@/lib/data/tree98';
import {getIcon} from '@/components/tree98/icons';

type FileSystemItem = typeof FILE_SYSTEM[number];
type DirItem = {
    name: string;
    children?: (FileSystemItem | DirItem)[];
    type: 'folder' | 'file';
    [key: string]: any;
};

const resolvePath = (base: string[], targetPath?: string): DirItem | null => {
    const fullPath = [...base];
    if (targetPath) {
        const parts = targetPath.replace(/\\$/, '').split('\\');
        for (const part of parts) {
            if (part === '..') fullPath.pop();
            else fullPath.push(part);
        }
    }
    let current: any = FILE_SYSTEM.find(d => d.name === fullPath[0]);
    for (let i = 1; i < fullPath.length; i++) {
        current = current?.children?.find(
            (item: any) => item.name.toLowerCase() === fullPath[i].toLowerCase() && item.type === 'folder'
        );
        if (!current) return null;
    }
    return current;
};

const listDir = (dir: DirItem): string[] => {
    if (!dir?.children?.length) return ['<Empty Directory>'];
    const boxTop = '┌──────────── FILES ────────────┐';
    const files = dir.children.map(item =>
        `│ ${item.name.padEnd(28, '\u00A0')}│`
    );
    const boxBottom = '└────────────────────────────────┘';
    return [boxTop, ...files, boxBottom];
};

export const CMD: React.FC = () => {
    const [history, setHistory] = useState<string[]>([
        '(c) 19XX–19XX Internal Research Division',
        '\u00A0',
        'Due to safety protocols, this console is limited',
        'Awaiting emergency boot sequence to unlock file console command line and mount safety file system.',
        '\u00A0'
    ]);
    const [input, setInput] = useState('');
    const [inputHistory, setInputHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [path, setPath] = useState(['C:']);
    const [variables, setVariables] = useState<{ [key: string]: string }>({});
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const getPrompt = () => path.join('\\') + '>';

    const highlightText = (text: string) => {
        return text.split(/(\*[^*]+\*)/g).map((part, i) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                return <span key={i} style={{background: 'yellow', color: 'black'}}>{part.slice(1, -1)}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    const commandMap: Record<string, (args: string[]) => string[]> = {
        help: () => [
            '┌──────────── AVAILABLE COMMANDS ────────────┐',
            '│ help\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Show available commands\u00A0\u00A0│',
            '│ dir / ls [folder]\u00A0List contents\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ cd [folder]\u00A0\u00A0\u00A0\u00A0\u00A0Change directory\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ cls\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Clear screen\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ $var = value\u00A0\u00A0\u00A0\u00A0Set variable\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ $var\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Recall variable\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ time\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Show current time\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ date\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Show current date\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ battery\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Show battery level\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ useragent\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Show browser UA\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0│',
            '│ echo\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Print inputted text raw\u00A0\u00A0│',
            '└──────────────────────────────────────────────┘',
        ],
        cls: () => {
            setHistory([]);
            return [];
        },
        dir: (args) => {
            const targetDir = resolvePath(path, args[0]);
            return targetDir ? listDir(targetDir) : ['ERROR: PATH NOT FOUND'];
        },
        ls: (args) => commandMap['dir'](args), // alias
        cd: (args) => {
            const target = args[0]?.replace(/\\$/, '');
            if (!target) return ['SYNTAX: cd [folder]'];
            const newDir = resolvePath(path, target);
            if (newDir) {
                const parts = target.split('\\');
                const newPath = [...path];
                for (const part of parts) {
                    if (part === '..') newPath.pop();
                    else newPath.push(part);
                }
                setPath(newPath);
                return [];
            } else return [`The system cannot find the path specified: ${args[0]}`];
        },
        time: () => [`Current Time: ${new Date().toLocaleTimeString()}`],
        date: () => [`Current Date: ${new Date().toLocaleDateString()}`],
        battery: () => {
            if ('getBattery' in navigator) {
                (navigator as any).getBattery().then((b: { level: number; charging: boolean }) => {
                    const level = Math.round(b.level * 100) + '%';
                    const status = b.charging ? 'Charging' : 'Not Charging';
                    setHistory(prev => [...prev, `Battery: ${level} (${status})`]);
                });
                return ['Checking battery status...'];
            }
            return ['Battery API not supported'];
        },
        useragent: () => [navigator.userAgent],
        echo: (args: string[]) => {
            const val = args.join(' ');
            let evaluated: any;
            if (!isNaN(Number(val.trim()))) {
                evaluated = Number(val.trim());
            } else {
                try {
                    evaluated = evaluateExpression(val, variables);
                } catch {
                    evaluated = val;
                }
            }
            return [String(evaluated)];
        },
    };

    const handlePipe = (raw: string): string[] => {
        const parts = raw.split('|').map(p => p.trim());
        let output: string[] = [];
        for (let i = 0; i < parts.length; i++) {
            const cmd = i === 0 ? parts[i] : parts[i] + ' ' + output.join(' ');
            output = handleSingleCommand(cmd);
        }
        return output;
    };

    const evaluateExpression = (expr: string, vars: Record<string, any>): number => {
        const replaced = expr.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, varName) => {
            const val = vars[varName];
            if (val === undefined) throw new Error(`Variable $${varName} not found`);
            return val;
        });

        if (!/^[\d\s()+\-*/.]+$/.test(replaced)) {
            throw new Error('Unsafe or invalid characters in expression');
        }

        return Function(`"use strict"; return (${replaced})`)();
    };

    const replaceVars = (input: string, vars: Record<string, any>): string => {
        return input.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, varName) => {
            const val = vars[varName];
            return val !== undefined ? val : `$${varName}`;
        });
    };


    const handleSingleCommand = (raw: string): string[] => {
        let input = raw.trim();

        // 1. Assignment: $var = expr
        const assignMatch = input.match(/^\$([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
        if (assignMatch) {
            const [, key, val] = assignMatch;
            try {
                let evaluated;
                // Check for quoted string assignment
                if (/^(['"]).*\1$/.test(val.trim())) {
                    evaluated = val.trim().slice(1, -1);
                } else {
                    evaluated = evaluateExpression(val, variables);
                }
                setVariables(prev => ({...prev, [key]: String(evaluated)}));
                return [`Variable $${key} set.`];
            } catch (err) {
                return [`ERROR: ${err instanceof Error ? err.message : 'Invalid expression'}`];
            }
        }

        // 2. Variable retrieval: $var
        if (/^\$[a-zA-Z_][a-zA-Z0-9_]*$/.test(raw.trim())) {
            const varName = raw.trim().slice(1);
            const val = variables[varName];
            return val !== undefined
                ? [`${val}`]
                : [`ERROR: Variable $${varName} not found`];
        }


        // 3. Replace vars in the command string (used in expressions or commands)
        input = replaceVars(input, variables);

        // 4. Built-in commands
        const [cmdRaw, ...args] = input.split(/\s+/);
        const cmd = cmdRaw.toLowerCase();

        if (commandMap[cmd]) return commandMap[cmd](args);

        if (cmdRaw.startsWith('*') && cmdRaw.endsWith('*')) return [cmdRaw];

        // 5. Fallback
        if (!cmdRaw || /^\d+(\.\d+)?$/.test(cmdRaw)) {
            return ['Command is disabled.'];
        } else {
            return [`'${cmdRaw}' is not recognized as an internal or external command, operable program or batch file.`];
        }
    };


    const handleCommand = (raw: string): string[] =>
        raw.includes('|') ? handlePipe(raw) : handleSingleCommand(raw);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const output = handleCommand(input);
        setInputHistory(prev => [...prev, input]);
        setHistoryIndex(null);
        setHistory(prev => [...prev, `${getPrompt()} ${input}`, ...output]);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            if (inputHistory.length === 0) return;
            e.preventDefault();
            const newIndex = historyIndex === null ? inputHistory.length - 1 : Math.max(historyIndex - 1, 0);
            setHistoryIndex(newIndex);
            setInput(inputHistory[newIndex]);
        } else if (e.key === 'ArrowDown') {
            if (inputHistory.length === 0 || historyIndex === null) return;
            e.preventDefault();
            const newIndex = Math.min(historyIndex + 1, inputHistory.length - 1);
            setHistoryIndex(newIndex);
            setInput(inputHistory[newIndex]);
        }
    };

    useEffect(() => {
        terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
    }, [history]);

    return (
        <div className="flex flex-col h-full bg-black text-green-400" style={{fontFamily: FONTS.SYSTEM}}>
            <div className="flex items-center p-2 border-b bg-gray-900 gap-2">
                <div className="w-8 h-8">{getIcon('run')}</div>
                <span className="text-xs flex-1">C:\ Locked Console</span>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-black text-sm font-mono" ref={terminalRef}
                 style={{userSelect: 'text', WebkitUserSelect: 'text'}}>
                {history.map((line, i) => <div key={i}>{highlightText(line)}</div>)}
                <form onSubmit={handleSubmit} className="flex mt-1">
                    <span>{getPrompt()}&nbsp;</span>
                    <input
                        ref={inputRef}
                        autoFocus
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-black text-green-400 font-mono outline-none flex-1"
                        spellCheck={false}
                        autoComplete="off"
                    />
                </form>
            </div>
        </div>
    );
};
