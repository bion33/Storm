// This should use modules instead of being so damn long, but browser extensions don't support them yet (2021-01-18)
// See: https://stackoverflow.com/questions/48104433/how-to-import-es6-modules-in-content-script-for-chrome-extension
// That's why this file is separated into several big chunks.

// =====================================================================================================================
// Classes
// (Declaring these here prevents ReferenceError: can't access lexical declaration 'x' before initialization)

/**
 * Maps keyCodes to an action
 */
class KeyboardShortcut {
    /**
     * Create a new KeyboardShortcut for the given keyCodes with the given action
     * @param {number} keyCodes JavaScript KeyboardEvent keyCode
     * @param {Function} action The Function to execute when any keyCode in keyCodes is hit
     */
    constructor(keyCodes, action) {
        this.keyCodes = [];
        for (let i = 0; i < keyCodes.length; i++) {
            this.keyCodes.push(Number.parseInt(keyCodes[i]));
        }
        this.action = action;
    }

    /**
     * Run the shortcut's action if the keycode matches any of this KeyboardShortcuts' keyCodes
     * @param {number} keyCode 
     */
    run_if_for(keyCode) {
        if (this.keyCodes.includes(keyCode)) this.action();
    }
}


// =====================================================================================================================
// Init

// Namespace
/** @namespace chrome.runtime **/
/** @namespace chrome.runtime.onMessage **/

// URL
let url = window.location.href;

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
let keyInKeys = false;
let JumpPoint = localStorage.JumpPoints.split(",")[0];
let keys = [];
let shortcuts = defineShortcuts();

// Fill list of keyboard shortcuts ("keys") with those found in localStorage
Object.keys(localStorage).forEach(function (key) {
    "use strict";
    let value = Number.parseInt(localStorage[key]);
    if (key.startsWith("Key") && !Number.isNaN(value)) {
        keys.push(value);
    }
});


// =====================================================================================================================
// Popup.js event resolution

// noinspection JSLint (surpress message for "sender" not being used, as sender is important),JSDeprecatedSymbols
chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
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
            case "getKeys":
                sendResponse(keys);
                break;
            case "getKey":
                sendResponse(localStorage[message.data]);
                break;
            case "setKey":
                setKey(message.data);
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
        if (!preKeyChecks(e)) {
            return;
        }

        shortcuts.forEach(key => {
            key.run_if_for(e.keyCode);
        });
    });
});


// =====================================================================================================================
// When page is fully loaded

window.addEventListener("load", function () {
    "use strict";

    scrollToBottom();
    linkifyAjax();
    displayLoadTime();

});


// =====================================================================================================================
// Defaults

/**
 * Set localStorage keys to their default values
 **/
function setDefaults() {
    "use strict";

    // Default Settings
    setDefault("Role", "Officer");
    setDefault("Scroll", false);
    setDefault("JumpPoints", "https://www.nationstates.net/region=artificial_solar_system");

    // Default keybinds
    setDefaultKey("KeyReports", 32, "Spacebar");
    setDefaultKey("KeyBack2", 8, "Backspace");
    setDefaultKey("KeyRefresh1", 116, "F5");
    setDefaultKey("KeyCopyUrl", 117, "F6");
    setDefaultKey("KeyBack1", 118, "F7");
    setDefaultKey("KeyForward", 119, "F8");
    setDefaultKey("KeyDosL1", 49, "1");
    setDefaultKey("KeyDosL2", 50, "2");
    setDefaultKey("KeyDosL3", 51, "3");
    setDefaultKey("KeyDosL4", 52, "4");
    setDefaultKey("KeyDosL5", 53, "5");
    setDefaultKey("KeyDosR1", 97, "NP 1");
    setDefaultKey("KeyDosR2", 98, "NP 2");
    setDefaultKey("KeyDosR3", 99, "NP 3");
    setDefaultKey("KeyDosR4", 100, "NP 4");
    setDefaultKey("KeyDosR5", 101, "NP 5");
    setDefaultKey("KeyActivity", 65, "a");
    setDefaultKey("KeyBan", 66, "b");
    setDefaultKey("KeyCross", 67, "c");
    setDefaultKey("KeyDoss", 68, "d");
    setDefaultKey("KeyEndo", 69, "e");
    setDefaultKey("KeyGcrHap", 71, "g");
    setDefaultKey("KeyRegHap", 72, "h");
    setDefaultKey("KeyWAJL1", 74, "j");
    setDefaultKey("KeyRefresh2", 75, "k");
    setDefaultKey("KeyWAJL2", 76, "l");
    setDefaultKey("KeyMove", 77, "m");
    setDefaultKey("KeyNation", 78, "n");
    setDefaultKey("KeyOfficer", 79, "o");
    setDefaultKey("KeyJP", 80, "p");
    setDefaultKey("KeyRegion", 82, "r");
    setDefaultKey("KeySwitch", 83, "s");
    setDefaultKey("KeyTemplate", 84, "t");
    setDefaultKey("KeyUpdate", 85, "u");
    setDefaultKey("KeyWAD", 87, "w");
    setDefaultKey("KeyClearDoss", 88, "x");
    setDefaultKey("KeyZombie", 90, "z");

}

/**
 * Assign the given value to the given key in localStorage
 * @param {String} storageKey
 * @param {any} value
 **/
function setDefault(storageKey, value) {
    "use strict";

	if (!(storageKey in localStorage)) {
    	localStorage[storageKey] = value;
	}
}

/**
 * Assign the given keyboard key-code and key-value to the given key in localStorage
 * @param {string} storageKey localStorage key
 * @param {number} keyCode JavaScript KeyboardEvent keyCode
 * @param {string} keyValue JavaScript KeyboardEvent key, or a name for the given keyCode
 **/
function setDefaultKey(storageKey, keyCode, keyValue) {
    "use strict";

    setDefault(storageKey, keyCode + "=" + keyValue);
}


// =====================================================================================================================
// Settings Management

function getJumpPoint() {
    "use strict";
    return localStorage.JumpPoints.split(",")[0];
}

function setJumpPoint(jp) {
    "use strict";
    let jps = jp + "," + localStorage.JumpPoints;
    jps = jps.split(",").filter(function (item, pos, self) {
        return self.indexOf(item) === pos;
    });
    localStorage.JumpPoints = jps.join(",");
    return getJumpPoint();
}

function deleteJumpPoint(jp) {
    "use strict";
    let jps = localStorage.JumpPoints.split(",");
    let jps_new = "";
    jps.forEach(function (item, index) {
        if (jp === item) {
            jps_new = jps.splice(index, 1);
        }
    });
    localStorage.JumpPoints = jps_new.join(",");
    return getJumpPoint();
}

function setKey(data) {
    "use strict";
    let k = data.split("=", 1);
    let v = data.substring(data.indexOf("=") + 1);
    let oldValue = Number.parseInt(localStorage[k]);
    if (keys.includes(Number.parseInt(v))) {
        return false;
    }
    keys[keys.findIndex(x => x === oldValue)] = Number.parseInt(v);
    localStorage[k] = v;
    return true;
}


// =====================================================================================================================
// NationStates

function getRegion() {
    "use strict";
    if (url.includes("page=reports") || url.includes("page=ajax2")) {
        return undefined;
    }
    let y = Array.from(document.links).find(function (l) {
        if (l.href.includes("region=")) {
            return true;
        }
    });
    return y.href.split("region=")[1];
}

function openRegion() {
    "use strict";
    let r = getRegion();
    if (r) {
        window.location.replace("https://nationstates.net/region=" + r);
    }
}

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
 * @param lr: left(=0) or right(=1) of happening
 * @param n: on the nth line (0 being the 1st line)
 **/
function openNation(lr, n) {
    "use strict";
    // If on reports or activity page
    if (url.includes("page=reports") || url.includes("page=ajax2")) {
        let a = document.getElementsByTagName("LI")[n].getElementsByTagName("A")[lr];
        a.click();
        a.style.backgroundColor = "yellow";
    } else {
        document.getElementsByClassName("button").namedItem("action").click();  // Doss
    }
}


// =====================================================================================================================
// Webpage

/**
 * Show the given message at the top of a NationStates page
 * @param {string} message
 **/
function notify(message) {
    "use strict";
    let m = document.createElement("div");
    m.id = "temp-msg";
    m.style.cssText = "background-color: yellow; padding: 7px 7px; font-size: 14;";
    m.innerText = message;
    let c = document.getElementById("content");
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


// =====================================================================================================================
// Keyboard Shortcuts

/**
 * Update modifiers (shifted, controlled, alternated), ensure user is not filling in a form, and prevent default browser behaviour if pressed key is a shortcut
 * @param {KeyboardEvent} e 
 */
function preKeyChecks(e) {
    "use strict";
    // Detect Shift, Control and Alt keys being pressed
    if (!shifted) {
        shifted = e.shiftKey;
    }
    if (!controlled) {
        controlled = e.ctrlKey;
    }
    if (!alternated) {
        alternated = e.altKey;
    }

    // Stop shortcut in these cases
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        return false;
    }
    if (url.includes("forum.nationstates.net")) {
        return false;
    }
    if (controlled || alternated || (shifted && e.keyCode !== Number.parseInt(localStorage.KeyJP))) {
        return false;
    }

    // Prevent default action if key active as shortcut
    if (!keyInKeys && keys.includes(e.keyCode)) {
        e.preventDefault();
        keyInKeys = true;
    } else if (keyInKeys) {
        e.preventDefault();
        keyInKeys = false;
    // Key not a shortcut
    } else {
        return false;
    }

    return true;
}

/**
 * Define which shortcut key(s) triggers what action
 */
function defineShortcuts() {
    "use strict";

    let t = new KeyboardShortcut([localStorage.KeyCopyUrl], pageCopyURL);

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
        new KeyboardShortcut([localStorage.KeyDosL1], function() { openNation(0, 0) }),
        new KeyboardShortcut([localStorage.KeyDosL2], function() { openNation(0, 1) }),
        new KeyboardShortcut([localStorage.KeyDosL3], function() { openNation(0, 2) }),
        new KeyboardShortcut([localStorage.KeyDosL4], function() { openNation(0, 3) }),
        new KeyboardShortcut([localStorage.KeyDosL5], function() { openNation(0, 4) }),
        new KeyboardShortcut([localStorage.KeyDosR1], function() { openNation(1, 0) }),
        new KeyboardShortcut([localStorage.KeyDosR2], function() { openNation(1, 1) }),
        new KeyboardShortcut([localStorage.KeyDosR3], function() { openNation(1, 2) }),
        new KeyboardShortcut([localStorage.KeyDosR4], function() { openNation(1, 3) }),
        new KeyboardShortcut([localStorage.KeyDosR5], function() { openNation(1, 4) }),
        
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
    document.getElementsByTagName("BODY")[0].appendChild(temp);
    temp.value = url;
    temp.select();
    document.execCommand("copy");
    // No need for cleanup, NS changes page often enough

    notify("Link copied!");
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
        window.location.href = load.url;
    });
}

/**
 * Refresh the current page
 */
function pageRefresh() {
    "use strict";

    // If on the reports page and it is reloaded, make the green page border red so the user knows they shouldn"t press refresh again.
    if (url === "https://www.nationstates.net/template-overall=none/page=reports") {
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

    if (url === "https://www.nationstates.net/page=activity/view=world") {
        window.location.href = "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo";
    } else if (url === "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo") {
        window.location.href = "https://www.nationstates.net/page=activity/view=world";
    } else {
        window.location.href = "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo";
    }
}

/**
 * Open the reports page, or open the ajax feed to spot (toggle)
 */
function activityReportSpot() {
    if (url === "https://www.nationstates.net/template-overall=none/page=reports") {
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
    window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=world/filter=change";
}

/**
 * Watch the activity page to spot (regional)
 */
function nation() {
    window.location.href = "https://www.nationstates.net";
}

/**
 * Prepare Switcher. This shortcut will open the WA page, apply, open your jump point, and move there.
 */
function nationSwitch() {
    if (!window.location.href.includes("page=un") && window.location.href !== JumpPoint) {
        window.location.href = "https://www.nationstates.net/template-overall=none/page=un";
    }
    if (window.location.href.includes("page=un")) {
        document.getElementById("main").getElementsByClassName("button").namedItem("submit").click();
    }
    if (window.location.href.includes("page=UN_status")) {
        window.location.href = JumpPoint;
    }
    if (window.location.href === JumpPoint) {
        moveToRegion();
    }
}

/**
 * Endorse the nation in view
 */
function nationEndorse() {
    if (document.getElementsByTagName("INPUT").namedItem("action").value === "endorse") {
        document.getElementsByClassName("endorse button")[0].click();
    }
}

/**
 * Cross endorse nations endorsing the nation in view
 */
function nationCross() {
    // Send message to background script that C has been pressed
    chrome.runtime.sendMessage({cancross: "?"});
    // Receive message.
    chrome.runtime.onMessage.addListener(function docross(reply) {
        // If the user hasn"t pressed the cross-endorse button 60 seconds ago or less, open the first 10 endorsers in separate tabs. This satisfies the limit of 10 requests/minute for scripts on NS.
        if (reply.cancross === true) {
            let cross = document.getElementsByClassName("unbox")[0].getElementsByClassName("nlink");
            Array.prototype.some.call(cross, function (a, index) {
                a.target = "_blank";
                a.click();
                return index >= 9;
            });
        }
        // Remove the listener, or it will keep listening if reply.cancross is not true. That would result in it opening the tabs to cross times the amount you pressed [C] while reply.cancross was not true.
        chrome.runtime.onMessage.removeListener(docross);
    });
}

/**
 * Banject the nation in view
 */
function nationBanject() {
    document.getElementsByTagName("BUTTON").namedItem("ban").click();
}

/**
 * Add nation/region to dossier
 */
function dossierAdd() {
    if (url.includes("region=")) {
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
    if (url === "https://www.nationstates.net/page=dossier") {
        document.getElementsByTagName("BUTTON").namedItem("clear_dossier").click();
    } else {
        window.location.href = "https://www.nationstates.net/page=dossier";
    }
}

/**
 * Shows the region you're in or refreshes its page. If in reports view, opens the 2nd region in the last change 
 * (so, if it includes "... moved from x to y" it will open region y).
 */
function region() {
    if (window.location.href.includes("/region=")) {
        window.location.reload();
    } else if (window.location.href.includes("page=reports") || window.location.href.includes("page=ajax2")) {
        let reg = document.getElementsByTagName("LI")[0].getElementsByClassName("rlink")[1];
        reg.click();
        reg.style.backgroundColor = "yellow";
    } else {
        openRegion();
    }
}

/**
 * Move to the region in view. If in reports view, opens the 2nd region in the last change (so, if it includes "... moved from x to y" it will open region y).
 */
function regionMove() {
    if (url === "https://www.nationstates.net/template-overall=none/page=reports") {
        let r = document.getElementsByTagName("LI")[0].getElementsByClassName("rlink")[1];
        r.click();
        r.style.backgroundColor = "yellow";
    } else {
        moveToRegion();
    }
}

/**
 * Open jump point. If opened, moves there. If shifted, adds and sets the region in view as jump point.
 */
function regionJumpPoint() {
    if (shifted) {
        if (url.includes("https://www.nationstates.net/region=")) {
            setJumpPoint(url);
            notify("JP Updated! -- This region has been saved to your Jump Points and set as your current one. You can change your active JP in the popup window.");
        }
    } else if (url === JumpPoint) {
        moveToRegion();
    } else {
        window.location.href = JumpPoint;
    }
}

/**
 * Dismisses other nations from being officer, opens own officer page, assigns officer role to own nation, and opens regional controls.
 */
function officer() {
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
    if (url === "https://www.nationstates.net/page=un") {
        document.getElementById("main").getElementsByClassName("button").namedItem("submit").click();
    } else {
        window.location.href = "https://www.nationstates.net/page=un";
    }
}

/**
 * Navigate to the WA Delegate (show region, then delegate)
 */
function waDelegate() {
    // On region"s page
    if (document.getElementById("content").getElementsByTagName("P")[0].textContent.includes("WA Delegate: None")) {
        notify("This region doesn't have a WA delegate.");
    } else if (url.includes("/region=")) {
        document.getElementsByClassName("nlink")[0].click();
    // The region in the sidebar updates too slow when you move regions, so this works better in that case.
    // Should work on the page you get when you just moved, but not on the page with the featured region.
    } else if (url.includes("/page=change_region") && document.getElementsByClassName("featuredregion").length === 0) {
        document.getElementsByClassName("info")[0].getElementsByTagName("A")[0].click();
    } else {
        openRegion();
    }
}

/**
 * Toggle styling on or off
 */
function styling() {
    if (window.location.href.includes("none/region")) {
        openRegion();
    }
    if (window.location.href.includes("none/nation")) {
        window.location.replace(document.getElementsByClassName("quietlink")[0].href);
    }
    if (window.location.href.includes("net/region")) {
        let rr = getRegion();
        if (rr) {
            window.location.replace("https://www.nationstates.net/template-overall=none/region=" + rr);
        }
    }
    if (window.location.href.includes("net/nation")) {
        let nation = document.getElementsByClassName("quietlink")[0].href.split("/nation=")[1];
        window.location.replace("https://www.nationstates.net/template-overall=none/nation=" + nation);
    }
}

/**
 * Zombie Control
 */
function zombieControl() {
    window.location.href = "https://www.nationstates.net/page=zombie_control";
}