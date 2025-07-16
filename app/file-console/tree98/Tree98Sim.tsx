"use client"

import React, {useEffect, useRef, useState} from 'react';
import LoginScreen from './LoginScreen';
import {
    COLORS,
    DESKTOP_ICONS,
    FILE_SYSTEM,
    FileSystemItem,
    FONTS,
    MESSAGES,
    START_MENU_ITEMS,
    SYSTEM_CONFIG,
} from './config';
import {getIcon} from './icons';
import {signCookie} from "@/lib/cookies";
import Cookies from "js-cookie";

interface Window {
    id: string;
    title: string;
    component: React.ComponentType<any>;
    x: number;
    y: number;
    width: number;
    height: number;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    props?: any;
}

interface ContextMenu {
    x: number;
    y: number;
    visible: boolean;
}

const Tree98Sim: React.FC = () => {
    const [bootPhase, setBootPhase] = useState<'boot' | 'main' | 'loading' | 'login' | 'desktop'>('boot');
    const [tree98BootText, setTree98BootText] = useState('');
    const [bootText, setBootText] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [windows, setWindows] = useState<Window[]>([]);
    const [nextZIndex, setNextZIndex] = useState(1);
    const [systemCorruption, setSystemCorruption] = useState(0);
    const [errorPopups, setErrorPopups] = useState<string[]>([]);
    const [isSystemCrashing, setIsSystemCrashing] = useState(false);
    const [showBlueScreen, setShowBlueScreen] = useState(false);
    const [showStartMenu, setShowStartMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [contextMenu, setContextMenu] = useState<ContextMenu>({x: 0, y: 0, visible: false});
    const [showDesktopIcons, setShowDesktopIcons] = useState(true);
    const [dragState, setDragState] = useState<{
        isDragging: boolean;
        windowId: string | null;
        startX: number;
        startY: number;
        initialX: number;
        initialY: number;
    }>({
        isDragging: false,
        windowId: null,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0
    });

    // Check cutscene status
    useEffect(() => {
        if (Cookies.get(SYSTEM_CONFIG.CUTSCENE_COOKIE) === 'true') {
            window.location.href = SYSTEM_CONFIG.REDIRECT_URL;
            return;
        }
    }, []);

    // Boot sequence
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

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
                    return prev + 2;
                });
            }, SYSTEM_CONFIG.LOADING_BAR_SPEED);
        };

        return () => {
            clearInterval(timeInterval);
        };
    }, []);

    // System corruption effects
    useEffect(() => {
        if (systemCorruption > 0) {
            const corruptionInterval = setInterval(() => {
                if (systemCorruption < SYSTEM_CONFIG.MAX_CORRUPTION_LEVEL) {
                    const randomMessage = MESSAGES.TREE[Math.floor(Math.random() * MESSAGES.TREE.length)];
                    setErrorPopups(prev => [...prev, randomMessage]);

                    if (Math.random() < SYSTEM_CONFIG.ERROR_POPUP_CHANCE) {
                        createWindow('System Error', ErrorDialog,
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
    }, [systemCorruption]);

    // Mouse event handlers for dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (dragState.isDragging && dragState.windowId) {
                const deltaX = e.clientX - dragState.startX;
                const deltaY = e.clientY - dragState.startY;

                setWindows(prev => prev.map(w =>
                    w.id === dragState.windowId
                        ? {
                            ...w,
                            x: Math.max(0, Math.min(window.innerWidth - w.width, dragState.initialX + deltaX)),
                            y: Math.max(0, Math.min(window.innerHeight - w.height - 32, dragState.initialY + deltaY))
                        }
                        : w
                ));
            }
        };

        const handleMouseUp = () => {
            setDragState(prev => ({...prev, isDragging: false, windowId: null}));
        };

        if (dragState.isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragState]);

    const createWindow = (
        title: string,
        component: React.ComponentType<any>,
        x: number,
        y: number,
        width: number = SYSTEM_CONFIG.DEFAULT_WINDOW_WIDTH,
        height: number = SYSTEM_CONFIG.DEFAULT_WINDOW_HEIGHT,
        props: any = {}
    ) => {
        const newWindow: Window = {
            id: Date.now().toString(),
            title,
            component,
            x,
            y,
            width,
            height,
            isMinimized: false,
            isMaximized: false,
            zIndex: nextZIndex,
            props
        };

        setWindows(prev => [...prev, newWindow]);
        setNextZIndex(prev => prev + 1);
    };

    const closeWindow = (id: string) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    };

    const bringToFront = (id: string) => {
        setWindows(prev => prev.map(w =>
            w.id === id ? {...w, zIndex: nextZIndex} : w
        ));
        setNextZIndex(prev => prev + 1);
    };

    const startDrag = (e: React.MouseEvent, windowId: string) => {
        e.preventDefault();
        const window = windows.find(w => w.id === windowId);
        if (window) {
            setDragState({
                isDragging: true,
                windowId,
                startX: e.clientX,
                startY: e.clientY,
                initialX: window.x,
                initialY: window.y
            });
            bringToFront(windowId);
        }
    };

    const handleFileOpen = (item: FileSystemItem) => {
        if (item.executable && item.name === 'VESSEL_BOOT.EXE') {
            setSystemCorruption(1);
            createWindow('VESSEL_BOOT.EXE - CRITICAL ERROR', VesselBootDialog, 100, 100, 500, 300, {item});
        } else if (item.type === 'file') {
            createWindow(item.name, FileViewer, 100 + Math.random() * 200, 100 + Math.random() * 200, 500, 400, {item});
        }
    };

    const handleDesktopIconClick = (action: string) => {
        switch (action) {
            case 'file-explorer':
                createWindow('My Computer', FileExplorer, 100, 100, 600, 400);
                break;
            case 'notepad':
                createWindow('Untitled - Notepad', Notepad, 150, 150, 500, 400);
                break;
            case 'paint':
                createWindow('Untitled - Paint', Paint, 200, 200, 600, 450);
                break;
        }
    };

    const handleStartMenuAction = (action: string) => {
        setShowStartMenu(false);
        switch (action) {
            case 'notepad':
                createWindow('Untitled - Notepad', Notepad, 150, 150, 500, 400);
                break;
            case 'paint':
                createWindow('Untitled - Paint', Paint, 200, 200, 600, 450);
                break;
            case 'file-explorer':
                createWindow('My Computer', FileExplorer, 100, 100, 600, 400);
                break;
            case 'documents':
                createWindow('My Documents', FileExplorer, 120, 120, 600, 400, {startPath: ['My Computer', 'C:', 'Desktop']});
                break;
            case 'settings':
                createWindow('Control Panel', ControlPanel, 140, 140, 400, 300);
                break;
            case 'run':
                createWindow('Run', RunDialog, 300, 300, 350, 150);
                break;
            case 'shutdown':
                createWindow('Shut Down TreeOS', ShutdownDialog, 250, 250, 300, 200);
                break;
        }
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            visible: true
        });
    };

    const handleContextMenuAction = (action: string) => {
        if (action === 'toggle-icons') {
            setShowDesktopIcons(!showDesktopIcons);
        }
        setContextMenu({...contextMenu, visible: false});
    };

    // File save/load utilities
    const downloadFile = (filename: string, content: string) => {
        const element = document.createElement('a');
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const uploadFile = (): Promise<string> => {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt';
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string || '');
                    reader.readAsText(file);
                }
            };
            input.click();
        });
    };

    // Component definitions
    const FileViewer = ({item}: { item: FileSystemItem }) => (
        <div className="p-4 h-full overflow-auto" style={{fontFamily: FONTS.MONO, fontSize: '12px'}}>
            <pre className="whitespace-pre-wrap text-black">{item.content}</pre>
        </div>
    );

    const VesselBootDialog = ({item}: { item: FileSystemItem }) => (
        <div className="p-4 h-full overflow-auto bg-black text-green-400"
             style={{fontFamily: FONTS.MONO, fontSize: '11px'}}>
            <div className="animate-pulse">
                <pre className="whitespace-pre-wrap">{item.content}</pre>
            </div>
            <div className="mt-4 text-red-400 animate-pulse">
                [SYSTEM CORRUPTION INITIATED]
            </div>
        </div>
    );

    const Notepad = () => {
        const [text, setText] = useState('');
        const [filename, setFilename] = useState('Untitled');

        const handleSave = () => {
            downloadFile(`${filename}.txt`, text);
        };

        const handleOpen = async () => {
            try {
                const content = await uploadFile();
                setText(content);
                setFilename('Opened File');
            } catch (err) {
                console.error('Failed to open file:', err);
            }
        };

        return (
            <div className="flex flex-col h-full bg-white">
                <div className="border-b p-1 text-xs bg-gray-100 flex gap-4">
                    <button onClick={handleOpen} className="hover:bg-gray-200 px-2 py-1">File</button>
                    <button onClick={handleSave} className="hover:bg-gray-200 px-2 py-1">Save</button>
                    <span>Edit Format View Help</span>
                </div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 p-2 border-none outline-none resize-none bg-white text-black"
                    style={{fontFamily: FONTS.MONO, fontSize: '12px'}}
                    placeholder="Type your text here..."
                />
            </div>
        );
    };

    const Paint = () => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [isDrawing, setIsDrawing] = useState(false);
        const [currentColor, setCurrentColor] = useState('#000000');
        const [brushSize, setBrushSize] = useState(2);

        const startDrawing = (e: React.MouseEvent) => {
            setIsDrawing(true);
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const rect = canvas.getBoundingClientRect();
                if (ctx) {
                    ctx.strokeStyle = currentColor;
                    ctx.lineWidth = brushSize;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                }
            }
        };

        const draw = (e: React.MouseEvent) => {
            if (!isDrawing) return;
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const rect = canvas.getBoundingClientRect();
                if (ctx) {
                    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                    ctx.stroke();
                }
            }
        };

        const clearCanvas = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        };

        const saveImage = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const link = document.createElement('a');
                link.download = 'painting.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        };

        const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

        return (
            <div className="flex flex-col h-full bg-white">
                <div className="border-b p-1 text-xs bg-gray-100 flex gap-4">
                    <button onClick={clearCanvas} className="hover:bg-gray-200 px-2 py-1">Clear</button>
                    <button onClick={saveImage} className="hover:bg-gray-200 px-2 py-1">Save</button>
                    <span>File Edit View Image Colors Help</span>
                </div>
                <div className="flex flex-1">
                    <div className="w-20 border-r p-2 bg-gray-100">
                        <div className="mb-4">
                            <div className="text-xs mb-2">Colors:</div>
                            <div className="grid grid-cols-2 gap-1">
                                {colors.map(color => (
                                    <div
                                        key={color}
                                        className={`w-6 h-6 border cursor-pointer ${currentColor === color ? 'border-2 border-black' : ''}`}
                                        style={{backgroundColor: color}}
                                        onClick={() => setCurrentColor(color)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs mb-2">Brush:</div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={brushSize}
                                onChange={(e) => setBrushSize(Number(e.target.value))}
                                className="w-full"
                            />
                            <div className="text-xs text-center">{brushSize}px</div>
                        </div>
                    </div>
                    <div className="flex-1 p-2">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={350}
                            className="border bg-white cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={() => setIsDrawing(false)}
                            onMouseLeave={() => setIsDrawing(false)}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const FileExplorer = ({startPath}: { startPath?: string[] }) => {
        const [currentPath, setCurrentPath] = useState(startPath || ['My Computer']);
        const [currentItems, setCurrentItems] = useState(() => {
            if (startPath) {
                let items = FILE_SYSTEM;
                for (let i = 1; i < startPath.length; i++) {
                    const folder = items.find(item => item.name === startPath[i] && item.type === 'folder');
                    if (folder && folder.children) {
                        items = folder.children;
                    }
                }
                return items;
            }
            return FILE_SYSTEM;
        });

        const navigate = (path: string[]) => {
            let items = FILE_SYSTEM;
            for (let i = 1; i < path.length; i++) {
                const folder = items.find(item => item.name === path[i] && item.type === 'folder');
                if (folder && folder.children) {
                    items = folder.children;
                }
            }
            setCurrentPath(path);
            setCurrentItems(items);
        };

        const openItem = (item: FileSystemItem) => {
            if (item.type === 'folder') {
                navigate([...currentPath, item.name]);
            } else {
                handleFileOpen(item);
            }
        };

        const goBack = () => {
            if (currentPath.length > 1) {
                navigate(currentPath.slice(0, -1));
            }
        };

        const goUp = () => {
            if (currentPath.length > 1) {
                navigate(['My Computer']);
            }
        };

        return (
            <div className="flex flex-col h-full bg-white">
                <div className="border-b p-1 text-xs bg-gray-100 flex gap-4">
                    <button onClick={goBack} className="hover:bg-gray-200 px-2 py-1">File</button>
                    <button onClick={goUp} className="hover:bg-gray-200 px-2 py-1">Edit</button>
                    <span>View Go Favorites Tools Help</span>
                </div>
                <div className="flex items-center p-2 border-b bg-gray-50 gap-2">
                    <button
                        onClick={goBack}
                        disabled={currentPath.length <= 1}
                        className="px-3 py-1 border bg-gray-200 text-xs disabled:opacity-50 hover:bg-gray-300"
                        style={{fontFamily: FONTS.SYSTEM}}
                    >
                        Back
                    </button>
                    <button
                        onClick={goUp}
                        disabled={currentPath.length <= 1}
                        className="px-3 py-1 border bg-gray-200 text-xs disabled:opacity-50 hover:bg-gray-300"
                        style={{fontFamily: FONTS.SYSTEM}}
                    >
                        Up
                    </button>
                    <span className="text-xs flex-1" style={{fontFamily: FONTS.SYSTEM}}>
            {currentPath.join(' \\ ')}
          </span>
                </div>
                <div className="flex-1 p-2 overflow-auto bg-white">
                    <div className="grid grid-cols-4 gap-4">
                        {currentItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center p-2 hover:bg-blue-100 cursor-pointer rounded"
                                onDoubleClick={() => openItem(item)}
                                style={{fontFamily: FONTS.SYSTEM}}
                            >
                                <div className="w-8 h-8 mb-1">
                                    {getIcon(item.icon || (item.type === 'folder' ? 'folder' : 'notepad'))}
                                </div>
                                <span className="text-xs text-center break-words max-w-full text-black">
                  {item.name}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const ControlPanel = () => (
        <div className="p-4 h-full bg-white">
            <div className="text-sm mb-4" style={{fontFamily: FONTS.SYSTEM}}>
                Control Panel
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-2 hover:bg-blue-100 cursor-pointer">
                    <div className="w-8 h-8 mb-1">{getIcon('settings')}</div>
                    <span className="text-xs text-center">Display</span>
                </div>
                <div className="flex flex-col items-center p-2 hover:bg-blue-100 cursor-pointer">
                    <div className="w-8 h-8 mb-1">{getIcon('settings')}</div>
                    <span className="text-xs text-center">System</span>
                </div>
                <div className="flex flex-col items-center p-2 hover:bg-blue-100 cursor-pointer">
                    <div className="w-8 h-8 mb-1">{getIcon('settings')}</div>
                    <span className="text-xs text-center">Network</span>
                </div>
            </div>
        </div>
    );

    const RunDialog = () => {
        const [command, setCommand] = useState('');

        const handleRun = () => {
            if (command.toLowerCase().includes('notepad')) {
                createWindow('Untitled - Notepad', Notepad, 150, 150, 500, 400);
            } else if (command.toLowerCase().includes('mspaint')) {
                createWindow('Untitled - Paint', Paint, 200, 200, 600, 450);
            }
        };

        return (
            <div className="p-4 bg-white">
                <div className="text-sm mb-4" style={{fontFamily: FONTS.SYSTEM}}>
                    Type the name of a program, folder, document, or Internet resource, and TREE will open it for you.
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-2">Open:</label>
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        className="w-full p-2 border border-gray-400 bg-white text-sm"
                        style={{fontFamily: FONTS.SYSTEM}}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleRun}
                        className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300"
                        style={{fontFamily: FONTS.SYSTEM, borderStyle: 'outset'}}
                    >
                        OK
                    </button>
                    <button
                        className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300"
                        style={{fontFamily: FONTS.SYSTEM, borderStyle: 'outset'}}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    const ShutdownDialog = () => (
        <div className="p-4 bg-white text-center">
            <div className="w-12 h-12 mx-auto mb-4">
                {getIcon('shutdown')}
            </div>
            <div className="text-sm mb-4" style={{fontFamily: FONTS.SYSTEM}}>
                What do you want the computer to do?
            </div>
            <div className="space-y-2 mb-4">
                <label className="flex items-center">
                    <input type="radio" name="shutdown" className="mr-2" defaultChecked/>
                    <span className="text-sm">Shut down the computer</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="shutdown" className="mr-2"/>
                    <span className="text-sm">Restart the computer</span>
                </label>
            </div>
            <div className="flex justify-center gap-2">
                <button
                    className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300"
                    style={{fontFamily: FONTS.SYSTEM, borderStyle: 'outset'}}
                >
                    OK
                </button>
                <button
                    className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300"
                    style={{fontFamily: FONTS.SYSTEM, borderStyle: 'outset'}}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    const ErrorDialog = ({message}: { message: string }) => (
        <div className="p-4 text-center h-full flex flex-col justify-center bg-white">
            <div className="w-12 h-12 mx-auto mb-4">
                {getIcon('error')}
            </div>
            <div className="text-sm mb-4" style={{fontFamily: FONTS.SYSTEM}}>
                {message}
            </div>
            <button
                className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300"
                style={{fontFamily: FONTS.SYSTEM}}
                onClick={() => {
                }}
            >
                OK
            </button>
        </div>
    );

    const StartMenu = () => (
        <div
            className="absolute bottom-8 left-0 w-64 bg-gray-200 border-2 border-gray-400 shadow-lg"
            style={{fontFamily: FONTS.SYSTEM}}
        >
            <div className="bg-blue-600 text-white p-2 text-sm font-bold">
                tree98
            </div>
            <div className="p-1">
                {START_MENU_ITEMS.map((item, index) => (
                    <div
                        key={index}
                        className="p-2 hover:bg-blue-100 cursor-pointer text-sm flex items-center"
                        onClick={() => 'action' in item && handleStartMenuAction(item.action)}
                    >
                        <div className="w-4 h-4 mr-2">
                            {getIcon(item.icon)}
                        </div>
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );

    const ContextMenuComponent = () => (
        <div
            className="absolute bg-gray-200 border border-gray-400 shadow-lg py-1 z-50"
            style={{
                left: contextMenu.x,
                top: contextMenu.y,
                fontFamily: FONTS.SYSTEM,
                fontSize: '12px'
            }}
        >
            <div
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleContextMenuAction('toggle-icons')}
            >
                {showDesktopIcons ? 'Hide Icons' : 'Show Icons'}
            </div>
        </div>
    );

    const WindowComponent = ({window}: { window: Window }) => {
        const Component = window.component;
        const glitchX = systemCorruption > 2 ? Math.random() * SYSTEM_CONFIG.GLITCH_POSITION_MAX - 5 : 0;
        const glitchY = systemCorruption > 2 ? Math.random() * SYSTEM_CONFIG.GLITCH_POSITION_MAX - 5 : 0;
        const rotation = systemCorruption > 4 ? Math.random() * SYSTEM_CONFIG.GLITCH_ROTATION_MAX - 2 : 0;

        return (
            <div
                className="absolute border-2 shadow-lg"
                style={{
                    left: window.x + glitchX,
                    top: window.y + glitchY,
                    width: window.width,
                    height: window.height,
                    zIndex: window.zIndex,
                    transform: `rotate(${rotation}deg)`,
                    backgroundColor: COLORS.WINDOW_BG,
                    borderColor: COLORS.WINDOW_BORDER,
                    fontFamily: FONTS.SYSTEM
                }}
                onClick={() => bringToFront(window.id)}
            >
                <div
                    className="text-white px-2 py-1 flex items-center justify-between text-xs cursor-move select-none"
                    style={{backgroundColor: COLORS.TITLE_BAR}}
                    onMouseDown={(e) => startDrag(e, window.id)}
                >
                    <span>{window.title}</span>
                    <div className="flex gap-1">
                        <button
                            className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400">
                            {getIcon('minimize')}
                        </button>
                        <button
                            className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400">
                            {getIcon('maximize')}
                        </button>
                        <button
                            className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeWindow(window.id);
                            }}
                        >
                            {getIcon('close')}
                        </button>
                    </div>
                </div>

                <div className="h-full overflow-hidden" style={{height: 'calc(100% - 24px)'}}>
                    <Component {...window.props} />
                </div>
            </div>
        );
    };

    const LoadingScreen = () => (
        <div
            className="w-full h-screen bg-black text-white flex flex-col items-center justify-center"
            style={{fontFamily: FONTS.BOOT}}
        >
            <div className="text-lg mb-8">Starting tree98...</div>
            <div className="w-64 h-4 border border-white bg-black">
                <div
                    className="h-full bg-blue-600 transition-all duration-100"
                    style={{width: `${loadingProgress}%`}}
                />
            </div>
            <div className="text-sm mt-4">{loadingProgress}%</div>
        </div>
    );

    // Show appropriate boot phase
    if (bootPhase === 'boot') {
        return (
            <div
                className="w-full h-screen bg-black text-green-400 p-8"
                style={{fontFamily: FONTS.BOOT}}
            >
                <div className="whitespace-pre-wrap text-sm">
                    {tree98BootText}
                </div>
                <div className="mt-4 animate-pulse">_</div>
            </div>
        );
    }

    if (bootPhase === 'main') {
        return (
            <div
                className="w-full h-screen bg-black text-green-400 p-8"
                style={{fontFamily: FONTS.BOOT}}
            >
                <div className="whitespace-pre-wrap text-sm">
                    {bootText}
                </div>
                <div className="mt-4 animate-pulse">_</div>
            </div>
        );
    }

    if (bootPhase === 'loading') {
        return <LoadingScreen/>;
    }

    if (bootPhase === 'login') {
        if (Cookies.get(SYSTEM_CONFIG.LOGIN_COOKIE)) {
            setBootPhase('desktop');
            return null;
        }
        return <LoginScreen onLogin={() => setBootPhase('desktop')}/>;
    }

    // Blue Screen of Death
    if (showBlueScreen) {
        return (
            <div
                className="w-full h-screen text-white p-8"
                style={{backgroundColor: '#000080', fontFamily: FONTS.MONO, color: COLORS.TEXT_COLOR}}
            >
                <div className="text-center">
                    <div className="text-2xl mb-4 font-bold">{MESSAGES.BLUE_SCREEN.TITLE}</div>
                    <div className="text-sm mb-8">{MESSAGES.BLUE_SCREEN.SUBTITLE}</div>
                    <div className="text-xs mb-4">{MESSAGES.BLUE_SCREEN.TECHNICAL}</div>
                    <div className="text-xs">{MESSAGES.BLUE_SCREEN.FOOTER}</div>
                </div>
            </div>
        );
    }

    // Main Desktop
    return (
        <div
            className="w-full h-screen relative overflow-hidden select-none"
            style={{backgroundColor: COLORS.DESKTOP_BG}}
            onClick={() => {
                setShowStartMenu(false);
                setContextMenu({...contextMenu, visible: false});
            }}
            onContextMenu={handleRightClick}
        >
            {/* Desktop Background Pattern (corruption effect) */}
            {systemCorruption > 3 && (
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.1'%3E%3Crect width='60' height='60'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
            )}

            {/* Desktop Icons */}
            {showDesktopIcons && (
                <div className="absolute top-4 left-4 space-y-6">
                    {DESKTOP_ICONS.map((icon, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-2 hover:bg-blue-100 hover:bg-opacity-50 cursor-pointer w-20 rounded"
                            onDoubleClick={() => handleDesktopIconClick(icon.action)}
                            style={{fontFamily: FONTS.SYSTEM}}
                        >
                            <div className="w-8 h-8 mb-1">
                                {getIcon(icon.icon)}
                            </div>
                            <span className="text-xs text-center text-white drop-shadow-lg">
                {icon.name}
              </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Windows */}
            {windows.map(window => (
                <WindowComponent key={window.id} window={window}/>
            ))}

            {/* Error Popups */}
            {errorPopups.map((error, index) => (
                <div
                    key={index}
                    className="absolute border-2 shadow-lg p-4 text-center bg-white"
                    style={{
                        left: 100 + index * 50,
                        top: 100 + index * 50,
                        zIndex: 1000 + index,
                        transform: `rotate(${Math.random() * 10 - 5}deg)`,
                        borderColor: COLORS.WINDOW_BORDER,
                        fontFamily: FONTS.SYSTEM
                    }}
                >
                    <div className="w-8 h-8 mx-auto mb-2">
                        {getIcon('warning')}
                    </div>
                    <div className="text-xs mb-4">{error}</div>
                    <button
                        className="px-4 py-1 border bg-gray-100 text-xs hover:bg-gray-200"
                        onClick={() => setErrorPopups(prev => prev.filter((_, i) => i !== index))}
                    >
                        OK
                    </button>
                </div>
            ))}

            {/* Context Menu */}
            {contextMenu.visible && <ContextMenuComponent/>}

            {/* Start Menu */}
            {showStartMenu && <StartMenu/>}

            {/* Taskbar */}
            <div
                className="absolute bottom-0 left-0 right-0 border-t-2 flex items-center px-2"
                style={{
                    height: SYSTEM_CONFIG.TASKBAR_HEIGHT,
                    backgroundColor: COLORS.TASKBAR_BG,
                    borderColor: COLORS.WINDOW_BORDER,
                    fontFamily: FONTS.SYSTEM
                }}
            >
                <button
                    className="px-4 py-1 border border-gray-400 text-xs font-bold mr-2 hover:bg-gray-300"
                    style={{backgroundColor: COLORS.BUTTON_BG}}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowStartMenu(!showStartMenu);
                    }}
                >
                    Start
                </button>

                <div className="flex-1"/>

                <div className="text-xs px-2 border-l border-gray-400">
                    {currentTime.toLocaleTimeString()}
                </div>
            </div>

            {/* System Corruption Effects */}
            {systemCorruption > 5 && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse"/>
                    <div
                        className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-transparent animate-pulse"/>
                </div>
            )}

            {/* System Crash Overlay */}
            {isSystemCrashing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center" style={{fontFamily: FONTS.SYSTEM}}>
                        <div className="text-2xl animate-pulse">SYSTEM FAILURE</div>
                        <div className="text-sm mt-4">Please wait...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tree98Sim;
