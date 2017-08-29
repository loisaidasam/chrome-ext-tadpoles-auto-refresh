
// If set to 0, it'll just click it right away
var TIMEOUT_WAIT_FOR_PAGELOAD_SECONDS = 3;

// Time until next refresh
var TIMEOUT_RELOAD_MINUTES = 5;


function clickToday() {
    console.log("clickToday()");
    document.getElementsByTagName('h4')[8].click();
}

function reloadPage() {
    console.log("reloadPage()");
    location.reload();
}

function getDiv() {
    // data-bind="template: {name: 'view/dailyReport'}"
    var divs = document.getElementsByTagName('div');
    for (var i in divs) {
        var div = divs[i];
        try {
            if (div.getAttribute('data-bind') == "template: {name: 'view/dailyReport'}") {
                // console.log("GOT IT!!! Numbah " + i);
                // console.log(div);
                return div;
            }
        } catch (e) {
            console.log("Exception: " + e);
        }
    }
    console.log("Didn't find the right div!");
}

function getTodayContent() {
    var div = getDiv();
    if (! div) {
        return;
    }
    if (div.innerHTML.length == 34) {
        console.log("div.innerHTML.length is 34. Content not ready yet!");
        return;
    }
    return div.innerHTML;
}

function storeTodayContent(content) {
    // References:
    // https://developer.chrome.com/apps/storage
    // https://www.w3schools.com/html/html5_webstorage.asp
    console.log("storeTodayContent");
    localStorage.setItem('content', content);
}

function loadTodayContent() {
    console.log("loadTodayContent");
    return localStorage.getItem('content');
}

function notifyNewContent() {
    // https://developer.chrome.com/extensions/messaging
    // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    //     console.log(response.farewell);
    // });
    // TODO: Eventually send content-specific information?
    data = {
        action: 'new_content',
    };
    chrome.runtime.sendMessage(data);
}

function pageReady() {
    clickToday();
    var content = getTodayContent();
    if (! content) {
        console.log("No content!");
        return;
    }
    var contentStored = loadTodayContent();
    if (content != contentStored) {
        console.log("New/different content! New content: " + content.length +
            " Old content: " + contentStored.length);
        notifyNewContent();
        storeTodayContent(content);
    }
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

        // ----------------------------------------------------------
        // This part of the script triggers when page is done loading
        // console.log("Hello. This message was sent from scripts/inject.js");
        // ----------------------------------------------------------

        // TODO: Check for this dynamically until we find it instead of for a
        // set amount of seconds
        if (TIMEOUT_WAIT_FOR_PAGELOAD_SECONDS > 0) {
            setTimeout(pageReady, TIMEOUT_WAIT_FOR_PAGELOAD_SECONDS * 1000);
        } else {
            pageReady();
        }

        console.log("Setting page reload in " + TIMEOUT_RELOAD_MINUTES + 
            " min ...");
        setTimeout(reloadPage, TIMEOUT_RELOAD_MINUTES * 60 * 1000);
	}
	}, 10);
});