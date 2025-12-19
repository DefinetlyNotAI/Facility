// Server-only chapter IV secrets and validation helpers
import {PlaqueId} from "@/types";

export const PUZZLES: Record<PlaqueId, string> = {
    TAS: "your own reflection in the clock's glass",
    Entity: "the void where names dissolve",
    TREE: "looped time bearing false tree fruit",
};

export const TASAnswers = [
    'entropy',
    '00111',
    'consensus',
    '53633',
    'consensus',
]