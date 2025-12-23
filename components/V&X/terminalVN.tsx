'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {TerminalVNProps, TerminalVNScript} from '@/types';
import {parseVNScript} from '@/lib/client/utils';
import '@/styles/terminal-vn.module.css';


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

    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Parse script on mount or when script changes
    useEffect(() => {
        try {
            const parsed = parseVNScript(script);
            setParsedScript(parsed);
            setCurrentNodeId('start');
            setCurrentLineIndex(0);
            setLines([{text: '> VN Engine Initialized...', type: 'system'}]);
        } catch (error) {
            setLines([
                {text: '> VN Engine Error', type: 'error'},
                {text: `> ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error'}
            ]);
        }
    }, [script]);

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

    // Notify parent of variable changes
    useEffect(() => {
        if (onVariableChange) {
            onVariableChange(variables);
        }
    }, [variables, onVariableChange]);

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
                        switch (cmd) {
                            case 'add':
                                result = current + operand;
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
        }
    }, [variables]);

    // Process next line
    const processNextLine = useCallback(() => {
        if (!parsedScript) return;

        const currentNode = parsedScript.nodes[currentNodeId];
        if (!currentNode) {
            // Node not found, end execution
            if (onComplete) onComplete();
            return;
        }

        if (currentLineIndex >= currentNode.lines.length) {
            // Node complete, handle jump
            if (currentNode.jump) {
                setCurrentNodeId(currentNode.jump);
                setCurrentLineIndex(0);
            } else if (onComplete) {
                onComplete();
            }
            return;
        }

        const line = currentNode.lines[currentLineIndex];

        // Check condition if present
        if (line.condition && !evaluateCondition(line.condition)) {
            setCurrentLineIndex(prev => prev + 1);
            return;
        }

        switch (line.type) {
            case 'dialogue':
                typeText(line.content, line.speaker);
                break;

            case 'command':
                executeCommand(line.content);
                setCurrentLineIndex(prev => prev + 1);
                // Continue to next line immediately
                setTimeout(() => processNextLine(), 50);
                break;

            case 'choice':
                // Filter options by condition
                const availableOptions = (line.options || []).filter(opt =>
                    !opt.condition || evaluateCondition(opt.condition)
                );
                setOptions(availableOptions);
                setShowOptions(true);
                break;

            case 'input':
                setInputPrompt(line.content);
                setWaitingForInput(true);
                break;
        }
    }, [parsedScript, currentNodeId, currentLineIndex, evaluateCondition, executeCommand, onComplete]);

    // Type text effect
    const typeText = useCallback((text: string, speaker?: string) => {
        setIsTyping(true);
        setCurrentText('');

        const fullText = speaker ? `[${speaker}]: ${text}` : `> ${text}`;
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
                setLines(prev => [...prev, {text: fullText, type: 'dialogue'}]);
                setCurrentText('');
                setCurrentLineIndex(prev => prev + 1);
            }
        }, typingSpeed);
    }, [typingSpeed]);

    // Skip typing animation
    const skipTyping = useCallback(() => {
        if (isTyping && typingIntervalRef.current && parsedScript) {
            clearInterval(typingIntervalRef.current);
            const currentNode = parsedScript.nodes[currentNodeId];
            const line = currentNode?.lines[currentLineIndex];

            if (line && line.type === 'dialogue') {
                const fullText = line.speaker ? `[${line.speaker}]: ${line.content}` : `> ${line.content}`;
                setLines(prev => [...prev, {text: fullText, type: 'dialogue'}]);
                setCurrentText('');
                setIsTyping(false);
                setCurrentLineIndex(prev => prev + 1);
            }
        }
    }, [isTyping, parsedScript, currentNodeId, currentLineIndex]);

    // Handle option selection
    const handleOptionSelect = useCallback((option: { text: string; target?: string; condition?: string }) => {
        setLines(prev => [...prev, {text: `> Selected: ${option.text}`, type: 'input'}]);
        setShowOptions(false);
        setOptions([]);

        if (option.target) {
            setCurrentNodeId(option.target);
            setCurrentLineIndex(0);
        } else {
            setCurrentLineIndex(prev => prev + 1);
        }
    }, []);

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
        if (!isTyping && !showOptions && !waitingForInput && parsedScript) {
            const timer = setTimeout(() => processNextLine(), 100);
            return () => clearTimeout(timer);
        }
    }, [isTyping, showOptions, waitingForInput, currentLineIndex, currentNodeId, parsedScript, processNextLine]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        };
    }, []);

    return (
        <div className={`terminal-vn ${className}`}>
            <div className="terminal-vn-header">
                <div className="terminal-vn-title">
                    <span className="terminal-vn-prompt">$</span> VN_ENGINE v1.0.0
                </div>
                <div className="terminal-vn-controls">
                    <button
                        className="terminal-vn-control-btn"
                        onClick={() => setLines([])}
                        title="Clear"
                    >
                        ⎚
                    </button>
                </div>
            </div>

            <div className="terminal-vn-body" ref={terminalRef}>
                {lines.map((line, index) => (
                    <div key={index} className={`terminal-vn-line terminal-vn-line-${line.type}`}>
                        {line.text}
                    </div>
                ))}

                {currentText && (
                    <div className="terminal-vn-line terminal-vn-line-dialogue terminal-vn-typing">
                        {currentText}
                        <span className="terminal-vn-cursor">▊</span>
                    </div>
                )}

                {showOptions && options.length > 0 && (
                    <div className="terminal-vn-options">
                        <div className="terminal-vn-options-prompt">{'>'} Select an option:</div>
                        {options.map((option, index) => (
                            <button
                                key={index}
                                className="terminal-vn-option"
                                onClick={() => handleOptionSelect(option)}
                            >
                                <span className="terminal-vn-option-index">[{index + 1}]</span>
                                {option.text}
                            </button>
                        ))}
                    </div>
                )}

                {waitingForInput && (
                    <form onSubmit={handleInputSubmit} className="terminal-vn-input-form">
                        <div className="terminal-vn-input-prompt">{inputPrompt}</div>
                        <div className="terminal-vn-input-wrapper">
                            <span className="terminal-vn-prompt">{'>'}</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="terminal-vn-input"
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </form>
                )}
            </div>

            {isTyping && (
                <div className="terminal-vn-footer">
                    <button
                        className="terminal-vn-skip-btn"
                        onClick={skipTyping}
                    >
                        Press SPACE to skip
                    </button>
                </div>
            )}

            {/* Keyboard shortcuts */}
            <div
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === ' ' && isTyping && !waitingForInput) {
                        e.preventDefault();
                        skipTyping();
                    }
                    if (e.key >= '1' && e.key <= '9' && showOptions) {
                        const index = parseInt(e.key) - 1;
                        if (index < options.length) {
                            e.preventDefault();
                            handleOptionSelect(options[index]);
                        }
                    }
                }}
                style={{position: 'absolute', opacity: 0, pointerEvents: 'none'}}
            />
        </div>
    );
}

export default TerminalVN;

