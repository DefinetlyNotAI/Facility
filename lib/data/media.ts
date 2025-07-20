export const err = {
    incorrectKeyword: 'Incorrect keyword.',
    unsupportedAudioBrowser: 'Your browser does not support audio playback.',
}
export const text = {
    title: "Media Repository",
    entryMsg: "Enter access keyword[2] to access the media repository.",
    unlockButton: "Unlock",
    itemTitle1: "Audio File => key[3]",
    itemTitle2: "key[3] => Protected File => key[4]: First letter is caps only!",
    itemTitle3: "key[4] => Protected File => PATH: First letter is caps only!",
}
export const getStatusText: (played: boolean, dl1: boolean, dl2: boolean) => string = (played: boolean, dl1: boolean, dl2: boolean) =>
    `2 locks guard the next stop.. Key 1 is achieved by not cheating and solving it as intended... Key 2 is the path obtained. ${played ? '✅' : '❌'}${dl1 ? '✅' : '❌'}${dl2 ? '✅' : '❌'}`;