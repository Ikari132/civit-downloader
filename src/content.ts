import type { IAction } from "./types";
import Button from "./lib/components/Button.svelte";
import type { SvelteComponentTyped } from "svelte";

const modelApi = "https://civitai.com/api/v1/models";

let currentURL = null;
let currentVersion = null;
let currentModel = null;

let btn: SvelteComponentTyped = null;

const body = document.querySelector("body");

const observer = new MutationObserver(() => {
  checkURL();
  if (currentURL?.includes("models")) {
    createButton();
  } else {
    btn?.$destroy();
    btn = null;
  }
});
observer.observe(body, { childList: true, subtree: true });

function checkURL() {
  const url = new URL(window.location.href).pathname;
  const version = new URL(window.location.href).searchParams.get("modelVersionId");

  if (!url.includes("models")) {
    currentURL = null;
    currentVersion = null;
    currentModel = null;

    return;
  }

  if (currentURL !== url || currentVersion !== version) {
    const urlParts = url.split("/");
    const index = urlParts.indexOf("models");
    const id = urlParts[index + 1];

    currentURL = url;
    currentVersion = version;
    currentModel = id;
  }
}
async function createButton() {
  if (btn) {
    return;
  }
  const button = new Button({
    target: document.body,
  });

  button.$on("click", () => {
    downloadData(currentModel);
  })
  btn = button;
}

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

  btn.$set({ state: "loading" });
  chrome.runtime.onMessage.addListener((request) => {
    if (request.name === "download-ready") {
      btn.$set({ state: "success" });

      setTimeout(() => {
        btn.$set({ state: null });
      }, 1000);

    }
  })
  chrome.runtime.sendMessage<IAction>({ name: "download", data: { blobURL, versionBlobURL, modelURL, name, fileName, images } });
}