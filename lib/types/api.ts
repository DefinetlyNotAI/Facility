// Description: TypeScript types for API responses related to bonus acts

// Allowed acts
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

// Possible states for each act
export enum ActionState {
    NotReleased = "not_released",
    Released = "released",
    Failed = "failed",
    Succeeded = "succeeded",
}

// Each act maps to its current state
export type BonusResponse = Record<BonusAct, ActionState>;

// Response from checking all acts in chapter IV
export interface ChapterIVCheckAllResponse {
    [act: string]: string; // e.g., { "Act_I": "succeeded", "Act_II": "not_released" }
}

// Response from changing an act to the next state in chapter IV
export interface ChangeNextStateResponse {
    data?: BonusResponse;
    error?: string;
}

// Mapping of current state to next state (for cycling states) in chapter IV
export type NextMap = Record<ActionState, ActionState>;
