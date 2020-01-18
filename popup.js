addEventListener("load", loaded, false);

function loaded() {
    updateJumpPoints();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "getRole"}, function(role) {
            let role_input = document.getElementById("officer-role");
            role_input.placeholder = role;
        });
    });
}

let jump_points = document.getElementById("jump-points");
jump_points.addEventListener("change", function () {
    let jp = document.getElementById("jump-points").value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "setJumpPoint", data: jp});
    });
});

let delete_jp = document.getElementById("delete-jp");
delete_jp.addEventListener("click", function () {
    let jpSelect = document.getElementById("jump-points");
    let jp = jpSelect.value;
    jpSelect.childNodes.forEach(function (item) {
        if (item.value === jp) jpSelect.removeChild(item);
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "deleteJumpPoint", data: jp});
    });
});

let save_officer = document.getElementById("save-officer");
save_officer.addEventListener("click", function () {
    let role = document.getElementById("officer-role").value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "setRole", data: role});
    });
});

function updateJumpPoints(jps) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "getJumpPoints"}, function(jps) {
            jps = jps.split(",");
            let jpSelect = document.getElementById("jump-points");
            jpSelect.childNodes.forEach(function (item) {
                jpSelect.removeChild(item);
            });
            jps.forEach(function (item) {
                let jpOption = document.createElement("option");
                jpOption.value = item;
                jpOption.innerText = item.replace("https://www.nationstates.net/region=", "")
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ");
                jpSelect.appendChild(jpOption);
            });
        });
    });
}