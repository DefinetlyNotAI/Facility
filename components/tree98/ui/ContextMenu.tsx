import React from 'react';
import {FONTS} from '@/lib/tree98data';
import {ContextMenuProps} from "@/lib/tree98types";


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