var intervalId // Variable to store the interval ID

// Event listener for messages from content scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  if (request.message === "update_status" && request.data === true) {
    // Enable focus mode
    chrome.storage.local.set({ switchState: true })

    // if intervalId is not undefined, clear the interval
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      //clear the badge text
      chrome.action.setBadgeText({ text: "" })
    }
  } else if (request.message === "close_tab") {
    // Close the tab
    chrome.tabs.remove(sender.tab.id)
  } else if (request.message === "start_break") {
    // Create an alarm for 5 minutes
    chrome.alarms.create("breakAlarm", { delayInMinutes: 5 })

    // Set badge text to "5:00"
    chrome.action.setBadgeText({ text: "5:00" })

    // Start updating the badge countdown
    intervalId = setInterval(updateBadgeCountdown, 1000)

    // Send message to content script to show the break page
    sendResponse({ message: "show_page" })
  }
})

// Event listener for tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // Retrieve the switch state from chrome.storage.local
  chrome.storage.local.get("switchState", function (result) {
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

// Function to update the badge countdown
function updateBadgeCountdown() {
  // Get the current badge text
  chrome.action.getBadgeText({}, function (result) {
    var timeRemaining = result.split(":") // Split the time into minutes and seconds

    // Convert minutes and seconds to numbers
    var minutes = parseInt(timeRemaining[0], 10)
    var seconds = parseInt(timeRemaining[1], 10)

    if (minutes === 0 && seconds === 0) {
      // Break is finished, set focus mode to true and remove alarm
      clearInterval(intervalId)
      chrome.storage.local.set({ switchState: true })
      chrome.alarms.clear("breakAlarm")
      chrome.action.setBadgeText({ text: "" })
    } else {
      // Decrease the time by 1 second
      if (seconds === 0) {
        minutes--
        seconds = 59
      } else {
        seconds--
      }

      // Format the time with leading zeros
      var formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`

      // Update the badge text
      chrome.action.setBadgeText({ text: formattedTime })
    }
  })
}

// Event listener for the alarm
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "breakAlarm") {
    // Break is finished, set focus mode to true and remove alarm
    clearInterval(intervalId)
    chrome.storage.local.set({ switchState: true })
    chrome.action.setBadgeText({ text: "" })

    // send message to content script to show the break page
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.local.get("websites", function (result) {
        var websites = result.websites || []
        // if (websites.includes(url)) {
        //   // Perform action when there is a match
        //   // For example, execute the "block.js" script
        //   chrome.tabs.executeScript(tabId, { file: "block.js" })
        // }

        websites.findIndex(function (website) {
          const WEBSITE = new URL(website)
          const TARGET = new URL(tabs[0].url)

          if (WEBSITE.hostname === TARGET.hostname) {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ["block.js"],
            })
          }
        })
      })
    })
  }
})
