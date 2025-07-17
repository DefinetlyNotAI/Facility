import React from "react";

export interface Window {
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

export interface ContextMenu {
    x: number;
    y: number;
    visible: boolean;
}

export interface DragState {
    isDragging: boolean;
    windowId: string | null;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
}