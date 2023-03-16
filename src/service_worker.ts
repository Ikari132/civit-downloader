import type { IAction } from "./types";

chrome.runtime.onMessage.addListener((data: IAction) => {
  switch (data.name) {
    case "popup-open":
      chrome.runtime.sendMessage({ name: "background-responce", data: { message: "Hello from service worker" } })
      break;

    default:
      break;
  }
});
