// Centralized puzzle content: long riddle banks and narrative payloads for TAS and Entity
export const tasRiddleBank: Array<{ p: string, a: string }> = [
    {p: 'I am given to you before you leave, I am taken from you when you return; what am I?', a: 'ticket'},
    {p: 'I have cities but no houses, forests but no trees, and water but no fish.', a: 'map'},
    {p: 'Before Mount Doom fell, I whispered names into the gears. What am I?', a: 'entropy'},
    {p: 'Turn me on my side and I am everything. Cut me in half and I am nothing.', a: 'eight'},
    {p: 'A place where many hands sign and the same ink never dries; what is it?', a: 'ledger'},
    {p: 'I sleep inside machines and wake with light; I count but I do not care.', a: 'clock'},
    {p: 'I am made of numbers and broken by meaning; translate me to cross a door.', a: 'code'},
    {p: 'I am the thing you seek when you lose the path, small and round; what am I?', a: 'seed'},
    {p: 'I bind the pages but not the words; I can hold a map or keep a secret.', a: 'cover'},
    {p: 'The more you take away, the bigger I become.', a: 'hole'},
    {p: 'I am not alive but I can speak; I keep repeating until someone listens.', a: 'echo'},
    {p: 'I hold a hundred faces but wear none; align me and the message wakes.', a: 'dial'},
    {p: 'Born from sparks and metals, I carry meaning across the dark.', a: 'wire'},
    {p: 'I remember everything until someone winds me backwards.', a: 'tape'},
    {p: 'I have teeth but no mouth, I spread but do not grow.', a: 'comb'},
    {p: 'I show what was and what will be, but keep no memory of the one who looks.', a: 'mirror'},
    {p: 'I live between two halves and hold them close with a thin face.', a: 'hinge'},
    {p: 'Small as a mote, I change the whole pattern when I flip.', a: 'bit'},
    {p: 'I fly without wings, I cry without eyes. Wherever I go, darkness follows me.', a: 'cloud'},
    {p: 'I have no hands yet I strike; I sound with no mouth.', a: 'bell'},
    {p: 'I am used to open but also to hide; I am small and shaped for fit.', a: 'key'},
    {p: 'I am a path woven through metal; pulses move along my back.', a: 'trace'},
    {p: 'I sleep in the machine until a command wakes me; I am the last resort.', a: 'reset'},
    {p: 'I am the last mark on a broken ledger; I finish the story.', a: 'fullstop'}
];

export const entityRiddleBank: Array<{ p: string, a: string }> = [
    {p: 'I see without sight and listen without ear; I keep the memory of absence.', a: 'void'},
    {p: 'I am the small dark between pages where your breath hides.', a: 'margin'},
    {p: 'I swim in silence and leave ringing in the head.', a: 'tone'},
    {p: 'I follow the count but never sleep; remove me and the song stops.', a: 'beat'},
    {p: 'I am carved in places where names forget themselves.', a: 'sigil'},
    {p: 'I become heavier the less you hold; I am taken from you and given away.', a: 'guilt'},
    {p: 'I turn faces pale and make mirrors blink; I do not need a mouth to scream.', a: 'fear'},
    {p: 'I am the echo that knows your name before you speak.', a: 'whisper'},
    {p: 'I fold time into a crib of numbers and hide the keys inside.', a: 'index'},
    {p: 'I collect small stones and call them tokens; stitch them in the right order.', a: 'weave'},
    {p: 'I mark the point where two times cross and no clock ticks.', a: 'rift'},
    {p: 'I feed on memory and leave holes where names were kept.', a: 'anomaly'},
    {p: 'I am a book with no beginning, read me backwards to find the door.', a: 'chronicle'},
    {p: 'I am the small light in the corner of the eye that repeats.', a: 'spark'},
    {p: 'I am the sound that moves under the floorboards when night forgets.', a: 'creak'},
    {p: 'I am taken from the well to stitch lost letters together.', a: 'ink'},
    {p: 'I fold and fold until the story fits in a palm.', a: 'crease'},
    {p: 'I am a gate that only opens with the right story fragment.', a: 'oracle'},
    {p: 'I keep the fragments locked until someone sings the right tune.', a: 'vault'},
    {p: 'I am the thin space between echo and echo.', a: 'gap'},
    {p: 'I am a hollow that holds names until the light returns.', a: 'vaultlet'},
    {p: 'I am the last stitch that ties together lost things.', a: 'seal'},
    {p: 'I am the soft pressure at the base of the skull; I tell you to stop.', a: 'urge'},
    {p: 'I am the path you cannot take twice; I am the descent.', a: 'descent'}
];

// Narrative payloads for longer stages (sample expansions)
export const tasPayloads: Record<number, string> = {
    1: `The fragments arrive in a tin - damp paper, numbers scrawled in margins. Between lines, tiny letters lean toward each other as if whispering. Reconstruct the chronological order by reading the oldest rust stains.`,
    8: `Entropy logs: over the course of hours, tokens shift. Record each delta and stitch them into the sequence. The more you wait the more they unravel.`,
    14: `Echo Hollow: The room repeats phrases from long-dead transmissions. Listen for the one phrase that repeats without variation; that phrase hides a token.`,
    24: `Final Proof: The chamber dims. The machines that once sang now cough. One last chain of riddles stands between you and the seal. Solve them all and the archive will accept the registration.`
};

export const entityPayloads: Record<number, string> = {
    1: `Blindwatch clip: a scratched recording where two voices overlap; listen for the character that is inconsistant. Reverse the slow track to reveal a fragment.`,
    8: `Drift logs show token prefixes changing by one character every minute. Capture a sequence of five changes to form the token.`,
    14: `Whisper Log: A compressed track plays at low volume. Boost the quiet portion to hear the whisper. The first word is your key.`,
    24: `Final Seal: The gate hums with something that is not music. Arrange the words you've collected into the exact phrase; it must be precise, else the seal will not hold.`
};

export default {
    tasRiddleBank,
    entityRiddleBank,
    tasPayloads,
    entityPayloads
};
