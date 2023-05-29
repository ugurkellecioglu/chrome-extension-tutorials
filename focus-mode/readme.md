# Focus Mode Extension

This extension is a clone of [Focus Mode](https://chrome.google.com/webstore/detail/focus-mode/ollmdedpknmlcdmpehclmgbogpifahdc).

![image](https://github.com/ugurkellecioglu/chrome-extension-tutorials/assets/51965140/53f2fd38-c300-4d57-a763-e7c70f95e8b8)

![image](https://github.com/ugurkellecioglu/chrome-extension-tutorials/assets/51965140/bca6477b-3062-45c1-a49a-8453d8b7a421)

## Description

This extension is written with pure JavaScript, HTML, and CSS. Bootstrap is used in `popup.html`. You can add websites to the block list and set focus mode on/off. When focus mode is on, the websites in the block list are blocked. When you try to go to a blocked website, you see a backdrop page with a centered box. You can click "Take 5 Min Break" to take a 5-minute break. When you click it, the backdrop page is removed, and a 5-minute alarm is created. The extension badge text is updated every second. When the 5 minutes are over, the backdrop page is shown again (if the website is blocked).

## API Justifications

- `chrome.storage` API is used for storing focus mode status and the websites that are added to the block list.
- `chrome.tabs` API is used for checking the current tab URL and blocking the websites that are added to the block list.
- `chrome.scripting` API is used for injecting `block.js` to the blocked websites.
- `chrome.alarms` API is used for creating breaks for 5 minutes when the "Take a Break" button is clicked.

## Summary

We can set focus mode through the popup. Every time it changes, we send a message from the popup to the background.

The `background.js` updates the `switchState` accordingly.

Every time tabs get updated, we check the `switchState`, and if it's true, we inject `block.js` into the tab.

`block.js` is just a backdrop page with a centered box. It has two buttons: "Take 5 Min Break" and "OK".

We send messages accordingly. If the message is "OK", we close the tab. If "Take 5 Min" is clicked, we remove the backdrop element from the page, create a 5-minute alarm, and update the extension badge text every second.

When the 5 minutes are over, we show the backdrop element again (if the website is blocked).

## Assignments (Optional)

- Fix the issue that when we click "Take 5 Min Break" and go to a blocked website, it doesn't show the backdrop element. Hint: Having an `isPaused` variable can be a good start.
- new URL is not good since it won't accept an url without protocol (https or http), you may fix it.
- When you see the backdrop then open popup, when you update switchState, backdrop should be updated accordingly.

---

2023-05-29 - Uğur Kellecioğlu
