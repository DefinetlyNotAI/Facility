import React from 'react';
import {FONTS} from '@/lib/tree98data';
import {FileViewerProps} from "@/lib/tree98types";


export const FileViewer: React.FC<FileViewerProps> = ({item}) => (
    <div className="p-4 h-full overflow-auto" style={{fontFamily: FONTS.MONO, fontSize: '12px'}}>
        <pre className="whitespace-pre-wrap text-black">{item.content}</pre>
    </div>
);