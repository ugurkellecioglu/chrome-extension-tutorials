// Event listener for messages from content scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  if (request.message === "update_status" && request.data === true) {
    // Enable focus mode
    chrome.storage.local.set({ switchState: true })
  }
})

// Event listener for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(tabId, changeInfo, tab)
  // Retrieve the switch state from chrome.storage.local
  chrome.storage.local.get("switchState", function (result) {
    console.log(result)
    var switchState = result.switchState

    if (switchState && changeInfo.status === "complete") {
      var url = tab.url
      // Check if the opened website matches any website in storage
      chrome.storage.local.get("websites", function (result) {
        var websites = result.websites || []
        // if (websites.includes(url)) {
        //   // Perform action when there is a match
        //   // For example, execute the "block.js" script
        //   chrome.tabs.executeScript(tabId, { file: "block.js" })
        // }

        websites.findIndex(function (website) {
          const WEBSITE = new URL(website)
          const TARGET = new URL(url)

          if (WEBSITE.hostname === TARGET.hostname) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["block.js"],
            })
          }
        })
      })
    }
  })
})
