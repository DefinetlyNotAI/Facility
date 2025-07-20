import React, {useEffect, useState} from 'react';
import {DragState, Window} from '@/lib/types/tree98';
import {SYSTEM_CONFIG} from '@/lib/data/tree98';

export const useWindowManagement = () => {
    const [windows, setWindows] = useState<Window[]>([]);
    const [nextZIndex, setNextZIndex] = useState(1);
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        windowId: null,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0
    });

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

    return {
        windows,
        createWindow,
        closeWindow,
        bringToFront,
        startDrag
    };
};