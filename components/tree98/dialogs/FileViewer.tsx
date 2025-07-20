import React from 'react';
import {FONTS} from '@/lib/data/tree98';
import {FileViewerProps} from "@/lib/types/tree98";


export const FileViewer: React.FC<FileViewerProps> = ({item}) => (
    <div className="p-4 h-full overflow-auto" style={{fontFamily: FONTS.MONO, fontSize: '12px'}}>
        <pre className="whitespace-pre-wrap text-black">{item.content}</pre>
    </div>
);