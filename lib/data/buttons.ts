// Buttons.tsx
export const BROWSERS: string[] = [
    'Chrome',
    'Firefox',
    'Safari',
    'Edge',
    'Opera'
];
export const WINGDING: string = '👍︎♒︎♏︎♍︎🙵 ⧫︎♒︎♏︎ 👍︎💧︎💧︎ ⬧︎♏︎♍︎❒︎♏︎⧫︎';
export const SUBTITLE_TEXT: string = `Click the button matching your browser to activate it globally. \nCollaboration required - each browser can only be pressed once.`;
export const TOOLTIP = {
    ONLY_THIS_BROWSER: (browser: string) => `This button is for ${browser} browser only`,
    ALREADY_PRESSED: 'Button already pressed',
    CLICK_TO_PRESS: (browser: string) => `Press to activate ${browser} button`,
}
export const TITLE: string = 'Buttons for 5.. 5 Vessels!!';
