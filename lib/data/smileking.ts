// NOTE: doesn't include the auth api messages

// smileking server const
export const undefinedVar: string = "SMILEKING_PASS or SALT environment variable is not set"

// smileking client const
export const text = {
    title: "😐 smileking",
    subtitle: "This is not part of the puzzle.",
    sectionCookieHeader: "Cookies",
    sectionButtonHeader: "Button States (DB)",
}
export const buttonState = {
    cookies: {
        set: "Variable doesn't exist =>",
        unset: "Variable exists =>",
    },
    buttons: {
        unset: "Button recorded as clicked",
        set: "Button recorded as not yet clicked",
    },
}

// smileking auth const
export const errorMsg = {
    emptyPassword: "Password cannot be empty",
    authFailed: "Authentication failed",
    authAPIFailed: "Authentication API failed: ",
    audioErr: "Failed to play audio: ",
}
export const warningMsg: string = "This is not part of the puzzle. Only the creator can control the system here. Please leave."
export const authText = {
    title: "Smileking Authentication",
    formPlaceholder: "Enter access code",
    enter: "Enter"
}
