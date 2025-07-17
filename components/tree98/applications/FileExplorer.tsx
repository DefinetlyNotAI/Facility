import React, {useState} from 'react';
import {FILE_SYSTEM, FileSystemItem, FONTS} from '@/lib/tree98data';
import {getIcon} from '@/components/icons';

interface FileExplorerProps {
    startPath?: string[];
    onFileOpen?: (item: FileSystemItem) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({startPath, onFileOpen}) => {
    const [currentPath, setCurrentPath] = useState(startPath || ['My Computer']);
    const [currentItems, setCurrentItems] = useState(() => {
        if (startPath) {
            let items = FILE_SYSTEM;
            for (let i = 1; i < startPath.length; i++) {
                const folder = items.find(item => item.name === startPath[i] && item.type === 'folder');
                if (folder && folder.children) {
                    items = folder.children;
                }
            }
            return items;
        }
        return FILE_SYSTEM;
    });

    const navigate = (path: string[]) => {
        let items = FILE_SYSTEM;
        for (let i = 1; i < path.length; i++) {
            const folder = items.find(item => item.name === path[i] && item.type === 'folder');
            if (folder && folder.children) {
                items = folder.children;
            }
        }
        setCurrentPath(path);
        setCurrentItems(items);
    };

    const openItem = (item: FileSystemItem) => {
        if (item.type === 'folder') {
            navigate([...currentPath, item.name]);
        } else if (onFileOpen) {
            onFileOpen(item);
        }
    };

    const goBack = () => {
        if (currentPath.length > 1) {
            navigate(currentPath.slice(0, -1));
        }
    };

    const goUp = () => {
        if (currentPath.length > 1) {
            navigate(['My Computer']);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="border-b p-1 text-xs bg-gray-100 flex gap-4">
                <button onClick={goBack} className="hover:bg-gray-200 px-2 py-1">File</button>
                <button onClick={goUp} className="hover:bg-gray-200 px-2 py-1">Edit</button>
                <span>View Go Favorites Tools Help</span>
            </div>
            <div className="flex items-center p-2 border-b bg-gray-50 gap-2">
                <button
                    onClick={goBack}
                    disabled={currentPath.length <= 1}
                    className="px-3 py-1 border bg-gray-200 text-xs disabled:opacity-50 hover:bg-gray-300"
                    style={{fontFamily: FONTS.SYSTEM}}
                >
                    Back
                </button>
                <button
                    onClick={goUp}
                    disabled={currentPath.length <= 1}
                    className="px-3 py-1 border bg-gray-200 text-xs disabled:opacity-50 hover:bg-gray-300"
                    style={{fontFamily: FONTS.SYSTEM}}
                >
                    Up
                </button>
                <span className="text-xs flex-1" style={{fontFamily: FONTS.SYSTEM}}>
                    {currentPath.join(' \\ ')}
                </span>
            </div>
            <div className="flex-1 p-2 overflow-auto bg-white">
                <div className="grid grid-cols-4 gap-4">
                    {currentItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-2 hover:bg-blue-100 cursor-pointer rounded"
                            onDoubleClick={() => openItem(item)}
                            style={{fontFamily: FONTS.SYSTEM}}
                        >
                            <div className="w-8 h-8 mb-1">
                                {getIcon(item.icon || (item.type === 'folder' ? 'folder' : 'notepad'))}
                            </div>
                            <span className="text-xs text-center break-words max-w-full text-black">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};