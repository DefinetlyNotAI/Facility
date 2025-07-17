import React from 'react';
import {FONTS} from '@/lib/tree98data';
import {getIcon} from '@/components/icons';

interface ErrorDialogProps {
    message: string;
}

export const ErrorDialog: React.FC<ErrorDialogProps> = ({message}) => (
    <div className="p-4 text-center h-full flex flex-col justify-center bg-white">
        <div className="w-12 h-12 mx-auto mb-4">
            {getIcon('error')}
        </div>
        <div className="text-sm mb-4" style={{fontFamily: FONTS.SYSTEM}}>
            {message}
        </div>
        <button
            className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300"
            style={{fontFamily: FONTS.SYSTEM}}
            onClick={() => {
            }}
        >
            OK
        </button>
    </div>
);