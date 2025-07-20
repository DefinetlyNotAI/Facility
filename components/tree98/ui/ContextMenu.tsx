import React from 'react';
import {FONTS} from '@/lib/data/tree98';
import {ContextMenuProps} from "@/lib/types/tree98";


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