import React from 'react';
import {FONTS} from '@/lib/data/tree98';
import {VesselBootDialogProps} from "@/lib/types/tree98";


export const VesselBootDialog: React.FC<VesselBootDialogProps> = ({item}) => (
    <div className="p-4 h-full overflow-auto bg-black text-green-400"
         style={{fontFamily: FONTS.MONO, fontSize: '11px'}}>
        <div className="animate-pulse">
            <pre className="whitespace-pre-wrap">{item.content}</pre>
        </div>
        <div className="mt-4 text-red-400 animate-pulse">
            [SYSTEM CORRUPTION INITIATED]
        </div>
    </div>
);