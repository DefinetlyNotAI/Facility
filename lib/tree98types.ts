import React from "react";
import {Icons} from "@/components/tree98/icons";


// Define the types for the tree98 application window management.
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

// Desktop icon type
export interface DesktopIcon {
    name: string;
    icon: keyof typeof Icons;
    action: string;
}

// File system item type
export interface FileSystemItem {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileSystemItem[];
    executable?: boolean;
    icon?: keyof typeof Icons;
    action?: 'paint' | 'notepad';
}

// Start menu item type
export interface StartMenuProps {
    onAction: (action: string) => void;
}

// Loading screen properties
export interface LoadingScreenProps {
    loadingProgress: number;
}

// Context menu properties
export interface ContextMenuProps {
    contextMenu: ContextMenu;
    showDesktopIcons: boolean;
    onAction: (action: string) => void;
}

// Vessel Boot Dialog properties
export interface VesselBootDialogProps {
    item: FileSystemItem;
}

// Run dialog properties
export interface RunDialogProps {
    onCreateWindow?: (title: string, component: any, x: number, y: number, width: number, height: number) => void;
}

// File viewer properties
export interface FileViewerProps {
    item: FileSystemItem;
}

// Error dialog properties
export interface ErrorDialogProps {
    message: string;
}

// Window component properties
export interface WindowComponentProps {
    window: Window;
    systemCorruption: number;
    onBringToFront: (id: string) => void;
    onStartDrag: (e: React.MouseEvent, windowId: string) => void;
    onClose: (id: string) => void;
}
