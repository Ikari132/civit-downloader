import { getOptions } from "./lib/helpers";
import type { IAction } from "./types";

declare const browser: typeof chrome;

async function handleDownload(data) {
  const blob = new Blob([JSON.stringify(data.data.modelData)], { type: "text/info" });
  const blobURL = URL.createObjectURL(blob);

  const versionBlob = new Blob([JSON.stringify(data.data.modelVersion)], { type: "text/info" });
  const versionBlobURL = URL.createObjectURL(versionBlob);

  browser.downloads.download({
    url: blobURL,
    filename: `${data.data.name}/${data.data.name}.civitai.info`,
  });
  browser.downloads.download({
    url: versionBlobURL,
    filename: `${data.data.name}/${data.data.name}.civitai.full.info`,
  });

  const { saveAll, saveModel } = await getOptions();

  const downloads = [];
  if (saveModel) {
    const modelPr = chrome.downloads.download({
      url: data.data.modelURL,
      filename: `${data.data.name}/${data.data.fileName}`,

    })
    downloads.push(modelPr);
  }
  if (data.data.images) {
    if (saveAll) {
      data.data.images.forEach((image, i) => {
        const imagePr = chrome.downloads.download({
          url: image,
          filename: `${data.data.name}/${data.data.name}_${i}.png`
        })
        downloads.push(imagePr);
      })
    }

    const previewPr = chrome.downloads.download({
      url: data.data.images[0],
      filename: `${data.data.name}/${data.data.name}.preview.png`
    })
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

chrome.runtime.onMessage.addListener((data: IAction) => {
  switch (data.name) {
    case "download":
      handleDownload(data).then(() => {
        getCurrentTab().then((tab) => {
          chrome.tabs.sendMessage(tab.id, { name: "download-ready" })
        })
      }).catch((err) => {
        getCurrentTab().then((tab) => {
          chrome.tabs.sendMessage(tab.id, { name: "download-error", err })
        })
      })
      break
    default:
      break;
  }
});
