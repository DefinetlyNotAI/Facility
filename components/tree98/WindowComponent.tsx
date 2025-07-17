import React from 'react';
import {Window} from '@/lib/tree98types';
import {COLORS, FONTS, SYSTEM_CONFIG} from '@/lib/tree98data';
import {getIcon} from '@/components/icons';

interface WindowComponentProps {
    window: Window;
    systemCorruption: number;
    onBringToFront: (id: string) => void;
    onStartDrag: (e: React.MouseEvent, windowId: string) => void;
    onClose: (id: string) => void;
}

export const WindowComponent: React.FC<WindowComponentProps> = ({
                                                                    window,
                                                                    systemCorruption,
                                                                    onBringToFront,
                                                                    onStartDrag,
                                                                    onClose
                                                                }) => {
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
        </div>
    );
};