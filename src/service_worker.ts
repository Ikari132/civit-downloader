import { checkHistory, downloadImages, getDownloadFolder, getSettings, getSettingsStore, parseExt, updateHistory } from "./lib/helpers";
import type { IDownloadActionData, TAction } from "./types";

async function handleDownload(data: IDownloadActionData) {
  const settingsStore = getSettingsStore();

  await settingsStore.getValue().loading;

  const { state } = settingsStore.getValue();

  const downloads = [];

  const folderName = getDownloadFolder(data.modelData, state);

  if (state.saveFullData) {
    const ext = parseExt(state.fullDataExt);
    const name = `${folderName}${data.name}/${data.name}.${ext}`;

    const fullDataPr = chrome.downloads.download({
      url: data.blobURL,
      filename: name
    });
    downloads.push(fullDataPr);
  }
  if (state.saveVersionData) {
    const ext = parseExt(state.versionDataExt);
    const name = `${folderName}${data.name}/${data.name}.${ext}`;

    const versionPr = chrome.downloads.download({
      url: data.versionBlobURL,
      filename: name
    });
    downloads.push(versionPr);
  }

  if (state.saveModel) {
    const modelPr = chrome.downloads.download({
      url: data.modelURL,
      filename: `${folderName}${data.name}/${data.fileName}`,
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
      filename: `${folderName}${data.name}/${data.name}.preview.png`
    });

    downloads.push(previewPr);
  }

  return Promise.all(downloads).then(() => {
    updateHistory(data, state);
  })
}

chrome.runtime.onMessage.addListener((action: TAction, sender, sendResponse) => {
  const tabId = sender?.tab?.id;

  switch (action.name) {
    case "download":
      handleDownload(action.data).then(() => {
        chrome.tabs.sendMessage(tabId, { name: "download-ready" })
      }).catch((err) => {
        chrome.tabs.sendMessage(tabId, { name: "download-error", err })
      })
      break;
    case "showOptions":
      chrome.runtime.openOptionsPage();
      break;
    case "checkHistory":
      checkHistory(action, sendResponse);
      break;
    case "getSettings":
      getSettings(sendResponse);
      break;
    default:
      break;
  }
  return true;
});
