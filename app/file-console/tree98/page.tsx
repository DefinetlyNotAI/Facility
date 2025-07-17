"use client";

import {useEffect} from 'react';
import Cookie from 'js-cookie';
import {useRouter} from 'next/navigation';
import {SYSTEM_CONFIG} from "@/lib/tree98data";
import Tree98Sim from "./Tree98Sim";

function TREE() {
    const router = useRouter();

    useEffect(() => {
        if (Cookie.get(SYSTEM_CONFIG.CUTSCENE_COOKIE)) {
            router.replace('/file-console');
        }
    }, [router]);

    return <Tree98Sim/>;
}

export default TREE;
