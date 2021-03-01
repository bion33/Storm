// This should use modules instead of being so damn long, but browser extensions don't support them yet (2021-01-18)
// See: https://stackoverflow.com/questions/48104433/how-to-import-es6-modules-in-content-script-for-chrome-extension
// That's why this file is separated into several big chunks.

// Namespace
/** @namespace chrome.runtime **/
/** @namespace chrome.runtime.onMessage **/


// =====================================================================================================================
// Classes
// (Declaring these here prevents ReferenceError: can't access lexical declaration 'x' before initialization)

/**
 * Maps keys to an action
 */
class KeyboardShortcut {
    /**
     * Create a new KeyboardShortcut for the given keys with the given action
     * @param {Array} keys Array of "key=description" where "key" is a KeyboardEvent key
     * @param {Function} action The Function to execute when any key in keys is hit
     */
    constructor(keys, action) {
        "use strict";
        this.keys = [];
        for (let i = 0; i < keys.length; i++) {
            this.keys.push(keys[i].split("=")[0].toLowerCase());
        }
        this.action = action;
    }

    /**
     * Run the shortcut's action if the key matches any of this KeyboardShortcuts' keys
     * @param {string} key 
     */
    run_if_for(key) {
        "use strict";
        if (this.keys.includes(key.toLowerCase())) this.action();
    }
}

// =====================================================================================================================
// Init

// URL
let url = window.location.href;

// User Agent
let userAgent = "Application: Storm (https://github.com/Krypton-Nova/Storm)";
if (document.cookie.startsWith("telegrams=")) userAgent += "; User: " + document.cookie.split("=")[1];

// For debugging: toggle to reset stored data
// localStorage.clear();

// Send current page to background script
chrome.runtime.sendMessage({action: "store", url: url});

// Set Defaults
setDefaults();

// Global variables (except url, as it is needed above)
let shifted = false;
let controlled = false;
let alternated = false;
let numpad = false;
let JumpPoint = localStorage.JumpPoints.split(",")[0];
let keys = getKeys();
let shortcuts = defineShortcuts();

// Only for the transition from v3.2 to v4.0: set defaults again to filter out undefined keys
setDefaults();


// =====================================================================================================================
// Popup.js event resolution

// noinspection JSLint (surpress message for "sender" not being used, as sender is important),JSDeprecatedSymbols
chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        "use strict";
        switch (message.type) {
            case "getJumpPoints":
                sendResponse(localStorage.JumpPoints);
                break;
            case "setJumpPoint":
                JumpPoint = setJumpPoint(message.data);
                break;
            case "deleteJumpPoint":
                JumpPoint = deleteJumpPoint(message.data);
                break;
            case "getRole":
                sendResponse(localStorage.Role);
                break;
            case "setRole":
                localStorage.Role = message.data;
                break;
            case "getScroll":
                sendResponse(localStorage.Scroll === "true");
                break;
            case "setScroll":
                localStorage.Scroll = message.data;
                break;
            case "getDirectMove":
                sendResponse(localStorage.DirectMove === "true");
                break;
            case "setDirectMove":
                localStorage.DirectMove = message.data;
                break;
            case "getKeys":
                sendResponse(keys);
                break;
            case "getKey":
                sendResponse(localStorage[message.data]);
                break;
            case "setKey":
                sendResponse(setKey(message.data));
                break;
            case "background":
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);


// =====================================================================================================================
// Right before DOM content is loaded

document.addEventListener("readystatechange", function () {
    "use strict";
    if (document.readyState === "interactive") {

        reloadReady();
        addMoveToRegionBar();

    }
});


// =====================================================================================================================
// When DOM content is loaded

window.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // Handle Key Down
    document.addEventListener("keydown", function (e) {
        preKeyChecks(e); // If you add code below, the event should return early when this method returns false
    });

    // Handle Key Up
    document.addEventListener("keyup", function (e) {
        if (!preKeyChecks(e)) return;

        shortcuts.forEach(key => key.run_if_for(e.key));

    });
    
});


// =====================================================================================================================
// When page is fully loaded

window.addEventListener("load", function () {
    "use strict";

    displayLoadTime();
    linkifyAjax();
    scrollToBottom();
    highlightEndorsed();

});


// =====================================================================================================================
// Defaults

/**
 * Set localStorage keys to their default values
 **/
function setDefaults() {
    "use strict";

    // Default Settings
    setDefault("JumpPoints", "https://www.nationstates.net/region=artificial_solar_system");
    setDefault("Role", "Officer");
    setDefault("Scroll", false);
    setDefault("DirectMove", true);

    // Default keybinds
    setDefaultKey("KeyReports", " ", "Spacebar");
    setDefaultKey("KeyBack2", "Backspace");
    setDefaultKey("KeyRefresh1", "F5");
    setDefaultKey("KeyCopyUrl", "F6");
    setDefaultKey("KeyBack1", "F7");
    setDefaultKey("KeyForward", "F8");
    setDefaultKey("KeyDosL1", "1");
    setDefaultKey("KeyDosL2", "2");
    setDefaultKey("KeyDosL3", "3");
    setDefaultKey("KeyDosL4", "4");
    setDefaultKey("KeyDosL5", "5");
    setDefaultKey("KeyDosR1", "1", "NP 1");
    setDefaultKey("KeyDosR2", "2", "NP 2");
    setDefaultKey("KeyDosR3", "3", "NP 3");
    setDefaultKey("KeyDosR4", "4", "NP 4");
    setDefaultKey("KeyDosR5", "5", "NP 5");
    setDefaultKey("KeyActivity", "a");
    setDefaultKey("KeyBan", "b");
    setDefaultKey("KeyCross", "c");
    setDefaultKey("KeyDoss", "d");
    setDefaultKey("KeyEndo", "e");
    setDefaultKey("KeyGcrHap", "g");
    setDefaultKey("KeyRegHap", "h");
    setDefaultKey("KeyWAJL1", "j");
    setDefaultKey("KeyRefresh2", "k");
    setDefaultKey("KeyWAJL2", "l");
    setDefaultKey("KeyMove", "m");
    setDefaultKey("KeyNation", "n");
    setDefaultKey("KeyOfficer", "o");
    setDefaultKey("KeyJP", "p");
    setDefaultKey("KeyRegion", "r");
    setDefaultKey("KeySwitch", "s");
    setDefaultKey("KeyTemplate", "t");
    setDefaultKey("KeyUpdate", "u");
    setDefaultKey("KeyWAD", "w");
    setDefaultKey("KeyClearDoss", "x");
    setDefaultKey("KeyZombie", "z");

}

/**
 * Assign the given value to the given key in localStorage
 * @param {string} storageKey
 * @param {any} value
 **/
function setDefault(storageKey, value) {
    "use strict";

	if (!(storageKey in localStorage) || localStorage[storageKey] === undefined) {
    	localStorage[storageKey] = value;
	}
}

/**
 * Assign the given shortcut key with optional description to the given key in localStorage
 * @param {string} storageKey 
 * @param {string} value KeyboardEvent key
 * @param {string} description (Optional) Display key
 **/
function setDefaultKey(storageKey, value, description = undefined) {
    // Don't "use strict" in functions with optional parameters!

    if (description === undefined) description = value;
    setDefault(storageKey, value + "=" + description);
}


// =====================================================================================================================
// Settings Management

/**
 * Get the current jump point
 */
function getJumpPoint() {
    "use strict";
    return localStorage.JumpPoints.split(",")[0];
}

/**
 * Add a jump point if not yet saved and set it as the current jump point.
 * @param {string} jp URL to the jump point
 * @returns {string} Current jump point
 */
function setJumpPoint(jp) {
    "use strict";
    // Set new JP as current
    let jps = jp + "," + localStorage.JumpPoints;
    // Filter out duplicates
    jps = jps.split(",").filter((p, index, self) => p && self.indexOf(p) === index);
    localStorage.JumpPoints = jps.join(",");
    // Return current JP
    return getJumpPoint();
}

/**
 * Remove a jump point from the list
 * @param {string} jp URL to the jump point
 * @returns {string} URL to the current jump point
 */
function deleteJumpPoint(jp) {
    "use strict";

    localStorage.JumpPoints = localStorage.JumpPoints.split(",").filter(p => p !== jp).join(",");
    
    return getJumpPoint();
}

/**
 * Update the settings to replace a keyboard shortcut's assigned key to another
 * @param {string} data String formatted as such: "LocalStorageKeyName=key=description", where "key" is a KeyboardEvent key
 */
function setKey(data) {
    "use strict";

    data = data.split("=");
    let k = data[0];
    let v = data[1];
    let d = data[2];
    
    // Prevent duplicate keys
    let duplicates = Object.keys(localStorage).filter(key => key.startsWith("Key") && localStorage[key] === v + "=" + d);
    for (let i = 0; i < duplicates.length; i++) {
        if (duplicates[i] !== k) return false;
    }

    // Update setting
    localStorage[k] = v + "=" + d;

    // Rebuild key and shortcuts lists
    keys = getKeys();
    shortcuts = defineShortcuts();

    return true;
}


// =====================================================================================================================
// NationStates

/**
 * Request something from the NationStates API
 * If this is to be used frequently, it needs a mechanism to impose the rate limit
 * Currently only used by "waDelegate" on user keypress
 * @param {string} url API url
 */
async function nsApiRequest(url) {
    "use strict";
    let headers = new Headers({"User-Agent": userAgent});
    let response = await fetch(url, {headers: headers});
    return await response.text();
}

/**
 * Send a POST request to NationStates
 * @param {string} url to POST to
 * @param {string} content (urlencoded)
 * @param {Function} onSuccess execute function
 * @param {Function} onFailure execute function with status code
 */
function nsPostRequest(url, content, onSuccess, onFailure) {
    "use strict";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = "document";
    xhr.setRequestHeader("User-Agent", userAgent);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(content);

    xhr.addEventListener("readystatechange", function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) onSuccess(xhr);
            else onFailure(xhr);
        }
    });
}

/**
 * Loads the given url in an IFrame, which can be used to get otherwise inaccessible information from.
 * The advantage of an IFrame is that you can be sure the user remains logged in and cookies remain set.
 * @param {string} url
 * @param {Function} then once the frame is interactive execute this Function
 */
function openFrame(url, then) {
    "use strict";
    // Prevent creating multiple frames (so shortcut-spam doesn't impact NS)
    if (document.getElementById("tempFrame")) return undefined;

    // Create an invisible IFrame which loads the given url
    let frame = document.createElement("IFRAME");
    frame.id = "tempFrame";
    frame.name = frame.id;
    frame.style = "height: 0px; width: 0px; position: absolute; visibility: hidden;"
    frame = document.body.appendChild(frame);
    window.open(url, frame.name);
    
    // Once loaded, return the document within the frame
    frame.addEventListener("load", function() {
        then(frame.contentDocument);

        // Cooldown and cleanup
        setTimeout(function () {
            document.body.removeChild(frame);
        }, 1000);
    });
}

/**
 * Get the name of the region your nation is located in
 */
function getRegion() {
    "use strict";
    if (url.includes("page=reports") || url.includes("page=ajax2")) {
        return undefined;
    }
    let y = Array.from(document.getElementById("panel").getElementsByTagName("A")).find(l => l.href.includes("region="));
    return y.href.split("region=")[1];
}

/**
 * Open the page of the region your nation is located in
 */
function openRegion() {
    "use strict";
    let r = getRegion();
    if (r) {
        window.location.replace("https://nationstates.net/region=" + r);
    }
}

/**
 * Clicks the move button to move your nation to a region
 */
function moveToRegion() {
    "use strict";
    let m = document.getElementsByClassName("button").namedItem("move_region");
    if (m !== null) {
        m.click();
    } else {
        document.getElementsByTagName("INPUT").namedItem("move_region").click();
    }
}

/**
 * Move to the given region instantly from any NationStates page
 * @param {string} region name or url
 * @param {boolean} openAfterMove whether to open the region page after moving there
 */
function moveToRegionDirect(region, openAfterMove) {
    "use strict";
    region = region.toLowerCase().replace(/ /g, "_");
    if (region.includes("/region=")) region = region.split("=")[1];
    let regionUrl = "https://www.nationstates.net/region=" + region;
    let noTemplateRegionUrl = "https://www.nationstates.net/template-overall=none/region=" + region;

    openFrame(noTemplateRegionUrl, function(frame) {
        // Get localid
        let localid = frame.getElementsByName("localid")[0]
        // Region doesn't exist if localid is undefined
        if (!localid) {
            notify("Either " + region + " doesn't exist, or you're already located in it", "Yellow");
            return;
        }

        let target = "https://www.nationstates.net/page=change_region";
        let content = "localid=" + localid.value + "&region_name=" + region + "&move_region=1";

        // Move
        nsPostRequest(target, content, (xhr) => {
            // Success
            window.location.href = (openAfterMove) ? regionUrl : url;   // Open region or refresh
        }, (xhr) => {
            // Failure
            notify("Something went wrong, couldn't move your nation to " + region, "Yellow");
        });
    });
}

/**
 * Open a nation or region link in the ajax2 reports feed at the given position
 * @param lr: left(=0) or right(=1) of happening
 * @param n: on the nth line (0 being the 1st line)
 **/
function openNationOrRegion(lr, n) {
    "use strict";
    // If on reports or activity page
    if (url.includes("page=reports") || url.includes("page=ajax2")) {
        let a = document.getElementsByTagName("LI")[n].getElementsByTagName("A");
        // When nation relocated from region A to region B, the nation will be considered to the left of the happening, and the destination region (B) to the right.
        if (a.length === 3 && lr === 1) lr = 2;
        a = a[lr]
        a.click();
        a.style.backgroundColor = "yellow";
    } else {
        document.getElementsByClassName("button").namedItem("action").click();
    }
}


// =====================================================================================================================
// Webpage

/**
 * Show the given message at the top of a NationStates page
 * @param {string} message
 * @param {string} color of the message box
 **/
function notify(message, color) {
    "use strict";
    let m = document.createElement("div");
    m.id = "temp-msg";
    m.style.cssText = "background-color: " + color + "; padding: 7px 7px; font-size: 14;";
    m.innerText = message;
    // First child of content if it exists, else of main (antiquity theme)
    let c = document.getElementById("content") ? document.getElementById("content") : document.getElementById("main");
    c.insertBefore(m, c.firstChild);
    setTimeout(function () {
        let op = 1;  // initial opacity
        setInterval(function () {
            m.style.opacity = op;
            m.style.filter = "alpha(opacity=" + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
    }, 4800);
    setTimeout(() => c.removeChild(m), 6000);
}

/**
 * Add an input to the NS page which users can use to move directly to a region
 */
function addMoveToRegionBar() {
    "use strict";

    if (localStorage.DirectMove === "false") return;

    let bar = document.createElement("div");
    bar.id = "move-to-region-direct";
    bar.style.cssText = "padding: 8px; font-size: 14; display: flex; justify-content: center;";

    let field = document.createElement("input");
    field.id = "direct-move-field";
    field.type = "text";
    field.placeholder = "Region name or url"
    field.style.cssText = "margin-right: 8px;"
    field = bar.appendChild(field);

    let button = document.createElement("button");
    button.id = "direct-move-button"
    button.classList.add("button");
    button.classList.add("primary");
    button.innerText = "Move to";
    button = bar.appendChild(button);
    button.addEventListener("click", function() {
        if (field.value) moveToRegionDirect(field.value, false);
    })
    
    let c = document.getElementById("content") ? document.getElementById("content") : document.getElementById("main");
    if (c) c.insertBefore(bar, c.firstChild);
}

/**
 * If on the reports page, make the page border green so the user knows they can safely refresh.
 **/
function reloadReady() {
    "use strict";

    if (url === "https://www.nationstates.net/template-overall=none/page=reports") {
        document.getElementsByTagName("HTML")[0].style.borderColor = "#33cc00";
    }
}

/**
 * Start nation pages at the bottom for faster endorsing. Depends on whether or not Scroll is enabled in settings.
 **/
function scrollToBottom() {
    "use strict";

    if (localStorage.Scroll === "true" && url.includes("nation=") && !url.includes("template-overall=none") && !url.includes("page=join_WA")) {
        window.scrollTo(0, document.body.scrollHeight);
    }
}

/**
 * Add links to nations and regions in the ajax2 stream
 */
function linkifyAjax() {
    "use strict";

    if (url.includes("page=ajax2") || url.includes("page=reports")) {
        let nations = document.getElementsByClassName("nlink");
        for (let i = 0; i < nations.length && i < 10; i++) {
            nations[i].href = "https://nationstates.net/template-overall=none/nation=" + nations[i].href.split("/nation=")[1];
        }
        let regions = document.getElementsByClassName("rlink");
        for (let i = 0; i < regions.length && i < 10; i++) {
            regions[i].href = "https://nationstates.net/template-overall=none/region=" + regions[i].href.split("/region=")[1];
        }
    }
}

/**
 * Display load time on the reports page
 */
function displayLoadTime() {
    "use strict";

    if (url.includes("page=reports")) {
        let loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        let l = document.createElement("span");
        l.innerText = " - PAGE LOAD TIME: " + loadTime + " ms";
        l.style.color = "#006400";
        document.body.insertBefore(l, document.getElementsByTagName("H1")[0]);
    }
}

/**
 * If viewing a nation page of another nation which is in the WA, ask the background script if it has any information
 * on which of its endorsees you've endorsed.
 */
function highlightEndorsed() {
    "use strict";
    let endobox = document.getElementsByClassName("unbox")[0];
    if (!(url.includes("/nation=") && endobox && endobox.getElementsByTagName("A"))) return;

    let own = document.body.getAttribute("data-nname");
    let nation = url.split("=")[1].toLowerCase().replace(/ /g, "_");
    if (nation === own) return;

    let endorsees = Array.from(document.getElementsByClassName("unbox")[0].getElementsByTagName("A"));

    // Request the nations you've endorsed for this "point"
    chrome.runtime.sendMessage({action: "endorsed", point: nation});

    // Highlight those nations green background script knows you've already endorsed
    chrome.runtime.onMessage.addListener(function (response) {
        if (response.action === "endorsed" && response.endorsed) {
            endorsees.filter(e => response.endorsed.includes(e.href.split("=")[1]))
                     .forEach(e => e.style.cssText = "background-color: DarkSeaGreen");
        }
    });

    // Highlight nations green when background script discovers it was endorsed
    chrome.runtime.onMessage.addListener(function (response) {
        if (response.action === "endorsedUpdate" && response.endorsee) {
            let found = endorsees.find(e => e.href.split("=")[1] === response.endorsee)
            if (found) found.style.cssText = "background-color: DarkSeaGreen";
        }
    });
}


// =====================================================================================================================
// Keyboard Shortcuts

/**
 * This function serves to make the transition from deprecated keyCode to key easier for the user. It translate a 
 * JavaScript KeyboardEvent keyCode to a KeyboardEvent key. This translation works only for keyCodes common to all layouts, 
 * variable keyCodes (in other words, those which are "missing" in the dictionary) are not translated.
 * @param {number} keyCode 
 */
function keyCodeToKey(keyCode) {
    "use strict";
    let dict = {
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        44: "PrintScreen",
        45: "Insert",
        46: "Delete",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        91: "Meta",
        92: "Meta",
        93: "ContextMenu",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        173: "AudioVolumeMute",
        174: "AudioVolumeDown",
        175: "AudioVolumeUp",
        181: "LaunchMediaPlayer",
        182: "LaunchApplication1",
        183: "LaunchApplication2",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
    };

    return dict[keyCode];
}


/**
 * Update modifiers (shifted, controlled, alternated), ensure user is not filling in a form, and prevent default browser behaviour if pressed key is a shortcut
 * @param {KeyboardEvent} e 
 */
function preKeyChecks(e) {
    "use strict";

    let key = e.key.toLowerCase();

    shifted = e.shiftKey;
    controlled = e.ctrlKey;
    alternated = e.altKey;
    numpad = (e.location === 3);

    // Stop shortcut in these cases
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return false;
    }
    if (controlled || alternated || (shifted && key !== localStorage.KeyJP.split("=")[1])) {
        return false;
    }

    // Prevent default action if key active as shortcut
    if (keys.includes(key)) {
        e.preventDefault();
    // Key not a shortcut
    } else {
        return false;
    }

    return true;
}

/**
 * Get KeyboardEvent keys from Key settings in localStorage
 */
function getKeys() {
    "use strict";
    let k = [];

    // Fill list of keyboard shortcuts ("keys") with those found in localStorage
    Object.keys(localStorage).forEach(function (key) {
        // If this setting is a keyboard shortcut, and the value is a number, it is a keyCode (except for 0 trough 9, those are key names).
        // This is likely a remnant of v3.1, so translate deprecated keyCode to key.
        let value = Number.parseInt(localStorage[key]);
        if (key.startsWith("Key") && !Number.isNaN(value) && (value < 0 || 9 < value)) {
            localStorage[key] = keyCodeToKey(value);
        }

        // Append key
        // Stored key is of format "key=description" where "key" is a KeyboardEvent key
        if (key.startsWith("Key")) {
            k.push(localStorage[key].split("=")[0].toLowerCase());
        }

    });

    return k;
}

/**
 * Define which shortcut key(s) triggers what action
 */
function defineShortcuts() {
    "use strict";

    return [

        new KeyboardShortcut([localStorage.KeyCopyUrl], pageCopyURL),
        new KeyboardShortcut([localStorage.KeyBack1, localStorage.KeyBack2], pageBack),
        new KeyboardShortcut([localStorage.KeyForward], pageForward),
        new KeyboardShortcut([localStorage.KeyRefresh1, localStorage.KeyRefresh2], pageRefresh),

        new KeyboardShortcut([localStorage.KeyUpdate], activityNationUpdate),
        new KeyboardShortcut([localStorage.KeyActivity], activitySpotAll),
        new KeyboardShortcut([localStorage.KeyReports], activityReportSpot),
        new KeyboardShortcut([localStorage.KeyRegHap], activitySpotRegional),
        new KeyboardShortcut([localStorage.KeyGcrHap], activityWorld),

        new KeyboardShortcut([localStorage.KeyNation], nation),
        new KeyboardShortcut([localStorage.KeySwitch], nationSwitch),
        new KeyboardShortcut([localStorage.KeyEndo], nationEndorse),
        new KeyboardShortcut([localStorage.KeyCross], nationCross),
        new KeyboardShortcut([localStorage.KeyBan], nationBanject),

        new KeyboardShortcut([localStorage.KeyDoss], dossierAdd),
        new KeyboardShortcut([localStorage.KeyClearDoss], dossierClear),
        new KeyboardShortcut([localStorage.KeyDosL1], function() { openNationOrRegion(0, 0) }),
        new KeyboardShortcut([localStorage.KeyDosL2], function() { openNationOrRegion(0, 1) }),
        new KeyboardShortcut([localStorage.KeyDosL3], function() { openNationOrRegion(0, 2) }),
        new KeyboardShortcut([localStorage.KeyDosL4], function() { openNationOrRegion(0, 3) }),
        new KeyboardShortcut([localStorage.KeyDosL5], function() { openNationOrRegion(0, 4) }),
        new KeyboardShortcut([localStorage.KeyDosR1], function() { openNationOrRegion(1, 0) }),
        new KeyboardShortcut([localStorage.KeyDosR2], function() { openNationOrRegion(1, 1) }),
        new KeyboardShortcut([localStorage.KeyDosR3], function() { openNationOrRegion(1, 2) }),
        new KeyboardShortcut([localStorage.KeyDosR4], function() { openNationOrRegion(1, 3) }),
        new KeyboardShortcut([localStorage.KeyDosR5], function() { openNationOrRegion(1, 4) }),
        
        new KeyboardShortcut([localStorage.KeyRegion], region),
        new KeyboardShortcut([localStorage.KeyMove], regionMove),
        new KeyboardShortcut([localStorage.KeyJP], regionJumpPoint),
        new KeyboardShortcut([localStorage.KeyOfficer], officer),
        
        new KeyboardShortcut([localStorage.KeyWAJL1, localStorage.KeyWAJL2], wa),
        new KeyboardShortcut([localStorage.KeyWAD], waDelegate),

        new KeyboardShortcut([localStorage.KeyTemplate], styling),
        new KeyboardShortcut([localStorage.KeyZombie], zombieControl)

    ];
}

/**
 * Copy the url of the current page to the clipboard
 */
function pageCopyURL() {
    "use strict";

    let temp = document.createElement("INPUT");
    temp = document.body.appendChild(temp);
    temp.value = url;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);

    notify("Link copied!", "LightBlue");
}

/**
 * Navigate to the previous page
 */
function pageBack() {
    "use strict";

    // Send message to background script
    chrome.runtime.sendMessage({action: "previous", url: url});
    // Receive and load page in message
    chrome.runtime.onMessage.addListener(function (load) {
        if (load.action !== "previous") return;
        window.location.href = load.url;
    });
}

/**
 * Navigate to the next page
 */
function pageForward() {
    "use strict";

    // Send message to background script
    chrome.runtime.sendMessage({action: "next", url: url});
    // Receive and load page in message
    chrome.runtime.onMessage.addListener(function (load) {
        if (load.action !== "next") return;
        window.location.href = load.url;
    });
}

/**
 * Refresh the current page
 */
function pageRefresh() {
    "use strict";

    // If on the reports page and it is reloaded, make the green page border red so the user knows they shouldn"t press refresh again.
    if (url.includes("/template-overall=none/page=reports")) {
        // Only get reports for the last 6 minutes.
        document.getElementsByTagName("INPUT").namedItem("report_hours").value = "24";
        // Set the border to red so the user knows not to press refresh.
        document.getElementsByTagName("HTML")[0].style.borderColor = "#ff0000";
        // Generate new report.
        document.getElementsByTagName("INPUT").namedItem("generate_report").click();
    } else {
        window.location.reload();
    }
}

/**
 * Watch the activity page to see if your nation has updated
 */
function activityNationUpdate() {
    "use strict";

    window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=self/filter=change";
}

/**
 * Watch the activity page to spot, or see all changes (toggle modes)
 */
function activitySpotAll() {
    "use strict";

    if (url.includes("/page=activity/view=world/filter=move+member+endo")) {
        window.location.href = "https://www.nationstates.net/page=activity/view=world";
    } else if (url.includes("/page=activity/view=world")) {
        window.location.href = "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo";
    } else {
        window.location.href = "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo";
    }
}

/**
 * Open the reports page, or open the ajax feed to spot (toggle)
 */
function activityReportSpot() {
    "use strict";
    if (url.includes("/template-overall=none/page=reports")) {
        window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=world/filter=move+member+endo";
    } else {
        window.location.href = "https://www.nationstates.net/template-overall=none/page=reports";
    }    
}

/**
 * Watch the activity page to spot (regional)
 */
function activitySpotRegional() {
    "use strict";

    let re = getRegion();
    if (re) {
        window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=region." + re + "/filter=move+member+endo";
    }
}

/**
 * Watch the world activity page to see GCR updates
 */
function activityWorld() {
    "use strict";
    window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=world/filter=change";
}

/**
 * Open your own nation. If on the reports page, opens the nation or region to the left of the last happening.
 */
function nation() {
    "use strict";
    if (url.includes("/page=reports") || url.includes("/page=ajax2")) {
        openNationOrRegion(0, 0)
    } else {
        window.location.href = "https://www.nationstates.net";
    }
}

/**
 * Switch nations. Move nation to jump point if not there. If there and not in the WA, applies to join. If there and in WA, resigns.
 */
function nationSwitch() {
    "use strict";
    // If in jump point, apply/leave WA
    if (getRegion() === JumpPoint.split("=")[1]) wa();
    // If not, move to jump point
    else moveToRegionDirect(JumpPoint, true);
}

/**
 * Endorse the nation in view. If on the reports page, opens the nation or region to the left of the happening.
 */
function nationEndorse() {
    "use strict";

    if (url.includes("/page=reports") || url.includes("/page=ajax2")) {
        openNationOrRegion(0, 0)
    }

    else if (document.getElementsByTagName("INPUT").namedItem("action").value === "endorse") {
        // Tell background script this nation is now endorsed
        chrome.runtime.sendMessage({action: "endorse", nation: url.split("=")[1], usedFrame: false});
        // Endorse
        document.getElementsByClassName("endorse button")[0].click();
    }
}

/**
 * Cross endorse nations endorsing the nation in view
 */
function nationCross() {
    "use strict";
    if (! url.includes("/nation=")) return;

    let user = document.body.getAttribute("data-nname");
    let point = url.split("=")[1];
    let endorsees = Array.from(document.getElementsByClassName("unbox")[0].getElementsByTagName("A")).map(a => a.href.split("=")[1]);
    let pin = Math.floor(Math.random() * 1000000000);

    // Tell background script on which point with which endorsees you wish to cross-endorse
    chrome.runtime.sendMessage({action: "cross", user: user, point: point, endorsees: endorsees, pin: pin});

    // Listen for response. Background script won't send one if user isn't allowed.
    chrome.runtime.onMessage.addListener(function tryEndorse(response) {

        // If an endorsee and the pins match, endorse
        // Since only the last listener triggers a response, former listeners (blocked due to timer) should be blocked. This is what the pin does.
        if (response.action === "cross" && pin === response.pin && response.endorsee) {
            openFrame("https://www.nationstates.net/template-overall=none/nation=" + response.endorsee, function(frame) {
                // Already endorsed is also success
                let success = frame.getElementsByTagName("INPUT").namedItem("action").value === "unendorse";
                // Endorse
                if (frame.getElementsByTagName("INPUT").namedItem("action").value === "endorse") {
                    frame.getElementsByClassName("endorse button")[0].click();
                    success = true;
                }
                // Tell background script this nation is now endorsed
                if (success) {
                    chrome.runtime.sendMessage({action: "endorse", nation: response.endorsee, usedFrame: true});
                    // Refresh
                    // window.location.href = url;
                }
            });
        }
        // else window.location.href = url;

        // Remove listener
        chrome.runtime.onMessage.removeListener(tryEndorse);
    });
}

/**
 * Banject the nation in view
 */
function nationBanject() {
    "use strict";
    document.getElementsByTagName("BUTTON").namedItem("ban").click();
}

/**
 * Add nation/region to dossier
 */
function dossierAdd() {
    "use strict";
    if (url.includes("/region=")) {
        // On region"s page
        document.getElementsByTagName("BUTTON").namedItem("add_to_dossier").click();
    } else {
        // Elsewhere
        document.getElementsByTagName("BUTTON").namedItem("action").click(); // Doss nation
    }
}

/**
 * Open your nation's dossier. If open, clear it.
 */
function dossierClear() {
    "use strict";
    if (url.includes("/page=dossier")) {
        document.getElementsByTagName("BUTTON").namedItem("clear_dossier").click();
    } else {
        window.location.href = "https://www.nationstates.net/page=dossier";
    }
}

/**
 * Shows the region you're in or refreshes its page. If in reports view, opens the nation or region to the right of the last happening 
 * (so, if it includes "... moved from x to y" it will open region y).
 */
function region() {
    "use strict";
    if (url.includes("/page=reports") || url.includes("/page=ajax2")) {
        openNationOrRegion(1, 0)
    } else {
        openRegion();
    }
}

/**
 * Move to the region in view, or the region filled in in direct move. If in reports view, opens the region to the right of the last change 
 * (so, if it includes "... moved from x to y" it will open region y).
 */
function regionMove() {
    "use strict";
    let directMove = document.getElementById("direct-move-field");

    if (url.includes("/page=reports") || url.includes("/page=ajax2")) {
        openNationOrRegion(1, 0)
    } else if (url.includes("/region=")) {
        moveToRegion();
    } else if (directMove) {
        moveToRegionDirect(directMove.value, false);
    }
}

/**
 * Move to jump point. If shifted, adds and sets the region in view as jump point.
 */
function regionJumpPoint() {
    "use strict";
    if (shifted) {
        if (url.includes("/region=")) {
            setJumpPoint(url);
            notify("JP Updated! -- This region has been saved to your Jump Points and set as your current one. You can change your active JP in the popup window.", "LightBlue");
        }
    } else {
        let region = JumpPoint.split("=")[1];
        if (region === undefined) {
            notify("You have no jump point set. Press Shift+" + localStorage.KeyJP.split("=")[0] + " on a region's page to add it to your jump points.", "Yellow");
        } else {
            moveToRegionDirect(region, true);
        }
    }
}

/**
 * Dismisses other nations from being officer, opens own officer page, assigns officer role to own nation, and opens regional controls.
 */
function officer() {
    "use strict";
    let current_nation = document.getElementById("loggedin").getAttribute("data-nname");
    // If on the regional control page, open own regional officer page
    if (url.includes("/page=region_control")) {
        window.location.href = "https://www.nationstates.net/page=regional_officer/nation=" + current_nation;
    // If on on own regional officer page, assign officer role
    } else if (url.includes("/page=regional_officer") && url.includes(current_nation)) {
        document.getElementsByTagName("INPUT").namedItem("office_name").value = localStorage.Role;
        document.getElementsByTagName("INPUT").namedItem("authority_A").checked = true;
        document.getElementsByTagName("INPUT").namedItem("authority_C").checked = true;
        document.getElementsByTagName("INPUT").namedItem("authority_E").checked = true;
        document.getElementsByTagName("INPUT").namedItem("authority_P").checked = true;
        document.getElementsByTagName("BUTTON").namedItem("editofficer").click();
    // If on someone else"s regional officer page, dismiss them
    } else if (url.includes("/page=regional_officer")) {
        document.getElementsByTagName("BUTTON").namedItem("abolishofficer").click();
    // If on none of these pages, open regional control page
    } else {
        window.location.href = "https://www.nationstates.net/page=region_control";
    }
}

/**
 * Apply/Join/Leave the World Assembly
 */
function wa() {
    "use strict";
    // Confirm to join
    if (url.includes("/page=join_WA?nation=")) {
        let c = document.getElementById("content") ? document.getElementById("content") : document.getElementById("main");
        let b = c.querySelector('button[type="submit"]');
        b.click();
    }
    // Apply or leave
    else {
        openFrame("https://www.nationstates.net/template-overall=none/page=un", function(frame) {
            let action = frame.getElementsByName("action")[0].value;
            let chk = frame.getElementsByName("chk")[0].value;
            
            let target = "https://www.nationstates.net/page=UN_status"
            let content = "action=" + action + "&chk=" + chk + "&submit=1";

            // Apply / leave
            nsPostRequest(target, content, (xhr) => {
                // Success
                if (action.includes("leave")) window.location.href = url; // Refresh on leaving the WA, otherwise NS and users could get confused

                // Tell user they have applied
                else notify((action.includes("join") ? "Applied to join" : "Resigned from") + " the World Assembly", "LightBlue");

                // Warn about email in use for WA
                let warning = xhr.responseXML.getElementsByClassName("error")[0];
                if (warning) notify("Your email address " + warning.getElementsByTagName("b")[0].innerText + " is currently registered to another WA member nation.", "Yellow");
            }, (xhr) => {
                // Failure
                notify("Failed to " + (action.includes("join") ? "join" : "resign from") + " the World Assembly", "Yellow");
            });
        });
    }
}

/**
 * Navigate to the WA Delegate (show region, then delegate)
 */
async function waDelegate() {
    "use strict";
    let region = getRegion();
    if (!region) return;

    let response = await nsApiRequest("https://www.nationstates.net/cgi-bin/api.cgi?region=" + region + "&q=delegate");    
    let nation = response.substring(response.indexOf("<DELEGATE>") + 10, response.indexOf("</DELEGATE>"));
    
    if (nation === "0") {
        notify("The region you're in doesn't have a WA Delegate", "Yellow");
    }
    else {
        window.location.href = "https://www.nationstates.net/nation=" + nation;
    }
}

/**
 * Toggle styling on or off
 */
function styling() {
    "use strict";
    if (url.includes("/template-overall=none/region=")) {
        window.location.href = "https://www.nationstates.net/region=" + url.split("/region=")[1];
    }
    else if (url.includes("/template-overall=none/nation=")) {
        window.location.href = "https://www.nationstates.net/nation=" + url.split("/nation=")[1];
    }
    else if (url.includes("/region=")) {
        let rr = getRegion();
        if (rr) {
            window.location.href = "https://www.nationstates.net/template-overall=none/region=" + rr;
        }
    }
    else if (url.includes("/nation=")) {
        window.location.href = "https://www.nationstates.net/template-overall=none/nation=" + url.split("=")[1];
    }
}

/**
 * Zombie Control
 */
function zombieControl() {
    "use strict";
    window.location.href = "https://www.nationstates.net/page=zombie_control";
}