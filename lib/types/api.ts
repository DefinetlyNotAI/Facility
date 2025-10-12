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

export enum ActionState {
    NotReleased = "not_released",
    Released = "released",
    Failed = "failed",
    Succeeded = "succeeded",
}

// Each act maps to its current state
export type BonusResponse = Record<BonusAct, ActionState>;
