import type { IAction } from "./types";
const modelApi = "https://civitai.com/api/v1/models";

let currentURL = null;
let currentVersion = null;
let currentModel = null;

let btn = null;
let btnParent = null;

const body = document.querySelector("body");
let observerTimeout = null;
const observer = new MutationObserver(() => {
  if (observerTimeout) {
    clearTimeout(observerTimeout);
  }
  observerTimeout = setTimeout(() => {
    const links = document.querySelectorAll("a");
    for (const link of links) {
      if (link.href.includes("api/download/models")) {
        const parent = link.parentElement;
        btnParent = parent;
        break;
      }
    }
    load();
  }, 100)
});
observer.observe(body, { childList: true, subtree: true });

async function load() {
  if (!btnParent) {
    return;
  }
  const url = new URL(window.location.href).pathname;
  const version = new URL(window.location.href).searchParams.get("modelVersionId");

  if (url.includes("models") && (currentURL !== url || currentVersion !== version)) {
    currentURL = url;
    currentVersion = version;
    const urlParts = url.split("/");
    const index = urlParts.indexOf("models");
    const id = urlParts[index + 1];
    currentModel = id;
  }

  if (btnParent.contains(btn)) {
    return;
  }

  if (url.includes("models")) {
    const button = document.createElement("button");
    button.innerText = "Download full data";
    button.classList.add("cd-extension-button");

    button.addEventListener("click", async () => {
      downloadData(currentModel);
    })

    let width = 150;
    const rect = btnParent.getBoundingClientRect();
    width = rect.width;

    Object.assign(button.style, {
      "width": `${width}px`,
      "height": "36px",
      "font-weight": "600",
      "font-size": "14px",
    })
    btnParent.appendChild(button);
    if (btn) {
      btn.remove();
    }
    btn = button;
  }
}
load();

function getFilenameParts(filename: string) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return null; // No file extension found
  }

  const ext = filename.slice(lastDotIndex + 1);
  const name = filename.slice(0, lastDotIndex);
  return { name, ext };
}
async function downloadData(id: string) {
  const modelData = await (await fetch(`${modelApi}/${id}`)).json();

  const modelVersion = currentVersion ? modelData.modelVersions.find(v => `${v.id}` === currentVersion) : modelData.modelVersions[0];

  const blob = new Blob([JSON.stringify(modelData)], { type: "text/info" });
  const blobURL = URL.createObjectURL(blob);

  const versionBlob = new Blob([JSON.stringify(modelVersion)], { type: "text/info" });
  const versionBlobURL = URL.createObjectURL(versionBlob);

  const fileName = modelVersion.files[0].name;
  const modelURL = modelVersion.downloadUrl;
  const images = modelVersion.images?.map(i => i.url);

  const { name } = getFilenameParts(fileName);

  btn.classList.add("cd-extension-loading");
  chrome.runtime.onMessage.addListener((request) => {
    if (request.name === "download-ready") {
      btn.classList.remove("cd-extension-loading");
    }
  })
  chrome.runtime.sendMessage<IAction>({ name: "download", data: { blobURL, versionBlobURL, modelURL, name, fileName, images } });
}