addEventListener("load", loaded, false);

function loaded() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "getJumpPoint"}, function(jp) {
            jp = jp.replace("https://www.nationstates.net/region=", "")
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ");
            document.getElementById("jumpPoint").innerHTML = jp;
            console.log(jp);
        });
    });
}