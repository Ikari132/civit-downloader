import { downloadImages, getSettingsStore, parseExt } from "./lib/helpers";
import type { IDownloadActionData, TAction } from "./types";

async function handleDownload(data: IDownloadActionData) {
  const settingsStore = getSettingsStore();

  await settingsStore.getValue().loading;

  const { state } = settingsStore.getValue();

  const downloads = [];

  if (state.saveFullData) {
    const ext = parseExt(state.fullDataExt);
    const name = `${data.name}/${data.name}.${ext}`;

    const fullDataPr = chrome.downloads.download({
      url: data.blobURL,
      filename: name
    });
    downloads.push(fullDataPr);
  }
  if (state.saveVersionData) {
    const ext = parseExt(state.versionDataExt);
    const name = `${data.name}/${data.name}.${ext}`;

    const versionPr = chrome.downloads.download({
      url: data.versionBlobURL,
      filename: name
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
    });

    downloads.push(previewPr);
  }

  return Promise.all(downloads);
}
async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.runtime.onMessage.addListener((action: TAction) => {
  switch (action.name) {
    case "download":
      handleDownload(action.data).then(() => {
        getCurrentTab().then((tab) => {
          chrome.tabs.sendMessage(tab?.id, { name: "download-ready" })
        })
      }).catch((err) => {
        getCurrentTab().then((tab) => {
          chrome.tabs.sendMessage(tab?.id, { name: "download-error", err })
        })
      })
      break;
    case "showOptions":
      chrome.runtime.openOptionsPage();
      break;
    default:
      break;
  }
});
