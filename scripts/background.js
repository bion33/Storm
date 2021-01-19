// =====================================================================================================================
// This section of the background script keeps track of previous and next pages in relation to the current page. The 
// purpose of this is to get the latest previous/next page instead of getting it from cache, otherwise shortcuts don't 
// work and information might be out of date.

let prevPages = [];
let nextPages = [];
let usedPrev = false;

// Store the last two pages and the current page, or, the previous page, current page and the next page.
chrome.runtime.onMessage.addListener(function (request) {
    "use strict";

    // User is on a new page (not a reload)
    if (request.action === "store" && usedPrev === false && (prevPages.length === 0 || prevPages[prevPages.length - 1] !== request.url)) {
        // Store the current page in the list and remove the oldest page in the list
        // List should be 11 entries (current + 10 in history)
        prevPages.push(request.url);
        if (prevPages.length > 11) {
            prevPages.splice(0, 1);
        }

    // User navigated back previously, just reset bool
    } else if (usedPrev === true) {
        usedPrev = false;

    // Go to the previous page, if any
    } else if (request.action === "previous" && prevPages.length > 1) {
        nextPages.push(request.url);
        // Remove the oldest page in the list if the list grows longer than 10 entries
        if (nextPages.length > 10) nextPages.splice(0, 1);
        // The page to load is the last page in previous pages (length - 2 to skip current page)
        let pageToLoad = prevPages[prevPages.length - 2];
        // Remove the page to load from the previous pages
        prevPages.splice(prevPages.length - 1, 1);
        // Set this to true so the to-be-loaded page isn't immediately stored back into prevpages
        usedPrev = true;
        contentSend({type: "background", url: pageToLoad});

    // Go to the next page (if any) and remove from nextPages
    } else if (request.action === "next" && nextPages.length > 0) {
        let pageToLoad = nextPages[nextPages.length - 1];
        nextPages.splice(nextPages.length - 1, 1);
        contentSend({type: "background", url: pageToLoad});
    }
});


// =====================================================================================================================
// This section of the background script keeps track of [C] being pressed for the content script. The purpose of this is 
// to make sure [C], which can open a maximum of 10 tabs, is not pressed more than once a minute. This is to satisfy the 
// script rate limits for NationStates.

let didCross = false;

chrome.runtime.onMessage.addListener(function (request) {
    "use strict";

    // If a cross request is received and the user did not cross in the last minute, the user can cross
    if (request.cancross === "?" && didCross === false) {
        contentSend({type: "background", cancross: true});

        // Cross timeout of 60 seconds
        didCross = true;
        setTimeout(function () {
            didCross = false;
        }, 60000);

    // If a cross request is received and the user did cross in the last minute, the user can't cross
    } else if (request.cancross === "?" && didCross === true) {
        contentSend({type: "background", cancross: false});
    }
});


// =====================================================================================================================
// Get NS cookies, to be used to send POST requests and determine the currently logged in nation.
// This is perhaps useful for future reference, but is currently not used. Requires "cookies" permission in manifest.json.
// Don't use unless absolutely necessary.

chrome.runtime.onMessage.addListener(function (request) {
    if (request.action !== "cookies") return;

    // Names of the cookies to gather
    let names = ["__cfduid", "telegrams", "autologin", "pin"];

    // Send cookies to content script
    chrome.cookies.getAll({}, function(cookies) {
        cookies = cookies.filter(c => names.includes(c.name));
        contentSend({type: "background", cookies: cookies});
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
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, parameters);
    });
}