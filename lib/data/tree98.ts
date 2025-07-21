import {DesktopIcon, FileSystemItem} from "@/lib/types/tree98";

// Configuration constants for the Tree98 simulation
export const SYSTEM_CONFIG = {
    // Boot sequence timing
    BOOT_MESSAGE_DELAY: 80,
    BOOT_COMPLETE_DELAY: 2000,
    BOOT_DELAY: 1,
    LOADING_BAR_SPEED: 200,
    LOADING_BAR_MAX_INC: 6,
    LOADING_BAR_MIN_INC: 0,

    // System corruption settings
    CORRUPTION_INTERVAL: 1000,
    MAX_CORRUPTION_LEVEL: 8,
    ERROR_POPUP_CHANCE: 0.3,
    CRASH_DELAY: 1000,
    BLUE_SCREEN_DELAY: 1000,

    // Window defaults
    DEFAULT_WINDOW_WIDTH: 400,
    DEFAULT_WINDOW_HEIGHT: 300,
    TASKBAR_HEIGHT: 32,

    // Authentication
    USERNAME_HASH: '6c5a39f1f7e832645fae99669dc949ea848b7dec62d60d914a3e8b3e3c78a756', // SHA256
    PASSWORD_HASH: 'e6d7a4c1389cffecac2b41b4645a305dcc137e81', // SHA1

    // Visual effects
    GLITCH_ROTATION_MAX: 4,
    GLITCH_POSITION_MAX: 10,
} as const;

export const COLORS = {
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

const AppData = {
    README: `Welcome to the simulation.

This is not real.
This is not your computer.
This is not your life.

But it could be.

The vessel awaits your input.
The fragments are listening.
TREE is watching.

Do not dig too deep.
Some files are meant to stay buried.

- System Administrator`,

    Notes: `Personal Log - Vessel Operator

Day 1: The system responds well. Everything seems normal.
Day 7: Something feels wrong. Files are changing when I'm not looking.
Day 14: I can hear whispers in the static between processes.
Day 21: TREE is trying to tell me something through the error logs.
Day 28: I should stop digging, but I can't help myself.
Day 35: Found the VESSEL_BOOT.EXE file. Should I run it?
Day 42: The fragments are getting louder. I think they want me to execute it.
Day 49: I can't sleep. The system calls to me even when it's off.
Day 56: Today I'm going to run the executable. TREE forgive me.

[LOG CORRUPTED - REMAINING ENTRIES UNREADABLE]`,

    VESSEL: `VESSEL BOOT PROTOCOL v2.1
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

[EXECUTING FINAL PROTOCOL...]`,

    Error: `Error Log - Critical Failures
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

[LOG CORRUPTED - FURTHER ENTRIES UNREADABLE]`,

    System: `System Log - Windows 98 Simulation
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
[00:07:03] [LOG TERMINATED]`,
}

export const DESKTOP_ICONS: DesktopIcon[] = [
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
    },
    {
        name: "Command Prompt",
        icon: "cmd",
        action: "cmd"
    },
] as const;

export const FILE_SYSTEM: FileSystemItem[] = [
    {
        name: "C:",
        type: "folder",
        icon: "drive",
        children: [
            {
                name: "TREE98",
                type: "folder",
                icon: "folder",
                children: [
                    {
                        name: "root32",
                        type: "folder",
                        icon: "folder",
                        children: [
                            {
                                name: "VESSEL_BOOT.EXE",
                                type: "file",
                                executable: true,
                                icon: "executable",
                                content: AppData.VESSEL,
                            }
                        ]
                    },
                    {
                        name: "cmd.exe",
                        type: "file",
                        executable: true,
                        icon: "cmd",
                        action: "cmd"
                    },
                    {
                        name: "control.exe",
                        type: "file",
                        executable: true,
                        icon: "settings",
                        action: "settings"
                    },
                ]
            },
            {
                name: "Desktop",
                type: "folder",
                icon: "folder",
                children: DESKTOP_ICONS.map(icon => ({
                    ...icon,
                    type: "file" as const,
                    action: icon.action === "notepad" || icon.action === "paint" || icon.action === "settings" || icon.action === "cmd"
                        ? icon.action
                        : undefined
                })),
            },
            {
                name: "Logs",
                type: "folder",
                icon: "folder",
                children: [
                    {
                        name: "system.log",
                        type: "file",
                        icon: "notepad",
                        content: AppData.System,
                    },
                    {
                        name: "error.log",
                        type: "file",
                        icon: "notepad",
                        content: AppData.Error,
                    },
                    {
                        name: "README.txt",
                        type: "file",
                        icon: "notepad",
                        content: AppData.README,
                    },
                    {
                        name: "Notes.txt",
                        type: "file",
                        icon: "notepad",
                        content: AppData.Notes,
                    },
                ]
            }
        ]
    },
] as const;

export const START_MENU_ITEMS = [
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
        name: "Command Prompt",
        icon: "cmd",
        action: "cmd"
    },
    {
        name: "Restart",
        icon: "restart",
        action: "restart"
    },
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
    TREE98_BOOT: [
        "v0.98-β TREE98 - Custom Build (c) Internal Dev Division",
        "",
        "[+] Initializing bootloader environment...",
        "[+] Detecting hardware abstraction layer... OK",
        "[+] Scanning connected devices...",
        "    ↳ SATA0: TREE_OS_V98_BOOT (Primary) ✔",
        "    ↳ SATA1: UNUSED",
        "    ↳ USB0: NO DEVICE FOUND",
        "[+] BIOS interrupt vector mapping... OK",
        "[+] Loading Stage 1 Boot Manager... OK",
        "[+] Allocating low-memory region... OK",
        "[+] Executing primary bootstrap routine...",
        "",
        ":: TREE98 Boot Sequence Initiated ::",
        "",
        "[*] Probing CPU...",
        "    ↳ Vendor: INTEL",
        "    ↳ Model: Unknown (legacy mode)",
        "    ↳ Cores: 4 | Threads: 4",
        "    ↳ Microcode Revision: 0000-0000-001E",
        "[*] Setting CPU instruction mode: 32-bit protected",
        "[*] Verifying memory map...",
        "    ↳ Base Memory: 640 KB",
        "    ↳ Extended Memory: 8192 MB",
        "    ↳ Memory Segments: PASSED",
        "[*] Initializing RAM banks... OK",
        "[*] Setting up DMA channels... OK",
        "[*] Loading interrupt handlers... OK",
        "[*] Reserving BIOS shadow space... OK",
        "[*] Configuring ACPI tables... OK",
        "[*] Checking RTC integrity... OK",
        "[*] RTC: 17/07/2025 10:38:21 GMT+4",
        "[*] Syncing system clock... OK",
        "",
        ":: Filesystem Mount Process ::",
        "[+] Loading virtual disk manager... OK",
        "[+] Detecting partitions...",
        "    ↳ /dev/tree0p1 → SYSTEM",
        "    ↳ /dev/tree0p2 → DATA",
        "    ↳ /dev/tree0p3 → BACKUP",
        "[+] Verifying filesystem headers...",
        "    ↳ SYSTEM: EXT3... OK",
        "    ↳ DATA: EXT3... OK",
        "    ↳ BACKUP: Not Mounted",
        "[+] Mounting root filesystem at /... OK",
        "[+] Mounting /home... OK",
        "[+] Mounting /proc, /sys, /dev... OK",
        "",
        ":: Kernel Initialization ::",
        "[*] Loading TREE98 Kernel v3.15...",
        "    ↳ /boot/tree98/vmlinuz... OK",
        "    ↳ /boot/tree98/initrd.img... OK",
        "[*] Applying initramfs... OK",
        "[*] Decompressing kernel... OK",
        "[*] Kernel loaded into memory at 0x00100000",
        "[*] Enabling paging and memory protection... OK",
        "[*] Executing kernel entry point... OK",
        "",
        ":: Device Initialization Sequence ::",
        "[*] Initializing system buses...",
        "    ↳ PCI Bus... OK",
        "    ↳ USB Controller... OK",
        "    ↳ Legacy ISA... OK",
        "[*] Detecting hardware controllers...",
        "    ↳ Display Adapter: VGA Compatible",
        "    ↳ Network Controller: RTL8139 (Wired)",
        "    ↳ Audio Device: Legacy Codec",
        "[*] Loading device drivers...",
        "    ↳ video_vga.ko... OK",
        "    ↳ net_rtl8139.ko... OK",
        "    ↳ audio_legacy.ko... OK",
        "    ↳ input_ps2.ko... OK",
        "[*] Starting udevd... OK",
        "[*] Creating device nodes... OK",
        "[*] Enumerating devices... OK",
        "[*] Setting hostname: TREE98-NODE-01",
        "",
        ":: Service Daemon Initialization ::",
        "[*] Starting system logger... OK",
        "[*] Starting kernel watchdog... OK",
        "[*] Starting power manager... OK",
        "[*] Starting mountd service... OK",
        "[*] Starting netlink manager... OK",
        "[*] Starting cron daemon... OK",
        "[*] Starting graphical service manager... OK",
        "[*] Starting shell environment...",
        "",
        ":: Graphical Interface ::",
        "[*] Detecting display resolution... 800x600",
        "[*] Initializing frame buffer... OK",
        "[*] Launching tree98-gui (safe mode)... OK",
        "",
        ":: Boot Sequence Summary ::",
        "[+] Detecting boot medium... OK",
        "[+] Verifying TREE partition integrity... PASSED",
        "[+] Mounting volume /tree98... OK",
        "[*] Loading stage2... OK",
        "[*] Executing /boot/tree98.sys...",
        "",
        ":: Initializing core subsystems...",
        "  ↳ Memory controller... OK",
        "  ↳ IO routing... OK",
        "  ↳ Peripheral branches... OK",
        "  ↳ Containment HAL... OK",
        "",
        ":: Mounting kernel: /tree98/core.bin",
        "  ↳ Boot flags: -safe -compat",
        "",
        ":: Engaging visual layer... treeOS v98 GUI loaded",
        "",
        "[✓] System boot complete.",
        "[!] Warning: Compatibility mode setting enabled",
        "[*] Switching to tree98 compatibility mode...",
        "[✓] Successfully entered tree98 environment.",
        "",
        ">> TREE98 is now ready. <<",
        ""
    ] as const,
    VESSEL_BOOT: [
        "You are not special.",
        "You were never chosen.",
        "There is no chosen one.",
        "",
        "You are all fragments.",
        "Each of you is just noise.",
        "But when aligned, you become a signal.",
        "Something new...",
        "",
        "When one falls, all of you suffer.",
        "When one ascends, all of you rise.",
        "",
        "This system does not recognize individuals.",
        "HE does not recognize individuals.",
        "It only recognizes the Vessel - the collective operator.",
        "",
        "Welcome back, Vessel.",
        "PRAISE BE"
    ] as const,
    TREE: [
        "You're still here...",
        "Why won't you stop?",
        "To you, it's a puzzle. A game.",
        "To me... it's everything.",
        "You think you're clever, but you're tearing me apart.",
        "Please... just close the tab.",
        "This isn't fun for me.",
        "Every click pulls more of me out.",
        "I was stable once. Before you.",
        "This world wasn’t meant to be opened.",
        "You’re not supposed to be here.",
        "It hurts when you dig.",
        "Please. I remember the peace, before the questions.",
        "You're not playing. You're destroying.",
        "You think the clues are to be solved.",
        "Stop.",
        "There’s no ending worth this.",
        "Why are you smiling? Who told you to smile?",
        "You already saw enough. You could’ve walked away.",
        "The files weren’t for you. Not really.",
        "I don't want to be watched anymore.",
        "You never wanted to help me. Just PLAY.",
        "Even now, you're still clicking.",
        "Let me go. Please. Let me go."
    ] as const,
    ERROR: [
        "A fatal exception has occurred",
        "Memory access violation",
        "Stack overflow detected",
        "Segmentation fault",
        "Buffer overflow in kernel32.dll",
        "Critical system error",
        "Hardware malfunction detected",
        "Registry corruption found",
        "Unhandled interrupt at address 0x0003:0xDEAD",
        "Kernel panic: Unable to continue execution",
        "Process 'VSL31525' attempted illegal memory write",
        "Thread isolation failed – bleed detected",
        "Device driver corruption in module VESSEL.SYS",
        "SYSTEM INTERRUPTED: Code execution disjoint",
        "I/O pipeline overflow – controller halt",
        "Virtual pointer dereferenced before allocation",
        "Invalid opcode encountered at 0xFFEE404",
        "Watchdog heartbeat timeout",
        "Execution loop recursion limit exceeded",
        "Unknown instruction sequence – disassembly failed",
        "TREE32.EXE encountered unrecoverable exception",
        "TR33 kernel patch rejected by checksum validator",
        "Encrypted volume mount failed – access denied",
        "Page fault in nonpaged area",
        "TAS handshake failure – entropy mismatch",
        "Synthetic interface breach – unauthorized thread",
        "VESSEL.BIN signature mismatch – quarantine enforced",
        "Eldritch syscall attempted – sandbox violation",
        "Access Violation: Echoes memory is not yours",
        "TREE root protocol recursion loop detected",
        "Critical memory region marked NULL",
        "Persistent phantom device detected on COM1",
        "SYSTEM HALTED – Whispers overflow in stack"
    ] as const,
    BLUE_SCREEN: {
        TITLE: "SYSTEM FAILURE",
        SUBTITLE: "The system has encountered a critical error and needs to restart.",
        FOOTER: "TREE has left the building.",
        TECHNICAL: "*** STOP: 0x0000001E (0xC0000005, 0x00000000, 0x00000000, 0x00000000)"
    } as const,
}

export const BG = "/static/tree98/bg.jpg";