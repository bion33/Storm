// =====================================================================================================================
// Initialise listeners

chrome.runtime.onMessage.addListener(store);
chrome.runtime.onMessage.addListener(previous);
chrome.runtime.onMessage.addListener(next);
chrome.runtime.onMessage.addListener(cross);
chrome.runtime.onMessage.addListener(endorse);
chrome.runtime.onMessage.addListener(getAllEndorsed);
chrome.runtime.onMessage.addListener(getNSCookies);

// =====================================================================================================================
// This section of the background script keeps track of previous and next pages in relation to the current page. The 
// purpose of this is to get the latest previous/next page instead of getting it from cache, otherwise shortcuts don't 
// work and information might be out of date.

// Store pages in history
async function store(request) {
    "use strict";

    if (request.action !== "store") return;

    let state = await PersistentState.load();

    // User is on a new page (not a reload)
    if (state.usedPrev === false && (state.prevPages.length === 0 || state.prevPages[state.prevPages.length - 1] !== request.url)) {
        // Store the current page in the list and remove the oldest page in the list
        // List should be 11 entries (current + 10 in history)
        state.prevPages.push(request.url);
        if (state.prevPages.length > 11) {
            state.prevPages.splice(0, 1);
        }
    // User navigated back previously, just reset bool
    } else if (state.usedPrev === true) {
        state.usedPrev = false;
    }

    state.save();
}

// Go to the previous page, if any
async function previous(request) {
    "use strict";

    let state = await PersistentState.load();

    if (request.action !== "previous" || state.prevPages.length < 2) return;

    state.nextPages.push(request.url);
    
    // Remove the oldest page in the list if the list grows longer than 10 entries
    if (state.nextPages.length > 10) state.nextPages.splice(0, 1);
    
    // The page to load is the last page in previous pages (length - 2 to skip current page)
    let pageToLoad = state.prevPages[state.prevPages.length - 2];
    
    // Remove the page to load from the previous pages
    state.prevPages.splice(state.prevPages.length - 1, 1);

    // Set this to true so the to-be-loaded page isn't immediately stored back into prevpages
    state.usedPrev = true;
    state.save();

    contentSend({action: "previous", url: pageToLoad});
}

// Go to the next page (if any) and remove from nextPages
async function next(request) {
    "use strict";

    let state = await PersistentState.load();

    if (request.action !== "next" || state.nextPages.length < 1) return;

    let pageToLoad = state.nextPages[state.nextPages.length - 1];
    state.nextPages.splice(state.nextPages.length - 1, 1);

    state.save();

    contentSend({action: "next", url: pageToLoad});
}

// =====================================================================================================================
// This section of the background script keeps track of the state of cross endorsing for the content script. The purpose 
// of this is to make sure it satisfies rate limits and is aware of who was endorsed across page reloads.

// Cross (if allowed by timer)
async function cross(request) {
    "use strict";

    let state = await PersistentState.load();

    if (request.action !== "cross" || !state.canCross) return;

    // New point and endorsees
    // Keep list of endorsed intact in case point is being switched
    if (request.point !== state.point || request.user !== state.user) {
        state.workerDone = false;
        state.user = request.user;
        state.userAgent = "Application: Storm v" + chrome.runtime.getManifest().version + " (https://github.com/Krypton-Nova/Storm); User: " + state.user; 
        state.point = request.point;
        // In case point isn't endorsed yet
        state.endorsees = [state.point];
        state.endorsees.push(...request.endorsees); // ...Iterable expands it, see spread operator
        // You don't need to endorse yourself
        state.endorsed.push(state.user);
        // (async) checks each endorsee to see if user has endorsed it
        endorsedWorker();

    // If same point, just add new endorsees
    } else {
        let newEndorsees = request.endorsees.filter(e => !state.endorsees.includes(e));
        state.endorsees.push(...newEndorsees);
        if (state.workerDone) endorsedWorker();
    }
    
    let next = state.endorsees.filter(e => !state.endorsed.includes(e))[0];
    contentSend({action: "cross", endorsee: next, pin: request.pin});

    state.save();
}

// Add a nation to the list of endorsed nations
async function endorse(request) {
    "use strict";

    if (request.action !== "endorse") return;
    
    let state = await PersistentState.load();

    state.endorsed.push(request.nation);
    contentSend({action: "endorsedUpdate", endorsee: request.nation});
    
    // Set a cooldown timer of 6 seconds if a frame request was made to comply with script rules (this is a non-API script action, which has a limit of 6s / request)
    // Be careful with timeouts, chrome manifest v3 extensions terminate after 30 seconds regardless of how long your timeouts take!
    if (request.usedFrame) {
        state.canCross = false;
        setTimeout(function () {
            state.canCross = true;
            state.save();
        }, 6000);
    }

    state.save();
}

// Return list of endorsed nations
async function getAllEndorsed(request) {
    "use strict";

    if (request.action !== "endorsed") return;
    
    let state = await PersistentState.load();
    contentSend({action: "endorsed", endorsed: state.endorsed});
}

/**
 * Checks each endorsee sequentially to see if the user has endorsed it
 */
async function endorsedWorker() {
    "use strict";

    let state = await PersistentState.load();

    state.workerDone = false;
    state.save();

    let startUser = state.user;
    let startPoint = state.point;

    // Timer runs every 700ms, which is within the API rate limit (30s / 50 requests = 0.6s).
    // Be careful with intervals, chrome manifest v3 extensions terminate after 30 seconds regardless of how long your timeouts take!
    // Luckily chrome.storage.local.* (through using PersistentState) will reset this timeout... 
    let timer = setInterval(async () => {
        state = await PersistentState.load();

        // While user and point haven't changed, and there are endorsees left to check
        if (startUser !== state.user || startPoint !== state.point || check === state.endorsees.length) {
            clearInterval(timer);
            state.workerDone = true;
            state.check = 0;
            state.save();
            return;
        }

        let endorsee = state.endorsees[check++];
            
        // Get who endorsed this endorsee
        nsApiRequest("https://www.nationstates.net/cgi-bin/api.cgi?nation=" + endorsee + "&q=endorsements", state.userAgent, (text) => {
            let crossEndos = text.substring(text.indexOf("<ENDORSEMENTS>") + 14, text.indexOf("</ENDORSEMENTS>")).split(",");

            // Add to endorsed if user crossed this endorsee
            if (crossEndos.includes(state.user)) {
                state.endorsed.push(endorsee);
                contentSend({action: "endorsedUpdate", endorsee: endorsee});
            }
        });

        state.save();
    }, 700);
}


// =====================================================================================================================
// Get NS cookies, to be used to send POST requests and determine the currently logged in nation.
// This is perhaps useful for future reference, but is currently not used. Requires "cookies" permission in manifest.json.
// Don't use unless absolutely necessary.

function getNSCookies(request) {
    "use strict";
    if (request.action !== "cookies") return;

    // Names of the cookies to gather
    let names = ["__cfduid", "telegrams", "autologin", "pin"];

    // Send cookies to content script
    chrome.cookies.getAll({}, function(cookies) {
        cookies = cookies.filter(c => names.includes(c.name));
        contentSend({action: "cookies", cookies: cookies});
    }); 
}


// =====================================================================================================================
// Communication with content.js

/**
 * Request something from content.js
 * @param {Object} parameters of the request to content.js (what it needs to process this request)
 * @param {Function} then after the request has completed execute the given action with the return value from content.js
 */
function contentRequest(parameters, then) {
    "use strict";
    parameters.type = "background";
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, parameters, function (value) {
            then(value);
        });
    });
}

/**
 * Send something to content.js
 * @param {Object} parameters of the message to content.js (what it needs to process this message)
 */
function contentSend(parameters) {
    "use strict";
    parameters.type = "background";
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, parameters);
    });
}


// =====================================================================================================================
// Utility stuff

/**
 * Persistent state object for storing stuff used across event handlers.
 * Never rely on state being the same across different event handlers and functions, instead use this for state.
 */
class PersistentState {
    
    constructor(state = undefined) {
        this.prevPages = state.prevPages ?? [];
        this.nextPages = state.nextPages ?? [];
        this.usedPrev = state.usedPrev ?? false;
        this.canCross = state.canCross ?? true;
        this.userAgent = state.userAgent ?? undefined;
        this.user = state.user ?? undefined;
        this.point = state.point ?? undefined;
        this.endorsed = state.endorsed ?? [];
        this.endorsees = state.endorsees ?? [];
        this.check = state.check ?? 0;
        this.workerDone = state.workerDone ?? false;
    }

    /**
     * Asynchronously load the persistent state from local storage 
     * @returns {Promise<PersistentState>} the persistent state
     */
    static async load() {
        let state = await chrome.storage.local.get(['PersistentState'])
        return new PersistentState(state.PersistentState);
    }

    /**
     * Save this persistent state to local storage
     */
    save() {
        chrome.storage.local.set({'PersistentState': this});
    }
}

/**
 * Request something from the NationStates API
 * If this is to be used frequently, it needs a mechanism to impose the rate limit
 * Currently only used by "endorsedWorker" which rate-limits itself
 * @param {string} url API url
 * @param {string} userAgent to identify scrip to NS
 * @param {Function} then execute callback
 */
function nsApiRequest(url, userAgent, then) {
    "use strict";
    let headers = new Headers({"User-Agent": userAgent});
    fetch(url, {headers: headers})
        .then(response => response.text())
        .then(text => then(text));
}

update();
/**
 * Check for updates and show user an interactive notification if one is available.
 */
function update() {
    // Read latest Storm version
    fetch("https://api.github.com/repos/Krypton-Nova/Storm/releases")
        .then(response => response.json())
        .then(releases => {
            let latestVersion = "v" + releases[0].name;
            let url = releases[0].html_url

            // Get current version
            let currentVersion = "v" + chrome.runtime.getManifest().version;

            // Show latest if out of date
            if (latestVersion !== currentVersion) {
                chrome.notifications.create({
                    type: "basic",
                    title: "Storm update",
                    message: "Version " + latestVersion + " was released. Click to go to release page.",
                    iconUrl: chrome.runtime.getURL("ext-resources/icon.png")
                });
                chrome.notifications.onClicked.addListener(function () {
                    chrome.tabs.create({"url": url});
                });
            }
        });
}
