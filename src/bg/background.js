
// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// TODO: How do we get this to log somewhere, other than sending messages?
// console.log("background.js");

function handleNewContent(request, sender, sendResponse) {
    // https://developer.chrome.com/apps/notifications
    // https://developer.chrome.com/apps/app_codelab_alarms
    // https://developer.chrome.com/extensions/richNotifications
    // chrome.notifications.create(string notificationId, NotificationOptions options, function callback)
    var timestamp = new Date().toLocaleString();
    var notificationId = "chrome-ext-tadpoles-auto-refresh:" + timestamp;
    var options = {
        type: 'basic',
        title: "New Tadpoles Content!",
        message: "New Tadpoles Content!",
        iconUrl: "icons/icon128.png",
        requireInteraction: true,
    };
    chrome.notifications.create(notificationId, options,
        function(notificationId) {});
    chrome.notifications.onClicked.addListener(function(notificationId) {
        chrome.tabs.update(sender.tab.id, {active: true});
        chrome.notifications.clear(notificationId, function(wasCleared) {});
    });
    chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
        chrome.tabs.update(sender.tab.id, {active: true});
        chrome.notifications.clear(notificationId, function(wasCleared) {});
    });
    // chrome.pageAction.show(sender.tab.id);
    // sendResponse({farewell: "adieu"});
}

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    // https://developer.chrome.com/extensions/messaging
    console.log("Got message");
    console.log(request);
    if (request.action == 'new_content') {
        handleNewContent(request, sender, sendResponse);
    }
  });
