// =====================================================================================================================
// This section of the background script keeps track of previous and next pages in relation to the current page. The 
// purpose of this is to get the latest previous/next page instead of getting it from cache, otherwise shortcuts don't 
// work and information might be out of date.

let prevPages = [];
let nextPages = [];
let usedPrev = false;

// Store pages in history
chrome.runtime.onMessage.addListener(function (request) {
    "use strict";
    if (request.action !== "store") return;

    // User is on a new page (not a reload)
    if (usedPrev === false && (prevPages.length === 0 || prevPages[prevPages.length - 1] !== request.url)) {
        // Store the current page in the list and remove the oldest page in the list
        // List should be 11 entries (current + 10 in history)
        prevPages.push(request.url);
        if (prevPages.length > 11) {
            prevPages.splice(0, 1);
        }
    // User navigated back previously, just reset bool
    } else if (usedPrev === true) {
        usedPrev = false;
    }
});

// Go to the previous page, if any
chrome.runtime.onMessage.addListener(function (request) {
    "use strict";
    if (request.action !== "previous") return;

    if (prevPages.length > 1) {
        nextPages.push(request.url);
        // Remove the oldest page in the list if the list grows longer than 10 entries
        if (nextPages.length > 10) nextPages.splice(0, 1);
        // The page to load is the last page in previous pages (length - 2 to skip current page)
        let pageToLoad = prevPages[prevPages.length - 2];
        // Remove the page to load from the previous pages
        prevPages.splice(prevPages.length - 1, 1);
        // Set this to true so the to-be-loaded page isn't immediately stored back into prevpages
        usedPrev = true;
        contentSend({action: "previous", url: pageToLoad});
    }
});

// Go to the next page (if any) and remove from nextPages
chrome.runtime.onMessage.addListener(function (request) {
    "use strict";
    if (request.action !== "next") return;

    if (nextPages.length > 0) {
        let pageToLoad = nextPages[nextPages.length - 1];
        nextPages.splice(nextPages.length - 1, 1);
        contentSend({action: "next", url: pageToLoad});
    }
});


// =====================================================================================================================
// This section of the background script keeps track of the state of cross endorsing for the content script. The purpose 
// of this is to make sure it satisfies rate limits and is aware of who was endorsed across page reloads.

let canCross = true;
let userAgent = undefined;
let user = undefined;
let point = undefined;
let endorsed = [];
let endorsees = [];
let check = 0;
let workerDone = false;

// Cross (if allowed by timer)
chrome.runtime.onMessage.addListener(function (request) {
    "use strict";
    if (request.action !== "cross" || !canCross) return;

    // New point and endorsees
    // Keep list of endorsed intact in case point is being switched
    if (request.point !== point || request.user !== user) {
        workerDone = false;
        user = request.user;
        userAgent = "Application: Storm " + "v" + chrome.runtime.getManifest().version + " (https://github.com/Krypton-Nova/Storm); User: " + user; 
        point = request.point;
        // In case point isn't endorsed yet
        endorsees = [point];
        endorsees.push(...request.endorsees);
        // You don't need to endorse yourself
        endorsed.push(user);
        // (async) checks each endorsee to see if user has endorsed it
        endorsedWorker();

    // If same point, just add new endorsees
    } else {
        let newEndorsees = request.endorsees.filter(e => !endorsees.includes(e));
        endorsees.push(...newEndorsees);        // ...Iterable expands it, see spread operator
        if (workerDone) endorsedWorker();
    }
    
    let next = endorsees.filter(e => !endorsed.includes(e))[0];
    contentSend({action: "cross", endorsee: next, pin: request.pin});

});

// Add a nation to the list of endorsed nations
chrome.runtime.onMessage.addListener(function (request) {
    "use strict";
    if (request.action !== "endorse") return;
    endorsed.push(request.nation);
    contentSend({action: "endorsedUpdate", endorsee: request.nation});

    // Set a cooldown timer of 6 seconds if a frame request was made to comply with script rules
    if (request.usedFrame) {
        canCross = false;
        setTimeout(function () {
            canCross = true;
        }, 6000);
    }
});

// Return list of endorsed nations
chrome.runtime.onMessage.addListener(function (request) {
    "use strict";
    if (request.action !== "endorsed") return;
    contentSend({action: "endorsed", endorsed: endorsed});
});

/**
 * Checks each endorsee sequentially to see if the user has endorsed it
 */
function endorsedWorker() {
    "use strict";

    workerDone = false;
    let startUser = user;
    let startPoint = point;

    // Timer runs every 700ms, which is within the API rate limit (30s / 50 requests = 0.6s).
    let timer = setInterval(() => {
        // While user and point haven't changed, and there are endorsees left to check
        if (startUser !== user || startPoint !== point || check === endorsees.length) {
            clearInterval(timer);
            workerDone = true;
            check = 0;
            return;
        }

        let endorsee = endorsees[check++];
            
        // Get who endorsed this endorsee
        nsApiRequest("https://www.nationstates.net/cgi-bin/api.cgi?nation=" + endorsee + "&q=endorsements", userAgent, (text) => {
            let crossEndos = text.substring(text.indexOf("<ENDORSEMENTS>") + 14, text.indexOf("</ENDORSEMENTS>")).split(",");

            // Add to endorsed if user crossed this endorsee
            if (crossEndos.includes(user)) {
                endorsed.push(endorsee);
                contentSend({action: "endorsedUpdate", endorsee: endorsee});
            }
        });
    }, 700);
}


// =====================================================================================================================
// Get NS cookies, to be used to send POST requests and determine the currently logged in nation.
// This is perhaps useful for future reference, but is currently not used. Requires "cookies" permission in manifest.json.
// Don't use unless absolutely necessary.

chrome.runtime.onMessage.addListener(function (request) {
    "use strict";
    if (request.action !== "cookies") return;

    // Names of the cookies to gather
    let names = ["__cfduid", "telegrams", "autologin", "pin"];

    // Send cookies to content script
    chrome.cookies.getAll({}, function(cookies) {
        cookies = cookies.filter(c => names.includes(c.name));
        contentSend({action: "cookies", cookies: cookies});
    }); 
});


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
// Utility functions

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
