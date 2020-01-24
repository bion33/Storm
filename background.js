// This section of the background script keeps track of 4 previous and 4 next pages in relation to the current page.
// The purpose of this is to get the latest previous/next page instead of getting it from cache,
// otherwise shortcuts don't work and information might be out of date.

let prevPages = [];
let nextPages = [];
let usedPrev = false;

// Store the last two pages and the current page, or, the previous page, current page and the next page.
chrome.runtime.onMessage.addListener(function (page) {
    "use strict";
    // This action means the user is on a new page, and didn't arrive here by going to the previous page
    if (page.action === "store" && usedPrev === false) {
        // Unless there is no last item or the current page was reloaded
        if (prevPages.length === 0 || prevPages[prevPages.length - 1] !== page.url) {
            // Store the current page in the list
            prevPages.push(page.url);
            // Remove the oldest page in the list if the list grows longer than 11 entries (note that the current page is the last entry, so it actually contains the 10 previous pages)
            if (prevPages.length > 11) {
                prevPages.splice(0, 1);
            }
        }
    // We're on a new page now, reset prevpage to false
    } else if (usedPrev === true) {
        usedPrev = false;
    // Go to the previous page, if any (length > 1 because the current page is the last entry)
    } else if (page.action === "previous" && prevPages.length > 1) {
        // Put the current page as the last entry in next pages
        nextPages.push(page.url);
        // Remove the oldest page in the list if the list grows longer than 10 entries
        if (nextPages.length > 10) {
            nextPages.splice(0, 1);
        }
        // The page to load is the last page in previous pages (length - 2 because the current page is the last entry)
        let pageToLoad = prevPages[prevPages.length - 2];
        // Remove the page to load from the previous pages, as it will be our new current page
        prevPages.splice(prevPages.length - 1, 1);
        // Set this to true so the to-be-loaded page isn't immediately stored back into prevpages
        usedPrev = true;
        // Get the active tab and send message to that tab
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {url: pageToLoad});
        });
    // Go to the next page, if any
    } else if (page.action === "next" && nextPages.length > 0) {
        // The page to load is the last page in next pages
        let pageToLoad1 = nextPages[nextPages.length - 1];
        // Remove it from next pages (because it will be loaded and not be a next page any more)
        nextPages.splice(nextPages.length - 1, 1);
        // Get the active tab and send message to that tab
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {url: pageToLoad1});
        });
    }
});


// This section of the background script keeps track of [C] being pressed for the content script.
// The purpose of this is to make sure [C], which can open a maximum of 10 tabs, is not pressed more than once a minute.
// This is to satisfy the script rate limits for NationStates.

let didCross = false;

chrome.runtime.onMessage.addListener(function (request) {
    "use strict";
    // If a cross request is received and the user did not cross in the last minute
    if (request.cancross === "?" && didCross === false) {
        // Get the active tab and tell it the user can cross
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {cancross: true});
        });
        // Cross timeout of 60 seconds
        didCross = true;
        setTimeout(function () {
            didCross = false;
        }, 60000);
    // If a cross request is received and the user did cross in the last minute
    } else if (request.cancross === "?" && didCross === true) {
        // Get the active tab and tell it the user can't cross
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {cancross: false});
        });
    }
});
