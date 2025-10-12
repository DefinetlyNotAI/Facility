// Type for all Acts
export type BonusAct =
    | "Act_I"
    | "Act_II"
    | "Act_III"
    | "Act_IV"
    | "Act_V"
    | "Act_VI"
    | "Act_VII"
    | "Act_VIII"
    | "Act_IX"
    | "Act_X";

// Type for responses
export type BonusResponse = Record<BonusAct, boolean> & { success?: boolean };

// Define 4 states as a TypeScript enum
export enum ActionState {
    NotReleased = 'not_released',
    Released = 'released',
    Failed = 'failed',
    Succeeded = 'succeeded',
}
