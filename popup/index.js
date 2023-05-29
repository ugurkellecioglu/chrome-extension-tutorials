var statusSwitch = document.getElementById("status-switchbox")
var statusText = document.querySelector(".status")
var paragraphText = document.querySelector(".container.status-wrapper p")
var takeBreakBtn = document.querySelector(".take-break-btn")
// Load initial switch state from chrome.storage.local
chrome.storage.local.get("switchState", function (result) {
  if (result.switchState !== undefined) {
    statusSwitch.checked = result.switchState
    updateStatusText(result.switchState)
  }
})

// Add event listener to the switch
statusSwitch.addEventListener("change", function () {
  var switchState = statusSwitch.checked
  updateStatusText(switchState)

  // Save the switch state in chrome.storage.local
  chrome.storage.local.set({ switchState: switchState })
})

// Function to update the status text based on the switch state
function updateStatusText(state) {
  if (state) {
    statusText.textContent = "Focus mode is on"
    paragraphText.textContent = "Distracting websites are now blocked"
    takeBreakBtn.style.display = "block"
  } else {
    statusText.textContent = "Focus mode is off"
    paragraphText.textContent = "Turn on to block distracting websites"
    takeBreakBtn.style.display = "none"
  }
}
