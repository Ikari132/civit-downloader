import type { IAction } from "./types";

async function handleDownload(data) {
  chrome.downloads.download({
    url: data.data.blobURL,
    filename: `${data.data.name}/${data.data.name}.info`
  });

  const { saveAll, saveModel } = await new Promise<{ saveAll: boolean, saveModel: boolean }>((resolve) => {
    chrome.storage.local.get(["save-all", "save-model"], (result) => {
      console.log(result);

      resolve({
        saveAll: result['save-all'] === "true",
        saveModel: result['save-model'] === "true"
      })
    })
  })

  console.log(saveAll, saveModel);

  if (saveModel) {
    chrome.downloads.download({
      url: data.data.modelURL,
      filename: `${data.data.name}/${data.data.fileName}`
    })
  }
  if (data.data.images) {
    if (saveAll) {
      data.data.images.forEach((image, i) => {
        chrome.downloads.download({
          url: image,
          filename: `${data.data.name}/${data.data.name}_${i}.png`
        })
      })
    }

    chrome.downloads.download({
      url: data.data.images[0],
      filename: `${data.data.name}/${data.data.name}.preview.png`
    })
  }
}
chrome.runtime.onMessage.addListener((data: IAction) => {
  switch (data.name) {
    case "popup-open":
      chrome.runtime.sendMessage({ name: "background-responce", data: { message: "Hello from service worker" } })
      break;
    case "download":
      handleDownload(data);
      break
    default:
      break;
  }
});
