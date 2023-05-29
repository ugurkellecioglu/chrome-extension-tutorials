var statusSwitch = document.getElementById("status-switchbox")

// Load initial switch state from chrome.storage.local
chrome.storage.local.get("switchState", function (result) {
  if (result.switchState !== undefined) {
    statusSwitch.checked = result.switchState
  }
})

// Add event listener to the switch
statusSwitch.addEventListener("change", function () {
  var switchState = statusSwitch.checked

  // Save the switch state in chrome.storage.local
  chrome.storage.local.set({ switchState: switchState })
})
