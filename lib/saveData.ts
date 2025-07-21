// Note any updates to routes must reflect to middleware.ts
// as vercel doesn't support importing values from here

export const routes = {
    notFound: "/404",
    moonlight: "/moonlight",
    choices: "/choices",
    terminal: "/terminal",
    oArvoreDaCarne: "/O-ARVORE-DA-CARNE",
    api: {
        csrfToken: "/api/csrf-token",
        state: "/api/state",
        press: "/api/press",
        auth: "/api/auth"
    },
    fileConsole: "/file-console",
    home: "/home",
    h0m3: "/h0m3",
    wifiPanel: "/wifi-panel",
    theEnd: "/the-end",
    blackAndWhite: "/black-and-white",
    smileking: "/smileking",
    smilekingAuth: "/smileking-auth",
    wifiLogin: "/wifi-login",
    media: "/media",
    root: "/",
    cheater: "/CHEATER",
    tree98: "/file-console/tree98",
    scroll: "/scroll"
}

export const cookies = {
    // Cookie to check if the user is allowed to see temporarily access the moonlight page
    theMoon: "themoon",
    // Cookie to check if the user saw KILL TAS cutscene
    killTAS: "KILLTAS_cutscene_seen",
    // Cookie to check if the user saw the o Arvore da Carne cutscene due to /dream
    tree: "TREE",
    // Cookie to check if the user got the "The Hollow Pilgrimage" video Easter egg
    hollowPilgrimage: "THP_Play",
    // Cookie to check if the user saw the moonlight cutscene
    moonTime: "moonlight_time_cutscene_played",
    // Cookie to check if the user saw the interference cutscene
    interference: "Interference_cutscene_seen",
    // Cookie to check if the user can access BnW
    blackAndWhite: "BnW_unlocked",
    // Cookie to check if the user can access Choice
    choice: "Choice_Unlocked",
    // Cookie to check if the user can access File Console
    fileConsole: "File_Unlocked",
    // Cookie to check if the user can access the Buttons
    buttons: "Button_Unlocked",
    // Cookie to check if the user can access the terminal
    terminal: "terminal_unlocked",
    // Cookie to check if the user already saw tree98 page
    tree98: 'tree98_cutscene_seen',
    // Cookie to check if the user is logged in to tree98
    loggedIn: 'tree98_logged_in',
    // Cookie to check if corrupt sequence can be played
    corrupt: "Corrupt",
    // Cookie to check if the user is in the corrupt limbo state
    corrupting: "corrupting",
    // Cookie to check if the user has completed the corrupt sequence
    noCorruption: "No_corruption",
    // Cookie to check if the user can access the scroll page
    scroll: "Scroll_unlocked",
    // Cookie to check if the user can access the Wi-Fi page
    wifiPanel: "Wifi_Unlocked",
    // Cookie to check if the user has passed the Wi-Fi login
    wifiPassed: "wifi_passed",
    // Cookie to check if the user can access the login page of Wi-Fi
    wifiLogin: "wifi_login",
    // Cookie to check if the user has entered the end
    endQuestion: "End?",
    // Cookie to check if the user has completed the end
    end: "End",
    // Cookie to check if the user can access the media page
    media: "Media_Unlocked",
    // Cookie storing the hash of the admin password inputted by user - Does not reflect the actual password unless the user successfully logged in
    adminPass: "admin-pass",
    // Cookie to check if the user has accepted the disclaimers
    disclaimersAccepted: "accepted",
}

export const localStorageKeys = {
    // Check if the TTS message about time was run - LocalStorage key
    timeTTSSpoken: "voidTTSPlayed",
    // Number of times the facility has been refreshed - LocalStorage key
    refreshCount: "facilityRefreshCount",
    // Check if file console already executed the long boot sequence - LocalStorage key
    fileConsoleBooted: "fileConsoleBooted",
    // Check if the flower in the end is cut
    flowerCut: "flowerCut",
    // Check if the user has seen the vessel boot sequence in tree98
    vesselBoot: "SeenVesselBoot"
}
