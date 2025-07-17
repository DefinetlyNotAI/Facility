import React from 'react';
import {FONTS} from '@/lib/tree98data';
import {LoadingScreenProps} from "@/lib/tree98types";


export const LoadingScreen: React.FC<LoadingScreenProps> = ({loadingProgress}) => (
    <div
        className="w-full h-screen bg-black text-white flex flex-col items-center justify-center"
        style={{fontFamily: FONTS.BOOT}}
    >
        <div className="text-lg mb-8">Starting tree98...</div>
        <div className="w-64 h-4 border border-white bg-black">
            <div
                className="h-full bg-blue-600 transition-all duration-100"
                style={{width: `${loadingProgress}%`}}
            />
        </div>
        <div className="text-sm mt-4">{loadingProgress}%</div>
    </div>
);