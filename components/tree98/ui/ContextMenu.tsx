import React from 'react';
import {FONTS} from '@/lib/tree98data';
import {ContextMenu} from "@/lib/tree98types";

interface ContextMenuProps {
    contextMenu: ContextMenu;
    showDesktopIcons: boolean;
    onAction: (action: string) => void;
}

export const ContextMenuComponent: React.FC<ContextMenuProps> = ({
                                                                     contextMenu,
                                                                     showDesktopIcons,
                                                                     onAction
                                                                 }) => (
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
            onClick={() => onAction('toggle-icons')}
        >
            {showDesktopIcons ? 'Hide Icons' : 'Show Icons'}
        </div>
    </div>
);