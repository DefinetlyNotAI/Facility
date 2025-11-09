export const genericErrors = {
    ip: {
        addError: "Failed to add IP information",
        missingError: "Missing ip in body",
        dbError: "DB fetch for banned list failed",
        checkError: "Failed checking banned list",
        delError: "Failed deleting IP from banned list",
    },
    invalidCsrf: "Invalid/Non-existent CSRF token",
    invalidFormat(dataType: string) {
        return `Invalid data format for ${dataType}`;
    },
    internalServerError: "Internal server error has occurred. Please try again later and report this issue!",
    invalidItem: "Data provided does not match any known items that are allowed to be checked.",
    missingData: "Missing data in request body",
}

export const auth = {
    passReqErr: "Password required",
    incorrectPass: "Incorrect password",
    invalidMethod: "Method not allowed",
    serverConfigErr: "Server configuration error"
}
export const keywords = {
    // All keywords were set as lowercase when hashed - sha256
    knownHashes: [
        "6780ebaed4e668c7c00580830401a52bf7717d16b6998d7d3c598f611d7d5f2a",
        "2b390c28565e0b1df45413e4ac55d1286e62e1c4cd80f5ec896b3784e5cd5f74",
        "6a2be74b7b9aa1ce1015a934ec97e1cd9371870b8a8ba1e518abd74a9135fa44",
        "99d115eadab206cb7485d6a34d7154de88f450c221384afac0c159dfbbabf5f5",
        "f4f383ec8075df0c0c4a65c6234aa324aa2dd3d26b8709706a000caaff5323f3",
        "6d505cd17eebeb35154cb4d8b57b4daa9ad7afa8e7b6d5c2ce2db8801f44dd62"
        ,],
    invalidInput: "Invalid input",
}
export const press = {
    invalidToken: "Invalid CSRF token",
    browserNotSpecified: "Browser not specified",
    browserNotFound: "Browser not found",
    alreadyPressed: "Already pressed",
    internalError: "Internal server error",
    errorPressingButton: "Error pressing button",
}
export const signCookie = {
    invalidDataFormat: "Invalid data format. Expected key=value",
    missingKeyOrValue: "Missing key or value",
}
export const state = {
    failedToFetch: "Failed to fetch button states",
    errorFetchingStates: "Error fetching button states:",
}
export const wifiPanel = {
    useTools: "USE WHAT TOOLS WERE IMPOSED ON YOU - [curl in the userAgent header]",
}
export const allowedActs: string[] = [
    'Act_I', 'Act_II', 'Act_III', 'Act_IV', 'Act_V',
    'Act_VI', 'Act_VII', 'Act_VIII', 'Act_IX', 'Act_X'
];
export const bonusMsg = {
    invalidCsrf: "Invalid CSRF token",
    invalidAct: "Invalid or missing act",
    toggleError: "Failed to toggle act",
    checkError: "Failed to check act",
    missingParam: "Invalid or missing act parameter, try /api/checkAll to see all available acts",
    fetchError: "Failed to fetch progress for all acts",
}
