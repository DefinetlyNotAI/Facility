'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {TerminalVNProps, TerminalVNScript} from '@/types';
import {parseVNScript} from '@/lib/client/utils';
import styles from '@/styles/terminal-vn.module.css';
import '@/styles/vfx.module.css';
import {ChevronDown, ChevronUp, History, Menu, Pause, Play} from "lucide-react";
import {applyVFX, parseVFXCommand} from '@/lib/client/utils/terminalVN/vfx';
import {useRouter} from 'next/navigation';
import {routes} from '@/lib/saveData';


export function TerminalVN({
                               script,
                               onComplete,
                               onVariableChange,
                               initialVariables = {},
                               typingSpeed = 30,
                               className = '',
                           }: TerminalVNProps) {
    const [lines, setLines] = useState<Array<{ text: string; type: 'system' | 'dialogue' | 'error' | 'input' }>>([]);
    const [currentText, setCurrentText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [options, setOptions] = useState<Array<{ text: string; target?: string; condition?: string }>>([]);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [inputPrompt, setInputPrompt] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [variables, setVariables] = useState<Record<string, any>>(initialVariables);
    const [parsedScript, setParsedScript] = useState<TerminalVNScript | null>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string>('start');
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [manualMode, setManualMode] = useState(true);
    const [waitingForNext, setWaitingForNext] = useState(false);
    const [waitingForAuto, setWaitingForAuto] = useState(false);
    const [autoClear, setAutoClear] = useState(true);
    const [showNodeMenu, setShowNodeMenu] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());
    const [history, setHistory] = useState<Array<{ speaker?: string; text: string }>>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [debugCollapsed, setDebugCollapsed] = useState(false);
    const [selectedChoices, setSelectedChoices] = useState<Set<string>>(new Set());

    const router = useRouter();

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const autoModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const keyboardRef = useRef<HTMLDivElement>(null);
    const vfxRef = useRef<HTMLDivElement>(null);
    const hasInitializedRef = useRef(false);
    const isProcessingRef = useRef(false);

    // Parse script on mount or when script changes
    useEffect(() => {
        // Prevent re-initialization on every render
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        try {
            const parsed = parseVNScript(script);
            setParsedScript(parsed);
            setCurrentNodeId('start');
            setCurrentLineIndex(0);
            setLines([{text: '> VN Engine Initialized...', type: 'system'}]);

            // Load saved variables from localStorage
            const savedVars = localStorage.getItem('vn_variables');
            if (savedVars) {
                try {
                    const parsedVars = JSON.parse(savedVars);
                    setVariables({...initialVariables, ...parsedVars});
                } catch {
                    setVariables(initialVariables);
                }
            } else {
                setVariables(initialVariables);
            }

            // Load saved selected choices
            const savedChoices = localStorage.getItem('vn_selected_choices');
            if (savedChoices) {
                try {
                    const parsedChoices = JSON.parse(savedChoices);
                    setSelectedChoices(new Set(parsedChoices));
                } catch {
                    setSelectedChoices(new Set());
                }
            }

            // Check for autoclear setting in metadata
            if (parsed.metadata?.autoclear === 'true' || parsed.metadata?.autoclear === true) {
                setAutoClear(true);
            } else {
                setAutoClear(false);
            }

            // In manual mode, set waiting to allow user to start
            setWaitingForNext(true);
        } catch (error) {
            setHasError(true);
            setLines([
                {text: '> VN Engine Error', type: 'error'},
                {text: `> ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error'}
            ]);
        }
    }, [script]); // Only depend on script, not initialVariables

    // Load visited nodes from localStorage separately
    useEffect(() => {
        const visited = new Set<string>();
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('vn_node_visited_')) {
                const nodeName = key.substring(16); // Length of 'vn_node_visited_'
                if (localStorage.getItem(key) === 'true') {
                    visited.add(nodeName);
                }
            }
        });
        setVisitedNodes(visited);
    }, []);

    // Focus keyboard handler on mount
    useEffect(() => {
        if (keyboardRef.current) {
            keyboardRef.current.focus();
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines, currentText]);

    // Focus input when waiting
    useEffect(() => {
        if (waitingForInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [waitingForInput]);

    // Notify parent of variable changes and save to localStorage
    useEffect(() => {
        if (onVariableChange) {
            onVariableChange(variables);
        }
        // Save variables to localStorage
        localStorage.setItem('vn_variables', JSON.stringify(variables));
    }, [variables, onVariableChange]);

    // Interpolate variables in text
    const interpolateVariables = useCallback((text: string): string => {
        return text.replace(/\{(\w+)}/g, (match, varName) => {
            return variables[varName] !== undefined ? String(variables[varName]) : match;
        });
    }, [variables]);

    // Evaluate condition
    const evaluateCondition = useCallback((condition: string): boolean => {
        try {
            // Create a safe evaluation context
            const context = {...variables};
            const func = new Function(...Object.keys(context), `return ${condition};`);
            return func(...Object.values(context));
        } catch {
            return false;
        }
    }, [variables]);

    // Execute command
    const executeCommand = useCallback((command: string) => {
        const [cmd, ...args] = command.split(' ');
        const argStr = args.join(' ');

        switch (cmd) {
            case 'set':
                const [varName, ...varValue] = argStr.split('=');
                if (varName && varValue.length > 0) {
                    const cleanVarName = varName.trim();
                    const cleanValue = varValue.join('=').trim();

                    // Try to parse as JSON, otherwise store as string
                    try {
                        const parsedValue = JSON.parse(cleanValue);
                        setVariables(prev => ({...prev, [cleanVarName]: parsedValue}));
                    } catch {
                        // Remove quotes if present
                        const stringValue = cleanValue.replace(/^["']|["']$/g, '');
                        setVariables(prev => ({...prev, [cleanVarName]: stringValue}));
                    }
                }
                break;

            case 'add':
            case 'sub':
            case 'mul':
            case 'div':
                const [targetVar, operandStr] = argStr.split(' ');
                const operand = parseFloat(operandStr);
                if (targetVar && !isNaN(operand)) {
                    setVariables(prev => {
                        const current = parseFloat(prev[targetVar] || 0);
                        let result = current;

                        // Apply operation
                        switch (cmd) {
                            case 'add':
                                result = current + operand;
                                // Cap secretsFound at 3
                                if (targetVar === 'secretsFound' && result > 3) {
                                    result = 3;
                                }
                                break;
                            case 'sub':
                                result = current - operand;
                                break;
                            case 'mul':
                                result = current * operand;
                                break;
                            case 'div':
                                result = operand !== 0 ? current / operand : current;
                                break;
                        }

                        return {...prev, [targetVar]: result};
                    });
                }
                break;

            case 'log':
                setLines(prev => [...prev, {text: `> ${argStr}`, type: 'system'}]);
                break;

            case 'clear':
                setLines([]);
                break;

            case 'wait':
                // Wait command would be handled by the execution flow
                break;

            case 'vfx':
                // Handle VFX effects
                const vfxCmd = parseVFXCommand(command);
                if (vfxCmd && vfxRef.current) {
                    applyVFX(vfxCmd.effect, vfxRef.current);
                }
                break;

            default:
                // Unknown command, ignore
                break;
        }
    }, [variables]);

    // Type text effect
    const typeText = useCallback((text: string, speaker?: string) => {
        // Interpolate variables in text
        const interpolatedText = interpolateVariables(text);

        // Add to history
        setHistory(prev => [...prev, {speaker, text: interpolatedText}]);

        // Clear lines if autoclear is enabled, but keep speaker if present
        if (autoClear) {
            if (speaker) {
                setLines([{text: `[${speaker}]:`, type: 'dialogue'}]);
            } else {
                setLines([]);
            }
        } else if (speaker && !autoClear) {
            setLines(prev => [...prev, {text: `[${speaker}]:`, type: 'dialogue'}]);
        }

        setIsTyping(true);
        setCurrentText('');

        const fullText = `> ${interpolatedText}`;
        let index = 0;

        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        typingIntervalRef.current = setInterval(() => {
            if (index < fullText.length) {
                setCurrentText(fullText.substring(0, index + 1));
                index++;
            } else {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                }
                setIsTyping(false);

                // Add final text to lines
                setLines(prev => [...prev, {text: fullText, type: 'dialogue'}]);
                setCurrentText('');

                // In manual mode, wait for user to advance
                if (manualMode) {
                    setWaitingForNext(true);
                } else {
                    // In auto mode, wait 1-2 seconds before advancing
                    setWaitingForAuto(true);
                    const autoDelay = 1000 + Math.random() * 1000; // 1-2 seconds random

                    // Clear any existing timeout
                    if (autoModeTimeoutRef.current) {
                        clearTimeout(autoModeTimeoutRef.current);
                    }

                    autoModeTimeoutRef.current = setTimeout(() => {
                        setWaitingForAuto(false);
                        setCurrentLineIndex(prev => prev + 1);
                        autoModeTimeoutRef.current = null;
                    }, autoDelay);
                }
            }
        }, typingSpeed);
    }, [typingSpeed, manualMode, autoClear, interpolateVariables]);

    // Process next line
    const processNextLine = useCallback(() => {
        if (!parsedScript) return;

        // Prevent multiple simultaneous calls
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        const currentNode = parsedScript.nodes[currentNodeId];
        if (!currentNode) {
            if (onComplete) onComplete();
            // Redirect to Chapter V
            router.push(routes.bonus.actID('V'));
            isProcessingRef.current = false;
            return;
        }

        if (currentLineIndex >= currentNode.lines.length) {
            // Mark current node as visited before jumping
            if (!visitedNodes.has(currentNodeId)) {
                const newVisited = new Set(visitedNodes);
                newVisited.add(currentNodeId);
                setVisitedNodes(newVisited);
                localStorage.setItem(`vn_node_visited_${currentNodeId}`, 'true');
            }

            if (currentNode.jump) {
                setCurrentNodeId(currentNode.jump);
                setCurrentLineIndex(0);
            } else if (onComplete) {
                onComplete();
                // Redirect to Chapter V
                router.push(routes.bonus.actID('V'));
            }
            isProcessingRef.current = false;
            return;
        }

        const line = currentNode.lines[currentLineIndex];

        if (line.condition && !evaluateCondition(line.condition)) {
            setCurrentLineIndex(prev => prev + 1);
            isProcessingRef.current = false;
            return;
        }

        switch (line.type) {
            case 'dialogue':
                typeText(line.content, line.speaker);
                break;

            case 'command':
                executeCommand(line.content);
                setCurrentLineIndex(prev => prev + 1);
                break;

            case 'choice':
                let availableOptions = (line.options || []).filter(opt =>
                    !opt.condition || evaluateCondition(opt.condition)
                ).map(opt => ({
                    ...opt,
                    text: interpolateVariables(opt.text)
                }));

                // Special handling for final_choice node - hide "I seek nothing" until other choices are made
                if (currentNodeId === 'final_choice') {
                    const enlightenmentOption = availableOptions.find(opt =>
                        opt.text.includes('I seek nothing') || opt.target === 'enlightenment'
                    );
                    const otherOptions = availableOptions.filter(opt =>
                        !(opt.text.includes('I seek nothing') || opt.target === 'enlightenment')
                    );

                    // Check if all other options have been selected
                    const allOthersSelected = otherOptions.every(opt =>
                        selectedChoices.has(opt.text)
                    );

                    if (!allOthersSelected && enlightenmentOption) {
                        // Hide enlightenment option
                        availableOptions = otherOptions;
                    }
                }

                setOptions(availableOptions);
                setShowOptions(true);
                break;

            case 'input':
                setInputPrompt(interpolateVariables(line.content));
                setWaitingForInput(true);
                break;
        }

        isProcessingRef.current = false;
    }, [parsedScript, currentNodeId, currentLineIndex, evaluateCondition, executeCommand, typeText, onComplete, visitedNodes, interpolateVariables, router, selectedChoices]);

    // Skip typing animation
    const skipTyping = useCallback(() => {
        if (isTyping && typingIntervalRef.current && parsedScript) {
            clearInterval(typingIntervalRef.current);
            const currentNode = parsedScript.nodes[currentNodeId];
            const line = currentNode?.lines[currentLineIndex];

            if (line && line.type === 'dialogue') {
                // Speaker is already shown instantly, just add the dialogue text
                const interpolatedText = interpolateVariables(line.content);
                const fullText = `> ${interpolatedText}`;
                setLines(prev => [...prev, {text: fullText, type: 'dialogue'}]);
                setCurrentText('');
                setIsTyping(false);

                if (manualMode) {
                    setWaitingForNext(true);
                } else {
                    setCurrentLineIndex(prev => prev + 1);
                }
            }
        }
    }, [isTyping, parsedScript, currentNodeId, currentLineIndex, manualMode, interpolateVariables]);

    // Advance to next line (for manual mode)
    const advanceNextLine = useCallback(() => {
        if (waitingForNext) {
            setWaitingForNext(false);
            setCurrentLineIndex(prev => prev + 1);
        }
    }, [waitingForNext]);

    // Format node name for display (capitalize and remove underscores)
    const formatNodeName = useCallback((nodeName: string): string => {
        return nodeName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, []);

    // Jump to a specific node
    const jumpToNode = useCallback((nodeId: string) => {
        setCurrentNodeId(nodeId);
        setCurrentLineIndex(0);
        setShowNodeMenu(false);
        setWaitingForNext(true);
        setShowOptions(false);
        setWaitingForInput(false);
    }, []);

    // Handle option selection
    const handleOptionSelect = useCallback((option: { text: string; target?: string; condition?: string }) => {
        setLines(prev => [...prev, {text: `> Selected: ${option.text}`, type: 'input'}]);
        setShowOptions(false);
        setOptions([]);

        // Track this choice
        const newSelectedChoices = new Set(selectedChoices);
        newSelectedChoices.add(option.text);
        setSelectedChoices(newSelectedChoices);
        localStorage.setItem('vn_selected_choices', JSON.stringify(Array.from(newSelectedChoices)));

        // Mark current node (containing the choice) as visited
        if (!visitedNodes.has(currentNodeId)) {
            const newVisited = new Set(visitedNodes);
            newVisited.add(currentNodeId);
            setVisitedNodes(newVisited);
            localStorage.setItem(`vn_node_visited_${currentNodeId}`, 'true');
        }

        if (option.target) {
            // Mark target node as visited immediately when choice is selected
            const newVisited = new Set(visitedNodes);
            if (!newVisited.has(currentNodeId)) {
                newVisited.add(currentNodeId);
            }
            newVisited.add(option.target);
            setVisitedNodes(newVisited);
            localStorage.setItem(`vn_node_visited_${option.target}`, 'true');

            setCurrentNodeId(option.target);
            setCurrentLineIndex(0);
        } else {
            setCurrentLineIndex(prev => prev + 1);
        }
    }, [selectedChoices, visitedNodes, currentNodeId]);

    // Handle input submission
    const handleInputSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        if (!inputValue.trim()) return;

        setLines(prev => [...prev,
            {text: inputPrompt, type: 'system'},
            {text: `> ${inputValue}`, type: 'input'}
        ]);

        // Store input in a variable if needed (using the prompt as variable name)
        const varMatch = inputPrompt.match(/\{(\w+)}/);
        if (varMatch) {
            setVariables(prev => ({...prev, [varMatch[1]]: inputValue}));
        }

        setInputValue('');
        setWaitingForInput(false);
        setInputPrompt('');
        setCurrentLineIndex(prev => prev + 1);
    }, [inputValue, inputPrompt]);

    // Process next line when ready
    useEffect(() => {
        if (!isTyping && !showOptions && !waitingForInput && !waitingForNext && !waitingForAuto && parsedScript) {
            const timer = setTimeout(() => {
                processNextLine();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isTyping, showOptions, waitingForInput, waitingForNext, waitingForAuto, currentLineIndex, currentNodeId, parsedScript, processNextLine]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
            if (autoModeTimeoutRef.current) {
                clearTimeout(autoModeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            {/* Full-screen click handler */}
            <div
                className={styles['terminal-vn-fullscreen-handler']}
                onClick={() => {
                    // Focus keyboard handler for keyboard shortcuts
                    if (keyboardRef.current) {
                        keyboardRef.current.focus();
                    }

                    // Handle progression
                    if (isTyping) {
                        skipTyping();
                    } else if (waitingForNext && !showOptions && !waitingForInput && !showHistory && !showNodeMenu) {
                        advanceNextLine();
                    }
                }}
            />

            <div className={`${styles['terminal-vn']} ${className}`} ref={vfxRef}>
                {/* Debug Panel - Top Right */}
                <div className={styles['terminal-vn-debug-panel']}>
                    <div className={styles['terminal-vn-debug-header']}>
                        <div className={styles['terminal-vn-debug-title']}>Debug</div>
                        <button
                            className={styles['terminal-vn-debug-toggle']}
                            onClick={() => setDebugCollapsed(!debugCollapsed)}
                            title={debugCollapsed ? "Expand Debug" : "Collapse Debug"}
                        >
                            {debugCollapsed ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
                        </button>
                    </div>
                    {!debugCollapsed && (
                        <div className={styles['terminal-vn-debug-content']}>
                            <div className={styles['terminal-vn-debug-item']}>
                                <span className={styles['terminal-vn-debug-label']}>Node:</span>
                                <span className={styles['terminal-vn-debug-value']}>{currentNodeId}</span>
                            </div>
                            <div className={styles['terminal-vn-debug-item']}>
                                <span className={styles['terminal-vn-debug-label']}>Line:</span>
                                <span className={styles['terminal-vn-debug-value']}>{currentLineIndex}</span>
                            </div>
                            <div className={styles['terminal-vn-debug-item']}>
                                <span className={styles['terminal-vn-debug-label']}>Mode:</span>
                                <span
                                    className={styles['terminal-vn-debug-value']}>{manualMode ? 'Manual' : 'Auto'}</span>
                            </div>
                            <div className={styles['terminal-vn-debug-item']}>
                                <span className={styles['terminal-vn-debug-label']}>Typing:</span>
                                <span className={styles['terminal-vn-debug-value']}>{isTyping ? 'Yes' : 'No'}</span>
                            </div>
                            <div className={styles['terminal-vn-debug-item']}>
                                <span className={styles['terminal-vn-debug-label']}>Waiting:</span>
                                <span
                                    className={styles['terminal-vn-debug-value']}>{waitingForNext ? 'Yes' : 'No'}</span>
                            </div>
                            <div className={styles['terminal-vn-debug-item']}>
                                <span className={styles['terminal-vn-debug-label']}>Auto Delay:</span>
                                <span
                                    className={styles['terminal-vn-debug-value']}>{waitingForAuto ? 'Yes' : 'No'}</span>
                            </div>
                            {Object.keys(variables).length > 0 && (
                                <>
                                    <div className={styles['terminal-vn-debug-divider']}></div>
                                    <div className={styles['terminal-vn-debug-section']}>Variables:</div>
                                    {Object.entries(variables).map(([key, value]) => (
                                        <div key={key} className={styles['terminal-vn-debug-item']}>
                                            <span className={styles['terminal-vn-debug-label']}>{key}:</span>
                                            <span className={styles['terminal-vn-debug-value']}>
                                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {hasError && (
                    <div className={styles['terminal-vn-header']}>
                        <div className={styles['terminal-vn-title']}>
                            <span className={styles['terminal-vn-prompt']}>$</span> VN_ENGINE v1.0.0 - ERROR
                        </div>
                    </div>
                )}

                <div
                    className={styles['terminal-vn-body']}
                    ref={terminalRef}
                    style={{display: isCollapsed ? 'none' : 'block'}}
                    onClick={() => {
                        // Focus keyboard handler for keyboard shortcuts
                        if (keyboardRef.current) {
                            keyboardRef.current.focus();
                        }

                        // Handle progression
                        if (isTyping) {
                            skipTyping();
                        } else if (waitingForNext && !showOptions && !waitingForInput && !showHistory && !showNodeMenu) {
                            advanceNextLine();
                        }
                    }}
                >
                    {!autoClear && lines.map((line, index) => (
                        <div key={`line-${index}`}
                             className={`${styles['terminal-vn-line']} ${styles[`terminal-vn-line-${line.type}`]}`}>
                            {line.text}
                        </div>
                    ))}

                    {autoClear && lines.length > 0 && (
                        <div key="dialogue-box" className={styles['terminal-vn-dialogue-box']}>
                            {lines.map((line, index) => (
                                <div key={`dlg-${index}`}
                                     className={`${styles['terminal-vn-line']} ${styles[`terminal-vn-line-${line.type}`]}`}>
                                    {line.text}
                                </div>
                            ))}
                            {currentText && isTyping && (
                                <div key="typing"
                                     className={`${styles['terminal-vn-line']} ${styles['terminal-vn-line-dialogue']} ${styles['terminal-vn-typing']}`}>
                                    {currentText}
                                    <span className={styles['terminal-vn-cursor']}>▊</span>
                                </div>
                            )}
                        </div>
                    )}

                    {autoClear && lines.length === 0 && currentText && isTyping && (
                        <div key="typing-box" className={styles['terminal-vn-dialogue-box']}>
                            <div key="typing"
                                 className={`${styles['terminal-vn-line']} ${styles['terminal-vn-line-dialogue']} ${styles['terminal-vn-typing']}`}>
                                {currentText}
                                <span className={styles['terminal-vn-cursor']}>▊</span>
                            </div>
                        </div>
                    )}

                    {showOptions && options.length > 0 && (
                        <div className={styles['terminal-vn-options']}>
                            <div className={styles['terminal-vn-options-prompt']}>{'>'} Select an option:</div>
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className={styles['terminal-vn-option']}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    <span className={styles['terminal-vn-option-index']}>[{index + 1}]</span>
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    )}

                    {waitingForInput && (
                        <form onSubmit={handleInputSubmit} className={styles['terminal-vn-input-form']}>
                            <div className={styles['terminal-vn-input-prompt']}>{inputPrompt}</div>
                            <div className={styles['terminal-vn-input-wrapper']}>
                                <span className={styles['terminal-vn-prompt']}>{'>'}</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className={styles['terminal-vn-input']}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Node Menu - Modal Popup */}
                {showNodeMenu && parsedScript && (
                    <div
                        className={styles['terminal-vn-modal-backdrop']}
                        onClick={() => setShowNodeMenu(false)}
                    >
                        <div
                            className={`${styles['terminal-vn-modal-content']} ${styles['terminal-vn-node-menu']}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles['terminal-vn-modal-header']}>
                                <div className={styles['terminal-vn-overlay-title']}>Jump to Node</div>
                                <button
                                    className={styles['terminal-vn-modal-close']}
                                    onClick={() => setShowNodeMenu(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className={styles['terminal-vn-node-grid']}>
                                {Object.keys(parsedScript.nodes).map(nodeId => {
                                    const isVisited = visitedNodes.has(nodeId);
                                    const isCurrent = nodeId === currentNodeId;
                                    const optionClasses = [
                                        styles['terminal-vn-node-option'],
                                        isCurrent ? styles['current'] : '',
                                        !isVisited && nodeId !== 'start' ? styles['locked'] : ''
                                    ].filter(Boolean).join(' ');

                                    return (
                                        <button
                                            key={nodeId}
                                            className={optionClasses}
                                            onClick={() => jumpToNode(nodeId)}
                                            disabled={!isVisited && nodeId !== 'start'}
                                        >
                                            {formatNodeName(nodeId)}
                                            {isVisited && <span className={styles['terminal-vn-node-badge']}>✓</span>}
                                            {!isVisited && nodeId !== 'start' && <span
                                                className={`${styles['terminal-vn-node-badge']} ${styles['locked']}`}>🔒</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* History Panel - Modal Popup */}
                {showHistory && (
                    <div
                        className={styles['terminal-vn-modal-backdrop']}
                        onClick={() => setShowHistory(false)}
                    >
                        <div
                            className={`${styles['terminal-vn-modal-content']} ${styles['terminal-vn-history-panel']}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles['terminal-vn-modal-header']}>
                                <div className={styles['terminal-vn-overlay-title']}>Dialogue History</div>
                                <button
                                    className={styles['terminal-vn-modal-close']}
                                    onClick={() => setShowHistory(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            {history.length === 0 ? (
                                <div className={styles['terminal-vn-history-empty']}>
                                    No dialogue history yet...
                                </div>
                            ) : (
                                <div className={styles['terminal-vn-history-list']}>
                                    {history.map((entry, index) => (
                                        <div key={index} className={styles['terminal-vn-history-entry']}>
                                            {entry.speaker && (
                                                <div className={styles['terminal-vn-history-speaker']}>
                                                    [{entry.speaker}]
                                                </div>
                                            )}
                                            <div className={styles['terminal-vn-history-text']}>
                                                {entry.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!isCollapsed && (
                    <div className={`${styles['terminal-vn-footer']} ${styles['terminal-vn-footer-fixed']}`}>
                        {isTyping && (
                            <div className={styles['terminal-vn-status-message']}>
                                Click or press SPACE to skip
                            </div>
                        )}
                        {waitingForNext && !isTyping && (
                            <div className={styles['terminal-vn-status-message']}>
                                Click or press SPACE/ENTER to continue
                            </div>
                        )}

                        <div className={styles['terminal-vn-controls-bottom']}>
                            <button
                                className={styles['terminal-vn-control-btn-bottom']}
                                onClick={() => setShowHistory(!showHistory)}
                                title="Toggle History"
                            >
                                <History size={16}/>
                                <span className={styles['terminal-vn-control-label']}>History</span>
                            </button>

                            <button
                                className={styles['terminal-vn-control-btn-bottom']}
                                onClick={() => setShowNodeMenu(!showNodeMenu)}
                                title="Toggle Menu"
                            >
                                <Menu size={16}/>
                                <span className={styles['terminal-vn-control-label']}>Menu</span>
                            </button>

                            <button
                                className={styles['terminal-vn-control-btn-bottom']}
                                onClick={() => setManualMode(!manualMode)}
                                title={manualMode ? "Switch to Auto Mode" : "Switch to Manual Mode"}
                            >
                                {manualMode ? <Play size={16}/> : <Pause size={16}/>}
                                <span
                                    className={styles['terminal-vn-control-label']}>{manualMode ? 'Auto' : 'Pause'}</span>
                            </button>

                            <button
                                className={styles['terminal-vn-control-btn-bottom']}
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                title="Collapse Terminal"
                            >
                                <ChevronUp size={16}/>
                                <span className={styles['terminal-vn-control-label']}>Collapse</span>
                            </button>
                        </div>
                    </div>
                )}

                {isCollapsed && (
                    <div className={`${styles['terminal-vn-footer']} ${styles['terminal-vn-footer-fixed']}`}>
                        <button
                            className={styles['terminal-vn-control-btn-bottom']}
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            title="Expand Terminal"
                        >
                            <ChevronDown size={16}/>
                            <span className={styles['terminal-vn-control-label']}>Expand</span>
                        </button>
                    </div>
                )}

                {/* Keyboard shortcuts */}
                <div
                    ref={keyboardRef}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        // Advance in manual mode
                        if ((e.key === ' ' || e.key === 'Enter') && waitingForNext && !waitingForInput) {
                            e.preventDefault();
                            advanceNextLine();
                        }
                        // Skip typing
                        else if (e.key === ' ' && isTyping && !waitingForInput) {
                            e.preventDefault();
                            skipTyping();
                        }
                        // Toggle manual mode with M key
                        else if (e.key === 'm' || e.key === 'M') {
                            e.preventDefault();
                            setManualMode(!manualMode);
                        }
                        // Toggle collapse with C key
                        else if (e.key === 'c' || e.key === 'C') {
                            e.preventDefault();
                            setIsCollapsed(!isCollapsed);
                        }
                        // Toggle history with H key
                        else if (e.key === 'h' || e.key === 'H') {
                            e.preventDefault();
                            setShowHistory(!showHistory);
                        }
                        // Number keys for choices
                        else if (e.key >= '1' && e.key <= '9' && showOptions) {
                            const index = parseInt(e.key) - 1;
                            if (index < options.length) {
                                e.preventDefault();
                                handleOptionSelect(options[index]);
                            }
                        }
                    }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        outline: 'none',
                        pointerEvents: 'none'
                    }}
                />
            </div>
        </>
    );
}

export default TerminalVN;
