// Create the backdrop element
var backdrop = document.createElement("div")
backdrop.style.position = "fixed"
backdrop.style.top = "0"
backdrop.style.left = "0"
backdrop.style.width = "100%"
backdrop.style.height = "100%"
backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
backdrop.style.zIndex = "9999"
backdrop.style.display = "flex"
backdrop.style.alignItems = "center"
backdrop.style.justifyContent = "center"
backdrop.style.backdropFilter = "blur(10px)" // Apply the blur effect

// Create the box element
var box = document.createElement("div")
box.style.width = "300px"
box.style.padding = "20px"
box.style.backgroundColor = "#fff"
box.style.textAlign = "center"
box.style.borderRadius = "5px"
box.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)"

// Create the title element
var title = document.createElement("h1")
title.textContent = "Focus mode is on"
title.style.marginBottom = "10px"

// Create the subtitle element
var subtitle = document.createElement("p")
subtitle.textContent = "Distracting websites are blocked right now"
subtitle.style.marginBottom = "20px"

// Create the "Take 5 min break" button
var takeBreakBtn = document.createElement("button")
takeBreakBtn.textContent = "Take 5 min break"
takeBreakBtn.style.marginRight = "10px"
takeBreakBtn.style.padding = "10px 20px"
takeBreakBtn.style.fontSize = "14px"
takeBreakBtn.style.backgroundColor = "#007bff"
takeBreakBtn.style.color = "#fff"
takeBreakBtn.style.border = "none"
takeBreakBtn.style.borderRadius = "5px"
takeBreakBtn.style.cursor = "pointer"

// Create the "OK" button
var okBtn = document.createElement("button")
okBtn.textContent = "OK"
okBtn.style.padding = "10px 20px"
okBtn.style.fontSize = "14px"
okBtn.style.backgroundColor = "#6c757d"
okBtn.style.color = "#fff"
okBtn.style.border = "none"
okBtn.style.borderRadius = "5px"
okBtn.style.cursor = "pointer"
okBtn.addEventListener("click", function () {
  // Send message to the background script
  chrome.runtime.sendMessage({ message: "close_tab" })
})

// Append the elements to the box
box.appendChild(title)
box.appendChild(subtitle)
box.appendChild(takeBreakBtn)
box.appendChild(okBtn)

// Append the box to the backdrop
backdrop.appendChild(box)

// Append the backdrop to the document body
document.body.appendChild(backdrop)
