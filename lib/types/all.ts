import {BROWSERS} from "@/lib/data/buttons";
import React from "react";

// terminal
export type KeywordKey = 1 | 2 | 3 | 4 | 5;
export type TerminalStep = 'locked' | 'fill' | 'solving' | 'question' | 'email' | 'countdown';
export type FullScreenOverlay = {
    text: string;
    size?: 'huge' | 'massive';
    glitch?: boolean;
};

// file console
export type BootMessage = {
    text: string;
    delay?: number; // in ms
    typeSpeed?: number; // characters per second
    mode?: 'instant' | 'type' | 'fade';
};
export type Dirent = { name: string; type: 'file' | 'dir'; };
export type PlaceholderKeys = 'fill' | 'email';

// home
export interface ResearchLog {
    id: string;
    title: string;
    researcher: string;
    date: string;
    classification: string;
    corrupted: boolean;
    content: string;
}

export interface InitialCookies {
    corrupt: boolean;
    end: boolean;
    endQuestion: boolean;
    noCorruption: boolean;
    fileUnlocked: boolean;
    bnwUnlocked: boolean;
}

// buttons
export type BrowserName = typeof BROWSERS[number];

// choices
export interface TASGoodByeProps {
    onDone: () => void;
}

// O ARVORE DA CARNE
export interface ScriptItem {
    content: React.ReactNode;
    type: "title" | "fade" | "chant" | "quote" | "final";
}

// the end
export type MemoryFragment = {
    text: string;
    style: React.CSSProperties;
};

// wifi panel/wifi login
export type FinaleMessage = {
    text: string;
    style?: React.CSSProperties;
    type?: 'title' | 'body' | 'loading'; // optional, for styling or logic
};
type FormField = {
    title: string;
    placeholder: string;
    min?: number;
    max?: number;
};
export type FormFields = {
    username: FormField;
    password: FormField;
};
