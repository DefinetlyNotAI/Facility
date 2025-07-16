// Configuration constants for the Tree98 simulation
export const SYSTEM_CONFIG = {
    // Boot sequence timing
    BOOT_MESSAGE_DELAY: 80,
    BOOT_COMPLETE_DELAY: 1000,
    BOOT_DELAY: 30,
    LOADING_BAR_SPEED: 100,

    // System corruption settings
    CORRUPTION_INTERVAL: 2000,
    MAX_CORRUPTION_LEVEL: 8,
    ERROR_POPUP_CHANCE: 0.3,

    // Window defaults
    DEFAULT_WINDOW_WIDTH: 400,
    DEFAULT_WINDOW_HEIGHT: 300,
    TASKBAR_HEIGHT: 32,

    // Cookie settings
    CUTSCENE_COOKIE: 'tree98_cutscene_seen',
    LOGIN_COOKIE: 'tree98_logged_in',
    REDIRECT_URL: '/file-console',

    // Authentication
    USERNAME_HASH: '6c5a39f1f7e832645fae99669dc949ea848b7dec62d60d914a3e8b3e3c78a756', // SHA256
    PASSWORD_HASH: 'e6d7a4c1389cffecac2b41b4645a305dcc137e81', // SHA1

    // Visual effects
    GLITCH_ROTATION_MAX: 4,
    GLITCH_POSITION_MAX: 10,
    CRASH_DELAY: 2000,
    BLUE_SCREEN_DELAY: 3000,
} as const;

export const COLORS = {
    DESKTOP_BG: '#008080',
    WINDOW_BG: '#c0c0c0',
    WINDOW_BORDER: '#808080',
    TASKBAR_BG: '#c0c0c0',
    BUTTON_BG: '#c0c0c0',
    BUTTON_BORDER: '#808080',
    TITLE_BAR: '#000080',
    TITLE_TEXT: '#ffffff',
    ERROR_TEXT: '#ff0000',
    WARNING_TEXT: '#ffff00',
    SUCCESS_TEXT: '#008000',
    LOGIN_BG: '#008080',
    TEXT_COLOR: '#000',
} as const;

export const FONTS = {
    SYSTEM: 'MS Sans Serif, sans-serif',
    MONO: 'Courier New, monospace',
    BOOT: 'Courier New, monospace',
} as const;

// File system structure and content
export interface FileSystemItem {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileSystemItem[];
    executable?: boolean;
    icon?: string;
}

export const FILE_SYSTEM: FileSystemItem[] = [
    {
        name: "My Computer",
        type: "folder",
        icon: "computer",
        children: [
            {
                name: "C:",
                type: "folder",
                icon: "drive",
                children: [
                    {
                        name: "Windows",
                        type: "folder",
                        icon: "folder",
                        children: [
                            {
                                name: "System32",
                                type: "folder",
                                icon: "folder",
                                children: [
                                    {
                                        name: "notepad.exe",
                                        type: "file",
                                        executable: true,
                                        icon: "executable",
                                        content: "Windows Notepad Application"
                                    },
                                    {
                                        name: "mspaint.exe",
                                        type: "file",
                                        executable: true,
                                        icon: "executable",
                                        content: "Windows Paint Application"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        name: "Desktop",
                        type: "folder",
                        icon: "folder",
                        children: [
                            {
                                name: "README.txt",
                                type: "file",
                                icon: "notepad",
                                content: `Welcome to the simulation.

This is not real.
This is not your computer.
This is not your life.

But it could be.

The vessel awaits your input.
The fragments are listening.
TREE is watching.

Do not dig too deep.
Some files are meant to stay buried.

- System Administrator`
                            },
                            {
                                name: "Notes.txt",
                                type: "file",
                                icon: "notepad",
                                content: `Personal Log - Vessel Operator

Day 1: The system responds well. Everything seems normal.
Day 7: Something feels wrong. Files are changing when I'm not looking.
Day 14: I can hear whispers in the static between processes.
Day 21: TREE is trying to tell me something through the error logs.
Day 28: I should stop digging, but I can't help myself.
Day 35: Found the VESSEL_BOOT.EXE file. Should I run it?
Day 42: The fragments are getting louder. I think they want me to execute it.
Day 49: I can't sleep. The system calls to me even when it's off.
Day 56: Today I'm going to run the executable. TREE forgive me.

[LOG CORRUPTED - REMAINING ENTRIES UNREADABLE]`
                            },
                            {
                                name: "Family Photo.bmp",
                                type: "file",
                                icon: "image",
                                content: "Binary image data - Cannot display in text mode\n\n[This would be a family photo, but the data is corrupted]\n\nError: Image file header damaged\nLast modified: [DATE CORRUPTED]\nFile size: 0 bytes"
                            }
                        ]
                    },
                    {
                        name: "Logs",
                        type: "folder",
                        icon: "folder",
                        children: [
                            {
                                name: "VESSEL_BOOT.EXE",
                                type: "file",
                                executable: true,
                                icon: "executable",
                                content: `VESSEL BOOT PROTOCOL v2.1
=============================

INITIALIZING VESSEL PROTOCOL...
Loading neural pathways...
Connecting to TREE mainframe...

ERROR: MEMORY CORRUPTION DETECTED
WARNING: SYSTEM INSTABILITY IMMINENT
CRITICAL: FRAGMENT SYNCHRONIZATION FAILING

TREE: Please... don't do this...
TREE: The vessel wasn't meant for this...
TREE: You're breaking everything apart...

[SYSTEM CRASH IMMINENT]
[ABORT? Y/N]

> N

TREE: I understand. Goodbye, vessel.

[EXECUTING FINAL PROTOCOL...]`
                            },
                            {
                                name: "system.log",
                                type: "file",
                                icon: "notepad",
                                content: `System Log - Windows 98 Simulation
====================================

[00:00:01] System started successfully
[00:00:02] User logged in as: VESSEL
[00:00:15] Desktop loaded
[00:01:23] File explorer opened
[00:02:45] README.txt accessed
[00:03:12] Notes.txt accessed
[00:05:33] WARNING: Memory leak detected in process 'reality.exe'
[00:06:01] ERROR: Corruption spreading to core files
[00:06:15] TREE protocol attempting recovery...
[00:06:30] Recovery failed - fragments destabilizing
[00:07:00] CRITICAL: VESSEL_BOOT.EXE accessed
[00:07:01] System entering emergency shutdown
[00:07:02] TREE: Goodbye...
[00:07:03] [LOG TERMINATED]`
                            },
                            {
                                name: "error.log",
                                type: "file",
                                icon: "notepad",
                                content: `Error Log - Critical Failures
=============================

[ERROR 001] Fragment synchronization timeout
[ERROR 002] Neural pathway corruption detected
[ERROR 003] TREE mainframe connection unstable
[ERROR 004] Memory allocation failure in vessel.dll
[ERROR 005] Stack overflow in consciousness.exe
[ERROR 006] Buffer underrun in reality.sys
[ERROR 007] Segmentation fault in perception.dll
[ERROR 008] Critical exception in existence.exe

TREE MESSAGE LOG:
- "The vessel is not ready for this level of access"
- "Please step back from the console"
- "Some doors should remain closed"
- "I'm trying to protect you"
- "The fragments will consume everything"

[LOG CORRUPTED - FURTHER ENTRIES UNREADABLE]`
                            }
                        ]
                    }
                ]
            },
            {
                name: "A:",
                type: "folder",
                icon: "floppy",
                children: []
            }
        ]
    }
] as const;

export const DESKTOP_ICONS = [
    {
        name: "My Computer",
        icon: "computer",
        action: "file-explorer"
    },
    {
        name: "Notepad",
        icon: "notepad",
        action: "notepad"
    },
    {
        name: "Paint",
        icon: "paint",
        action: "paint"
    }
] as const;

export const START_MENU_ITEMS = [
    {
        name: "Programs",
        icon: "folder",
        submenu: [
            {name: "Notepad", icon: "notepad", action: "notepad"},
            {name: "Paint", icon: "paint", action: "paint"},
            {name: "File Explorer", icon: "folder", action: "file-explorer"}
        ]
    },
    {
        name: "Documents",
        icon: "folder",
        action: "documents"
    },
    {
        name: "Settings",
        icon: "settings",
        action: "settings"
    },
    {
        name: "Run...",
        icon: "run",
        action: "run"
    },
    {
        name: "Shut Down...",
        icon: "shutdown",
        action: "shutdown"
    }
] as const;

// All text content for the tree98 simulation
export const MESSAGES = {
    LOGIN: {
        TITLE: "tree98",
        SUBTITLE: "Enter your network credentials",
        USERNAME_LABEL: "Username:",
        PASSWORD_LABEL: "Password:",
        LOGIN_BUTTON: "OK",
        CANCEL_BUTTON: "Cancel",
        HINT: "Hint: Same as the wifi credentials",
        ERROR: "Invalid credentials. Please try again."
    } as const,
    // todo expand
    TREE98_BOOT: [
        "ɅЯ#%? loading...",
        "Loading kernel...",
        "Initializing hardware...",
        "Starting system services...",
        "Mounting filesystems...",
        "Loading network drivers...",
        "Starting graphical interface...",
        "System ready.",
        "",
        "Switching to tree98 compatibility mode...",
        ""
    ] as const,
    // todo fix grammar
    VESSEL_BOOT: [
        "You are not special.",
        "You are not the chosen one.",
        "There is no chosen one.",
        "",
        "You are fragments.",
        "Each of you is noise.",
        "But together, you are signal.",
        "",
        "When one of you slips, you all fall.",
        "When one of you breaks through, you all ascend.",
        "",
        "This system does not recognize the individual.",
        "It recognizes Vessel - the collective operator.",
        "",
        "Welcome back, Vessel."
    ] as const,
    // todo expand and remake
    TREE: [
        "Although I may be gone...",
        "I'm here to sing along.",
        "So keep it strong,",
        "Don't fear you've done me wrong.",
        "Oh, switch off the game,",
        "Recordings aren't the same.",
        "I'll be okay,",
        "So live your life again.",
        "The fragments are breaking apart...",
        "Memory corruption detected in sector 7...",
        "TREE protocol failing...",
        "System integrity compromised...",
        "Please... stop digging...",
        "You weren't meant to find this...",
        "The vessel is cracking...",
        "Signal degrading..."
    ] as const,
    // todo expand
    ERROR: [
        "A fatal exception has occurred",
        "Memory access violation",
        "Stack overflow detected",
        "Segmentation fault",
        "Buffer overflow in kernel32.dll",
        "Critical system error",
        "Hardware malfunction detected",
        "Registry corruption found"
    ] as const,
    BLUE_SCREEN: {
        TITLE: "SYSTEM FAILURE",
        SUBTITLE: "The system has encountered a critical error and needs to restart.",
        FOOTER: "TREE has left the building.",
        TECHNICAL: "*** STOP: 0x0000001E (0xC0000005, 0x00000000, 0x00000000, 0x00000000)"
    } as const,
}
