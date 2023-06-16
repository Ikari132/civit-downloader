import type { IAction } from "./types";

async function handleDownload(data) {
  chrome.downloads.download({
    url: data.data.versionBlobURL,
    filename: `${data.data.name}/${data.data.name}.civitai.info`
  });
  chrome.downloads.download({
    url: data.data.blobURL,
    filename: `${data.data.name}/${data.data.name}.civitai.full.info`
  });

  const { saveAll, saveModel } = await new Promise<{ saveAll: boolean, saveModel: boolean }>((resolve) => {
    chrome.storage.local.get(["save-all", "save-model"], (result) => {
      resolve({
        saveAll: result['save-all'] === "true",
        saveModel: result['save-model'] === "true"
      })
    })
  })

  const downloads = [];
  if (saveModel) {
    const modelPr = chrome.downloads.download({
      url: data.data.modelURL,
      filename: `${data.data.name}/${data.data.fileName}`
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
