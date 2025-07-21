import React, {useRef} from 'react';
import {WindowComponentProps} from '@/lib/types/tree98';
import {COLORS, FONTS, SYSTEM_CONFIG} from '@/lib/data/tree98';
import {getIcon} from '@/components/tree98/icons';


// Minimum window size to prevent hiding elements
const MIN_WIDTH = 250;
const MIN_HEIGHT = 120;

export const WindowComponent: React.FC<WindowComponentProps> = ({
                                                                    window,
                                                                    systemCorruption,
                                                                    onBringToFront,
                                                                    onStartDrag,
                                                                    onClose,
                                                                    onMinimize,
                                                                    onMaximize,
                                                                    onResize
                                                                }) => {
    const Component = window.component;
    const glitchX = systemCorruption > 2 ? Math.random() * SYSTEM_CONFIG.GLITCH_POSITION_MAX - 5 : 0;
    const glitchY = systemCorruption > 2 ? Math.random() * SYSTEM_CONFIG.GLITCH_POSITION_MAX - 5 : 0;
    const rotation = systemCorruption > 4 ? Math.random() * SYSTEM_CONFIG.GLITCH_ROTATION_MAX - 2 : 0;

    // Resize logic
    const resizing = useRef(false);
    const startResize = (e: React.MouseEvent) => {
        e.stopPropagation();
        resizing.current = true;
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = window.width;
        const startHeight = window.height;

        const onMouseMove = (moveEvent: MouseEvent) => {
            if (!resizing.current) return;
            const newWidth = Math.max(MIN_WIDTH, startWidth + (moveEvent.clientX - startX));
            const newHeight = Math.max(MIN_HEIGHT, startHeight + (moveEvent.clientY - startY));
            if (onResize) {
                onResize(window.id, newWidth, newHeight);
            }
        };

        const onMouseUp = () => {
            resizing.current = false;
            globalThis.window.removeEventListener('mousemove', onMouseMove);
            globalThis.window.removeEventListener('mouseup', onMouseUp);
        };

        globalThis.window.addEventListener('mousemove', onMouseMove);
        globalThis.window.addEventListener('mouseup', onMouseUp);
    };

    // If minimized, render only the title bar
    if (window.isMinimized) {
        return (
            <div
                className="absolute border-2 shadow-lg"
                style={{
                    left: window.x + glitchX,
                    top: window.y + glitchY,
                    width: MIN_WIDTH,
                    height: 24,
                    zIndex: window.zIndex,
                    backgroundColor: COLORS.WINDOW_BG,
                    borderColor: COLORS.WINDOW_BORDER,
                    fontFamily: FONTS.SYSTEM
                }}
                onClick={() => onBringToFront(window.id)}
            >
                <div
                    className="text-white px-2 py-1 flex items-center justify-between text-xs cursor-move select-none"
                    style={{backgroundColor: COLORS.TITLE_BAR}}
                    onMouseDown={(e) => onStartDrag(e, window.id)}
                >
                    <span>{window.title}</span>
                    <div className="flex gap-1">
                        <button
                            className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onMinimize) onMinimize(window.id, false);
                            }}
                        >
                            {getIcon('restore')}
                        </button>
                        <button
                            className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(window.id);
                            }}
                        >
                            {getIcon('close')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
            onClick={() => onBringToFront(window.id)}
        >
            <div
                className="text-white px-2 py-1 flex items-center justify-between text-xs cursor-move select-none"
                style={{backgroundColor: COLORS.TITLE_BAR}}
                onMouseDown={(e) => onStartDrag(e, window.id)}
            >
                <span>{window.title}</span>
                <div className="flex gap-1">
                    <button
                        className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onMinimize) onMinimize(window.id, true);
                        }}
                    >
                        {getIcon('minimize')}
                    </button>
                    <button
                        className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onMaximize) onMaximize(window.id);
                        }}
                    >
                        {getIcon(window.isMaximized ? 'restore' : 'maximize')}
                    </button>
                    <button
                        className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose(window.id);
                        }}
                    >
                        {getIcon('close')}
                    </button>
                </div>
            </div>

            <div className="h-full overflow-hidden" style={{height: 'calc(100% - 24px)'}}>
                {Component && <Component {...window.props} />}
            </div>
            {/* Resize handle */}
            {!window.isMaximized && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: 16,
                        height: 16,
                        cursor: 'nwse-resize',
                        zIndex: 10
                    }}
                    onMouseDown={startResize}
                >
                    {/* ...resize icon or corner... */}
                </div>
            )}
        </div>
    );
};