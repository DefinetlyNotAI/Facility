export type BootMessage = {
    text: string;
    delay?: number; // in ms
    typeSpeed?: number; // characters per second
    mode?: 'instant' | 'type' | 'fade';
};
export type Dirent = { name: string; type: 'file' | 'dir'; };
