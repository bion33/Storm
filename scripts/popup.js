/** @namespace chrome.tabs **/

let jump_points = document.getElementById("jump-points");
let delete_jp = document.getElementById("delete-jp");
let save_officer = document.getElementById("save-officer");
let scroll = document.getElementById("scroll");
let keyInputs = document.getElementsByClassName("key-input");
let specialKeys = {
    "0": "Special",
    "32": "Spacebar",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "96": "NP 0",
    "97": "NP 1",
    "98": "NP 2",
    "99": "NP 3",
    "100": "NP 4",
    "101": "NP 5",
    "102": "NP 6",
    "103": "NP 7",
    "104": "NP 8",
    "105": "NP 9"
};

function updateJumpPoints() {
    "use strict";
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "getJumpPoints"}, function (jps) {
            jps = jps.split(",");
            jump_points.childNodes.forEach(function (item) {
                jump_points.removeChild(item);
            });
            jps.forEach(function (item) {
                let jpOption = document.createElement("option");
                jpOption.value = item.toString();
                jpOption.innerText = item.replace("https://www.nationstates.net/region=", "")
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ");
                jump_points.appendChild(jpOption);
            });
        });
    });
}

function loaded() {
    "use strict";
    updateJumpPoints();
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "getRole"}, function (role) {
            let role_input = document.getElementById("officer-role");
            role_input.placeholder = role;
        });
        chrome.tabs.sendMessage(tabs[0].id, {type: "getScroll"}, function (value) {
            scroll.checked = value;
        });
        Array.from(keyInputs).forEach(function (keyInput) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "getKey", data: keyInput.id}, function (value) {
                let v = value.split("=")[0];
                if (specialKeys[v] === undefined) {
                    keyInput.value = value.substring(value.indexOf("=") + 1);
                } else {
                    keyInput.value = specialKeys[v];
                }

                if (keyInput.id == "KeyJP") {
                    let tip = document.getElementById("JPKey").getAttribute("title").replace("JPKey", keyInput.value);
                    document.getElementById("JPKey").setAttribute("title", tip);
                }
            });
        });
    });
}
document.addEventListener("DOMContentLoaded", loaded, false);

jump_points.addEventListener("change", function () {
    "use strict";
    let jp = document.getElementById("jump-points").value;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "setJumpPoint", data: jp});
    });
});

delete_jp.addEventListener("click", function () {
    "use strict";
    let jpSelect = document.getElementById("jump-points");
    let jp = jpSelect.value;
    jpSelect.childNodes.forEach(function (item) {
        if (item.value === jp) {
            jpSelect.removeChild(item);
        }
    });
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "deleteJumpPoint", data: jp});
    });
});

save_officer.addEventListener("click", function () {
    "use strict";
    let role = document.getElementById("officer-role").value;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "setRole", data: role});
    });
});

scroll.addEventListener("click", function () {
    "use strict";
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "setScroll", data: scroll.checked});
    });
});

Array.from(keyInputs).forEach(function (keyInput) {
    "use strict";
    keyInput.addEventListener("click", function () {
        keyInput.value = "Press a key";
        keyInput.addEventListener("keydown", function (e) {
            e.preventDefault();
        });
        keyInput.addEventListener("keyup", function (e) {
            e.preventDefault();
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "getKeys"}, function (value) {
                    if (value.includes(e.keyCode)) {
                        keyInput.value = "Duplicate!";
                    } else {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: "setKey",
                            data: keyInput.id + "=" + e.keyCode + "=" + e.key
                        });
                        if (specialKeys[e.keyCode] === undefined) {
                            keyInput.value = e.key;
                        } else {
                            keyInput.value = specialKeys[e.keyCode];
                        }
                    }
                });
            });
        });
    });
});