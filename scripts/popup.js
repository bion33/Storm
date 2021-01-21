// Namespace
/** @namespace chrome.tabs **/


// =====================================================================================================================
// Init

let jumpPointList = document.getElementById("jump-points");
let deleteJPButton = document.getElementById("delete-jp");
let saveOfficerButton = document.getElementById("save-officer");
let scrollCheckBox = document.getElementById("scroll");
let directMoveBox = document.getElementById("direct-move");
let keyInputs = document.getElementsByClassName("key-input");


// =====================================================================================================================
// Fill popup with current settings & shortcuts

document.addEventListener("DOMContentLoaded", function() {
    "use strict";
    
    // Latest version
    latestVersion();

    // Fill jump points
    updatejumpPointList();

    // Fill officer role
    contentRequest({type: "getRole"}, function (role) {
        let roleInput = document.getElementById("officer-role");
        roleInput.placeholder = role;
    });

    // Set autoscroll checkbox
    contentRequest({type: "getScroll"}, function (state) {
        scrollCheckBox.checked = state;
    });
    
    // Set direct move checkbox
    contentRequest({type: "getDirectMove"}, function (state) {
        directMoveBox.checked = state;
    });

    // Fill shortcuts
    Array.from(keyInputs).forEach(function (keyInput) {
        contentRequest({type: "getKey", data: keyInput.id}, function (value) {
            keyInput.value = value.split("=")[1];
            
            // Update the jump point selection list's tooltip to point to the correct shortcut for adding and using jump points.
            if (keyInput.id == "KeyJP") {
                let toolTip = document.getElementById("JPKey").getAttribute("title").replace(/JPKey/g, keyInput.value);
                document.getElementById("JPKey").setAttribute("title", toolTip);
            }
        });
    });

});

/**
 * Display the latest version if out of date
 */
async function latestVersion() {
    "use strict";

    // Read latest Storm version
    let response = await fetch("https://api.github.com/repos/Krypton-Nova/Storm/releases");
    let releases = await response.json();
    let latestVersion = "v" + releases[0].name;
    let url = releases[0].html_url
    
    // Get current version
    let versionField = document.getElementsByClassName("version")[0];
    let currentVersion = versionField.innerText;

    // Show if out of date
    if (latestVersion !== currentVersion) {
        versionField.innerText += " (latest: ";

        let a = document.createElement("a");
        a.href = url;
        a.innerText = latestVersion;
        versionField.appendChild(a);

        versionField.innerHTML += ")";
    }
}

/**
 * Fill list with jump points
 */
function updatejumpPointList() {
    "use strict";

    contentRequest({type: "getJumpPoints"}, function (jps) {

        jps = jps.split(",");
        jumpPointList.childNodes.forEach(function (item) {
            jumpPointList.removeChild(item);
        });
        jps.forEach(function (item) {
            let jpOption = document.createElement("option");
            jpOption.value = item.toString();
            jpOption.innerText = item.replace("https://www.nationstates.net/region=", "")
                .replace(/_/g, " ")
                .split(" ")
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1)) // Capitalise the first letter of each word
                .join(" ");
            jumpPointList.appendChild(jpOption);
        });

    });
}


// =====================================================================================================================
// Setting event listeners

// Change jump point
jumpPointList.addEventListener("change", function () {
    "use strict";
    let jp = document.getElementById("jump-points").value;
    contentSend({type: "setJumpPoint", data: jp});
});

// Delete jump point
deleteJPButton.addEventListener("click", function () {
    "use strict";
    let jpSelect = document.getElementById("jump-points");
    let jp = jpSelect.value;
    jpSelect.childNodes.forEach(function (item) {
        if (item.value === jp) {
            jpSelect.removeChild(item);
        }
    });
    contentSend({type: "deleteJumpPoint", data: jp});
});

// Save new officer role
saveOfficerButton.addEventListener("click", function () {
    "use strict";
    let role = document.getElementById("officer-role").value;
    contentSend({type: "setRole", data: role});
});

// Update autoscroll
scrollCheckBox.addEventListener("click", function () {
    "use strict";
    contentSend({type: "setScroll", data: scrollCheckBox.checked});
});

// Update direct move
directMoveBox.addEventListener("click", function () {
    "use strict";
    contentSend({type: "setDirectMove", data: directMoveBox.checked});
});


// =====================================================================================================================
// Shortcut event listeners

Array.from(keyInputs).forEach(function (keyInput) {
    "use strict";

    // When a key is to be changed
    keyInput.addEventListener("click", function () {
        // Helpful message
        keyInput.value = "Press a key";

        // Don't let the key do its thing, but do nothing else until keyup
        keyInput.addEventListener("keydown", function (e) {
            e.preventDefault();
        });

        // User is committed
        keyInput.addEventListener("keyup", function (e) {
            // Don't let the key do its thing
            e.preventDefault();

            // Default: description = key
            let d = e.key
            // Special descriptions
            if (d === " ") d = "Spacebar";
            if (d === "" || d === "Unidentified") d = "Unknown";
            if (e.location === 3 && !Number.isNaN(d) && 0 <= parseInt(d) && parseInt(d) <= 9) d = "NP " + d;    // To distinguish numpad numbers from top-row numbers
            
            // Update key if not duplicate
            contentRequest({type: "setKey", data: keyInput.id + "=" + e.key + "=" + d}, function (valid) {
                keyInput.value = valid ? d : "Duplicate!";
            });

        });
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
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, parameters);
    });
}