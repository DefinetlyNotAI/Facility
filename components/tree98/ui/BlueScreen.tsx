import React from 'react';
import {COLORS, FONTS, MESSAGES} from '@/lib/tree98data';

export const BlueScreen: React.FC = () => (
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