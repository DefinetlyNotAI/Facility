"use client";

import {useEffect} from 'react';
import Cookie from 'js-cookie';
import {useRouter} from 'next/navigation';
import Tree98Sim from "./Tree98Sim";
import {cookies, routes} from "@/lib/saveData";


function TREE() {
    const router = useRouter();

    useEffect(() => {
        if (Cookie.get(cookies.tree98)) {
            router.replace(routes.notFound);
        }
    }, [router]);

    return <Tree98Sim/>;
}

export default TREE;
