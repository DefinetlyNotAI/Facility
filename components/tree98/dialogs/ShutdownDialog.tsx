import React from 'react';
import {FONTS} from '@/lib/data/tree98';
import {getIcon} from '@/components/tree98/icons';

export const ShutdownDialog: React.FC = () => (
    <div className="p-4 bg-white text-center">
        <div className="w-12 h-12 mx-auto mb-4">
            {getIcon('shutdown')}
        </div>
        <div className="text-sm mb-4" style={{fontFamily: FONTS.SYSTEM}}>
            What do you want the computer to do?
        </div>
        <div className="space-y-2 mb-4">
            <label className="flex items-center">
                <input type="radio" name="shutdown" className="mr-2" defaultChecked/>
                <span className="text-sm">Shut down the computer</span>
            </label>
            <label className="flex items-center">
                <input type="radio" name="shutdown" className="mr-2"/>
                <span className="text-sm">Restart the computer</span>
            </label>
        </div>
        <div className="flex justify-center gap-2">
            <button
                className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300"
                style={{fontFamily: FONTS.SYSTEM, borderStyle: 'outset'}}
            >
                OK
            </button>
            <button
                className="px-6 py-2 border-2 border-gray-400 bg-gray-200 text-sm hover:bg-gray-300"
                style={{fontFamily: FONTS.SYSTEM, borderStyle: 'outset'}}
            >
                Cancel
            </button>
        </div>
    </div>
);