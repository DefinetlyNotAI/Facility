import React from 'react';
import {FONTS} from '@/lib/data/tree98';
import {getIcon} from '@/components/tree98/icons';
import {ErrorDialogProps} from "@/lib/types/tree98";

export const ErrorDialog: React.FC<ErrorDialogProps> = ({message, style, onClose}) => (
    <div
        className="p-4 text-center h-full flex flex-col justify-center bg-white border border-red-400 rounded shadow-lg"
        style={style}
    >
        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            {getIcon('error') || <span className="text-red-500 text-3xl">!</span>}
        </div>
        <div className="text-sm mb-4" style={{fontFamily: FONTS.SYSTEM, color: '#d32f2f'}}>
            {message || 'An unexpected error occurred.'}
        </div>
        <button
            className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300 rounded"
            style={{fontFamily: FONTS.SYSTEM}}
            onClick={onClose}
        >
            OK
        </button>
    </div>
);