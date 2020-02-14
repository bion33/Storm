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
if (!("KeyReports" in localStorage)) {
    localStorage.KeyReports = "32=Spacebar";
}
if (!("KeyBack2" in localStorage)) {
    localStorage.KeyBack2 = "8=Backspace";
}
if (!("KeyRefresh1" in localStorage)) {
    localStorage.KeyRefresh1 = "116=F5";
}
if (!("KeyCopyUrl" in localStorage)) {
    localStorage.KeyCopyUrl = "117=F6";
}
if (!("KeyBack1" in localStorage)) {
    localStorage.KeyBack1 = "118=F7";
}
if (!("KeyForward" in localStorage)) {
    localStorage.KeyForward = "119=F8";
}
if (!("KeyDosL1" in localStorage)) {
    localStorage.KeyDosL1 = "49=1";
}
if (!("KeyDosL2" in localStorage)) {
    localStorage.KeyDosL2 = "50=2";
}
if (!("KeyDosL3" in localStorage)) {
    localStorage.KeyDosL3 = "51=3";
}
if (!("KeyDosL4" in localStorage)) {
    localStorage.KeyDosL4 = "52=4";
}
if (!("KeyDosL5" in localStorage)) {
    localStorage.KeyDosL5 = "53=5";
}
if (!("KeyDosR1" in localStorage)) {
    localStorage.KeyDosR1 = "97=NP 1";
}
if (!("KeyDosR2" in localStorage)) {
    localStorage.KeyDosR2 = "98=NP 2";
}
if (!("KeyDosR3" in localStorage)) {
    localStorage.KeyDosR3 = "99=NP 3";
}
if (!("KeyDosR4" in localStorage)) {
    localStorage.KeyDosR4 = "100=NP 4";
}
if (!("KeyDosR5" in localStorage)) {
    localStorage.KeyDosR5 = "101=NP 5";
}
if (!("KeyActivity" in localStorage)) {
    localStorage.KeyActivity = "65=a";
}
if (!("KeyBan" in localStorage)) {
    localStorage.KeyBan = "66=b";
}
if (!("KeyCross" in localStorage)) {
    localStorage.KeyCross = "67=c";
}
if (!("KeyDoss" in localStorage)) {
    localStorage.KeyDoss = "68=d";
}
if (!("KeyEndo" in localStorage)) {
    localStorage.KeyEndo = "69=e";
}
if (!("KeyGcrHap" in localStorage)) {
    localStorage.KeyGcrHap = "71=g";
}
if (!("KeyRegHap" in localStorage)) {
    localStorage.KeyRegHap = "72=h";
}
if (!("KeyWAJL1" in localStorage)) {
    localStorage.KeyWAJL1 = "74=j";
}
if (!("KeyRefresh2" in localStorage)) {
    localStorage.KeyRefresh2 = "75=k";
}
if (!("KeyWAJL2" in localStorage)) {
    localStorage.KeyWAJL2 = "76=l";
}
if (!("KeyMove" in localStorage)) {
    localStorage.KeyMove = "77=m";
}
if (!("KeyNation" in localStorage)) {
    localStorage.KeyNation = "78=n";
}
if (!("KeyOfficer" in localStorage)) {
    localStorage.KeyOfficer = "79=o";
}
if (!("KeyJP" in localStorage)) {
    localStorage.KeyJP = "80=p";
}
if (!("KeyRegion" in localStorage)) {
    localStorage.KeyRegion = "82=r";
}
if (!("KeySwitch" in localStorage)) {
    localStorage.KeySwitch = "83=s";
}
if (!("KeyTemplate" in localStorage)) {
    localStorage.KeyTemplate = "84=t";
}
if (!("KeyUpdate" in localStorage)) {
    localStorage.KeyUpdate = "85=u";
}
if (!("KeyWAD" in localStorage)) {
    localStorage.KeyWAD = "87=w";
}
if (!("KeyClearDoss" in localStorage)) {
    localStorage.KeyClearDoss = "88=x";
}
if (!("KeyZombie" in localStorage)) {
    localStorage.KeyZombie = "90=z";
}
if (!("Role" in localStorage)) {
    localStorage.Role = "Officer";
}
if (!("Scroll" in localStorage)) {
    localStorage.Scroll = false;
}
if (!("JumpPoints" in localStorage)) {
    localStorage.JumpPoints = "https://www.nationstates.net/region=artificial_solar_system";
}

// Global variables (except url, as it is needed above)
let shifted = false;
let controlled = false;
let alternated = false;
let keyInKeys = false;
let JumpPoint = localStorage.JumpPoints.split(",")[0];
let keys = [];
Object.keys(localStorage).forEach(function (key) {
    "use strict";
    let value = Number.parseInt(localStorage[key]);
    if (key.startsWith("Key") && !Number.isNaN(value)) {
        keys.push(value);
    }
});


// =====================================================================================================================
// Functions

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

// =====================================================================================================================
// Main

// Handle Popup Events
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

document.addEventListener("readystatechange", function () {
    "use strict";

    // NOTE for code placed in this event listener:
    // document.readyState === "interactive" is the first state change, before the DOM is fully loaded
    // document.readyState === "complete" happens right before the "load" event

    // Right before DOM is loaded
    if (document.readyState === "interactive") {
        // If on the reports page
        if (url === "https://www.nationstates.net/template-overall=none/page=reports") {
            // Make the page border green so the user knows they can safely refresh.
            document.getElementsByTagName("HTML")[0].style.borderColor = "#33cc00";
        }
    }

    // Right after DOM is loaded
    // if (document.readyState === "complete") {}
});

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

        // Page: Copy URL
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyCopyUrl)) {
            let temp = document.createElement("INPUT");
            document.getElementsByTagName("BODY")[0].appendChild(temp);
            temp.value = url;
            temp.select();
            document.execCommand("copy");
            document.removeChild(temp);
        }

        // Page: Back
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyBack1) || e.keyCode === Number.parseInt(localStorage.KeyBack2)) {
            // Send message to background script
            chrome.runtime.sendMessage({action: "previous", url: url});
            // Receive and load page in message
            chrome.runtime.onMessage.addListener(function (load) {
                window.location.href = load.url;
            });
        }

        // Page: Forward
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyForward)) {
            // Send message to background script
            chrome.runtime.sendMessage({action: "next", url: url});
            // Receive and load page in message
            chrome.runtime.onMessage.addListener(function (load) {
                window.location.href = load.url;
            });
        }

        // Page: Refresh
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyRefresh1) || e.keyCode === Number.parseInt(localStorage.KeyRefresh2)) {
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

        // -------------------------------------------------------------------------------------------------------------

        // Activity: Nation Update
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyUpdate)) {
            window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=self/filter=change";
        }

        // Activity: Spot ↔ All
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyActivity)) {
            if (url === "https://www.nationstates.net/page=activity/view=world") {
                window.location.href = "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo";
            } else if (url === "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo") {
                window.location.href = "https://www.nationstates.net/page=activity/view=world";
            } else {
                window.location.href = "https://www.nationstates.net/page=activity/view=world/filter=move+member+endo";
            }
        }

        // Activity: Spot Regional
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyRegHap)) {
            let re = getRegion();
            if (re) {
                window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=region." + re + "/filter=move+member+endo";
            }
        }

        // Activity: World changes
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyGcrHap)) {
            window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=world/filter=change";
        }

        // Banject
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyBan)) {
            document.getElementsByTagName("BUTTON").namedItem("ban").click();
        }

        // Cross first 10
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyCross)) {
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

        // Dossier → Clear
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyClearDoss)) {
            if (url === "https://www.nationstates.net/page=dossier") {
                document.getElementsByTagName("BUTTON").namedItem("clear_dossier").click();
            } else {
                window.location.href = "https://www.nationstates.net/page=dossier";
            }
        }

        // Dossier: Add Nation/Region
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyDoss)) {
            if (url.includes("region=")) {
                // On region"s page
                document.getElementsByTagName("BUTTON").namedItem("add_to_dossier").click();
            } else {
                // Elsewhere
                document.getElementsByTagName("BUTTON").namedItem("action").click(); // Doss nation
            }
        }

        // Endorse
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyEndo)) {
            if (document.getElementsByTagName("INPUT").namedItem("action").value === "endorse") {
                document.getElementsByClassName("endorse button")[0].click();
            }
        }

        // File GHR
        // Modes: 1
        // else if (e.keyCode == 70){
        //     window.location.href = "https://www.nationstates.net/page=help";
        // }

        // Jump Point (+[Shift] to set)
        // Modes: 3
        if (e.keyCode === Number.parseInt(localStorage.KeyJP)) {
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

        // Move
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyMove)) {
            if (url === "https://www.nationstates.net/template-overall=none/page=reports") {
                let r = document.getElementsByTagName("LI")[0].getElementsByClassName("rlink")[1];
                r.click();
                r.style.backgroundColor = "yellow";
            } else {
                moveToRegion();
            }
        }

        // Nation
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyNation)) {
            window.location.href = "https://www.nationstates.net";
        }

        // Prepare Switcher
        // Modes: 4
        if (e.keyCode === Number.parseInt(localStorage.KeySwitch)) {
            if (!window.location.href.includes("page=un") && window.location.href !== JumpPoint) {
                window.location.href = "https://www.nationstates.net/template-overall=none/page=un";
            }
            if (window.location.href.includes("page=un")) {
                document.getElementsByClassName("button").namedItem("submit").click();
            }
            if (window.location.href.includes("page=UN_status")) {
                window.location.href = JumpPoint;
            }
            if (window.location.href === JumpPoint) {
                moveToRegion();
            }
        }

        // Region
        // Modes: 3
        if (e.keyCode === Number.parseInt(localStorage.KeyRegion)) {
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

        // Regional Officer
        // Modes: 4
        if (e.keyCode === Number.parseInt(localStorage.KeyOfficer)) {
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

        // Reports Page
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyReports) && e.target === document.body) {
            url = window.location.href;
            if (url === "https://www.nationstates.net/template-overall=none/page=reports") {
                window.location.href = "https://www.nationstates.net/page=ajax2/a=reports/view=world/filter=move+member+endo";
            } else {
                window.location.href = "https://www.nationstates.net/template-overall=none/page=reports";
            }
        }

        // Toggle Template
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyTemplate)) {
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

        // WA: Apply/Join/Leave
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyWAJL1) || e.keyCode === Number.parseInt(localStorage.KeyWAJL2)) {
            if (url === "https://www.nationstates.net/page=un") {
                document.getElementsByClassName("button").namedItem("submit").click();
            } else {
                window.location.href = "https://www.nationstates.net/page=un";
            }
        }

        // WA: Delegate
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyWAD)) {
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

        // Zombie Control
        // Modes: 1
        if (e.keyCode === Number.parseInt(localStorage.KeyZombie)) {
            window.location.href = "https://www.nationstates.net/page=zombie_control";
        }

        // Open left of happening
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyDosL1)) {
            openNation(0, 0);
        }
        if (e.keyCode === Number.parseInt(localStorage.KeyDosL2)) {
            openNation(0, 1);
        }
        if (e.keyCode === Number.parseInt(localStorage.KeyDosL3)) {
            openNation(0, 2);
        }
        if (e.keyCode === Number.parseInt(localStorage.KeyDosL4)) {
            openNation(0, 3);
        }
        if (e.keyCode === Number.parseInt(localStorage.KeyDosL5)) {
            openNation(0, 4);
        }

        // Open right of happening
        // Modes: 2
        if (e.keyCode === Number.parseInt(localStorage.KeyDosR1)) {
            openNation(1, 0);
        }
        if (e.keyCode === Number.parseInt(localStorage.KeyDosR2)) {
            openNation(1, 1);
        }
        if (e.keyCode === Number.parseInt(localStorage.KeyDosR3)) {
            openNation(1, 2);
        }
        if (e.keyCode === Number.parseInt(localStorage.KeyDosR4)) {
            openNation(1, 3);
        }
        if (e.keyCode === Number.parseInt(localStorage.KeyDosR5)) {
            openNation(1, 4);
        }
    });
});

window.addEventListener("load", function () {
    "use strict";

    // Starts nation pages at the bottom when you load them, so you can endorse easier
    if (localStorage.Scroll === "true" && url.includes("nation=") && !url.includes("template-overall=none") && !url.includes("page=join_WA")) {
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Enables clicking on ajax2 reports links
    if (url.includes("page=ajax2") || url.includes("page=reports")) {
        // Plain old for loops are faster
        let nations = document.getElementsByClassName("nlink");
        for (let i = 0; i < nations.length && i < 10; i++) {
            nations[i].href = "https://nationstates.net/template-overall=none/nation=" + nations[i].href.split("/nation=")[1];
        }
        let regions = document.getElementsByClassName("rlink");
        for (let i = 0; i < regions.length && i < 10; i++) {
            regions[i].href = "https://nationstates.net/template-overall=none/region=" + regions[i].href.split("/region=")[1];
        }
    }

    // Displays load time on the reports page
    if (url.includes("page=reports")) {
        let loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        let l = document.createElement("span");
        l.innerText = " - PAGE LOAD TIME: " + loadTime + " ms";
        l.style.color = "#006400";
        document.body.insertBefore(l, document.getElementsByTagName("H1")[0]);
    }
});