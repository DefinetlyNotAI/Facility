import React from 'react';
import {FONTS} from '@/lib/tree98data';
import {getIcon} from '@/components/tree98/icons';

export const ControlPanel: React.FC = () => (
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