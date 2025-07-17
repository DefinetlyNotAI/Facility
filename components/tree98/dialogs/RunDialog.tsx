import React, {useState} from 'react';
import {FONTS} from '@/lib/tree98data';

interface RunDialogProps {
    onCreateWindow?: (title: string, component: any, x: number, y: number, width: number, height: number) => void;
}

export const RunDialog: React.FC<RunDialogProps> = ({onCreateWindow}) => {
    const [command, setCommand] = useState('');

    const handleRun = () => {
        if (onCreateWindow) {
            if (command.toLowerCase().includes('notepad')) {
                // This would need to be handled by the parent component
            } else if (command.toLowerCase().includes('mspaint')) {
                // This would need to be handled by the parent component
            }
        }
    };

    return (
        <div className="p-4 bg-white">
            <div className="text-sm mb-4" style={{fontFamily: FONTS.SYSTEM}}>
                Type the name of a program, folder, document, or Internet resource, and TREE will open it for you.
            </div>
            <div className="mb-4">
                <label className="block text-sm mb-2">Open:</label>
                <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    className="w-full p-2 border border-gray-400 bg-white text-sm"
                    style={{fontFamily: FONTS.SYSTEM}}
                />
            </div>
            <div className="flex justify-end gap-2">
                <button
                    onClick={handleRun}
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
};