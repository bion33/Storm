// This section of the background script keeps track of 4 previous and 4 next pages in relation to the current page.
// The purpose of this is to get the latest previous/next page instead of getting it from cache, 
// otherwise shortcuts don't work and information might be out of date.

var prevpages = [];
var nextpages = [];
var usedprev = false;

// Store the last two pages and the current page, or, the previous page, current page and the next page.
chrome.runtime.onMessage.addListener(function(page){
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
		// Get the active tab and send message to that tab
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {url: pagetoload});
		});
	}
	// Go to the next page, if any
	else if (page.action == "next" && nextpages.length > 0){
		// The page to load is the last page in next pages
		var pagetoload = nextpages[nextpages.length - 1];
		// Remove it from next pages (because it will be loaded and not be a next page any more)
		nextpages.splice(nextpages.length - 1, 1);
		// Get the active tab and send message to that tab
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {url: pagetoload});
		});
	}
});


// This section of the background script keeps track of [C] being pressed for the content script.
// The purpose of this is to make sure [C], which can open a maximum of 10 tabs, is not pressed more than once a minute.
// This is to satisfy the script rate limits for NationStates.

var didcross = false;

chrome.runtime.onMessage.addListener(function(request){
	// If a cross request is received and the user did not cross in the last minute
	if (request.cancross == "?" && didcross == false){
		// Get the active tab and tell it the user can cross
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {cancross: true});
		});
		// Cross timeout of 60 seconds
		didcross = true;
		setTimeout(function(){didcross = false;}, 60000);
	}
	// If a cross request is received and the user did cross in the last minute
	else if (request.cancross == "?" && didcross == true){
		// Get the active tab and tell it the user can't cross
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {cancross: false});
		});
	}
});


// Code to test functionality (add temporary "notifications" permission in manifest.json):
/*
chrome.notifications.create({
	"type": "basic",
	"title": "some title",
	"message": "some message"
});
*/
