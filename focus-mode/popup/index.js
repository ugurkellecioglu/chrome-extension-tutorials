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
  // Send message to background.js to update the switch state
  chrome.runtime.sendMessage({
    message: "update_status",
    data: switchState,
  })
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

// input & save websites on storage

var inputField = document.querySelector(".form-control")
var listOfWebsites = document.querySelector(".list-of-websites")

// Load initial website list from chrome.storage.local
chrome.storage.local.get("websites", function (result) {
  if (result.websites !== undefined) {
    displayWebsites(result.websites)
  }
})

// Function to create the HTML for a website item with delete button
function createWebsiteItem(website, index) {
  return `
      <div class="website-item d-flex justify-content-between align-items-center">
        <span>${website}</span>
        <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
      </div>
    `
}

// Function to display the websites in the list
function displayWebsites(websites) {
  listOfWebsites.innerHTML = ""
  for (var i = 0; i < websites.length; i++) {
    var website = websites[i]
    var websiteItem = document.createElement("div")
    websiteItem.innerHTML = createWebsiteItem(website, i)

    listOfWebsites.appendChild(websiteItem)
  }

  // Add event listeners to delete buttons
  var deleteButtons = document.querySelectorAll(".delete-btn")
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var index = parseInt(button.dataset.index)

      // Retrieve the current list of websites from chrome.storage.local
      chrome.storage.local.get("websites", function (result) {
        var websites = result.websites || []
        websites.splice(index, 1)

        // Save the updated list of websites in chrome.storage.local
        chrome.storage.local.set({ websites: websites }, function () {
          // Display the updated list of websites
          displayWebsites(websites)
        })
      })
    })
  })
}

// Event listener for the input field
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (!isValidURL(inputField.value)) {
      alert("Please enter a valid URL")
      return
    }

    var inputValue = inputField.value.trim()
    // Retrieve the current list of websites from chrome.storage.local
    chrome.storage.local.get("websites", function (result) {
      var websites = result.websites || []
      websites.push(inputValue)

      // Save the updated list of websites in chrome.storage.local
      chrome.storage.local.set({ websites: websites }, function () {
        // Display the updated list of websites
        displayWebsites(websites)

        // Clear the input field
        inputField.value = ""
      })
    })
  }
})

function isValidURL(string) {
  try {
    new URL(string)
  } catch (_) {
    return false
  }

  return true
}

// takeBreakBtn

takeBreakBtn.addEventListener("click", function () {
  chrome.runtime.sendMessage({
    message: "start_break",
  })
})
