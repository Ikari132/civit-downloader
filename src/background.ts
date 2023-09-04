import { checkHistory, downloadImages, getSettingsStore, parseExt, updateHistory } from "./lib/helpers";
import type { IDownloadActionData, TAction } from "./types";

declare const browser: typeof chrome;

async function handleDownload(data: IDownloadActionData) {
  const settingsStore = getSettingsStore();

  await settingsStore.getValue().loading;

  const { state } = settingsStore.getValue();

  const downloads = [];

  if (state.saveFullData) {
    const blob = new Blob([JSON.stringify(data.modelData)], { type: "text/info" });
    const blobURL = URL.createObjectURL(blob);

    const ext = parseExt(state.fullDataExt);
    const name = `${data.name}/${data.name}.${ext}`;

    const fullDataPr = browser.downloads.download({
      url: blobURL,
      filename: name,
    });

    downloads.push(fullDataPr);
  }

  if (state.saveVersionData) {
    const versionBlob = new Blob([JSON.stringify(data.modelVersion)], { type: "text/info" });
    const versionBlobURL = URL.createObjectURL(versionBlob);

    const ext = parseExt(state.versionDataExt);
    const name = `${data.name}/${data.name}.${ext}`;
    const versionPr = browser.downloads.download({
      url: versionBlobURL,
      filename: name,
    });

    downloads.push(versionPr);
  }

  if (state.saveModel) {
    const modelPr = chrome.downloads.download({
      url: data.modelURL,
      filename: `${data.name}/${data.fileName}`,

    })
    downloads.push(modelPr);
  }

  if (data.images) {
    if (state.saveImages) {
      const imagesPr = downloadImages(data, state);
      downloads.push(...imagesPr);
    }

    const previewPr = chrome.downloads.download({
      url: data.images[0],
      filename: `${data.name}/${data.name}.preview.png`
    })
    downloads.push(previewPr);
  }

  return Promise.all(downloads).then(() => {
    updateHistory(data.modelVersion, state);
  })
}
async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.runtime.onMessage.addListener((action: TAction, sender, sendResponse) => {
  switch (action.name) {
    case "download":
      handleDownload(action.data).then(() => {
        getCurrentTab().then((tab) => {
          chrome.tabs.sendMessage(tab.id, { name: "download-ready" })
        })
      }).catch((err) => {
        getCurrentTab().then((tab) => {
          chrome.tabs.sendMessage(tab.id, { name: "download-error", err })
        })
      })
      break;
    case "showOptions":
      chrome.runtime.openOptionsPage();
      break;
    case "checkHistory":
      checkHistory(action, sendResponse);
      break;
    default:
      break;
  }

  return true;
});
