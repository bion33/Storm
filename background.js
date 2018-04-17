// This background script keeps track of 4 previous and 4 next pages in relation to the current page.
// The purpose of this is to get the latest previous/next page instead of getting it from cache, 
// otherwise shortcuts don't work and information might be out of date.

var prevpages = [];
var nextpages = [];
var usedprev = false;

// Store the last two pages and the current page, or, the previous page, current page and the next page.
function pages(page){
	// This action means the user is on a new page, and didn't arrive here by going to the previous page
	if (page.action == "store" && usedprev == false){
		// Unless there is no last item or the current page was reloaded
		if (prevpages.length == 0 || prevpages[prevpages.length - 1] != page.url){
			// Store the current page in the list
			prevpages.push(page.url);
			// Remove the oldest page in the list if the list grows longer than 11 entries (note that the current page is the last entry, so it actually contains the 10 previous pages)
			if (prevpages.length > 11) prevpages.splice(0, 1);
		}
	}
	// We're on a new page now, reset prevpage to false
	else if (usedprev == true){
		usedprev = false;
	}
	// Go to the previous page, if any (length > 1 because the current page is the last entry)
	else if (page.action == "previous" && prevpages.length > 1){
		// Put the current page as the last entry in next pages
		nextpages.push(page.url);
		// Remove the oldest page in the list if the list grows longer than 10 entries
		if (nextpages.length > 10) nextpages.splice(0, 1);
		// The page to load is the last page in previous pages (length - 2 because the current page is the last entry)
		var pagetoload = prevpages[prevpages.length - 2];
		// Remove the page to load from the previous pages, as it will be our new current page
		prevpages.splice(prevpages.length - 1, 1);
		// Set this to true so the to-be-loaded page isn't immediately stored back into prevpages
		usedprev = true;
		// Get the active tab ID and send message to that tab
		function onGot(tabInfo) {
			var curtab = tabInfo.id;
			// Send page to load content.js
			browser.tabs.sendMessage(curtab, {url: pagetoload});
		}
		function getInfoForTab(tabs) {
			if (tabs.length > 0) {
				var gettingInfo = browser.tabs.get(tabs[0].id);
				gettingInfo.then(onGot);
			}
		}
		var querying = browser.tabs.query({currentWindow: true, active: true});
		querying.then(getInfoForTab);
	}
	// Go to the next page, if any
	else if (page.action == "next" && nextpages.length > 0){
		// The page to load is the last page in next pages
		var pagetoload = nextpages[nextpages.length - 1];
		// Remove it from next pages (because it will be loaded and not be a next page any more)
		nextpages.splice(nextpages.length - 1, 1);
		// Get the active tab ID and send message to that tab
		function onGot(tabInfo) {
			var curtab = tabInfo.id;
			// Send page to load content.js
			browser.tabs.sendMessage(curtab, {url: pagetoload});
		}
		function getInfoForTab(tabs) {
			if (tabs.length > 0) {
				var gettingInfo = browser.tabs.get(tabs[0].id);
				gettingInfo.then(onGot);
			}
		}
		var querying = browser.tabs.query({currentWindow: true, active: true});
		querying.then(getInfoForTab);
	}
}

// Listener
browser.runtime.onMessage.addListener(pages);

// Code to test functionality:
/*
browser.notifications.create({
	"type": "basic",
	"title": page.action,
	"message": "prevpages:\n" + prevpages.toString() + "\nnextpages:\n" + nextpages.toString()
});
*/
