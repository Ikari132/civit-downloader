import type { IAction } from "./types";
import Button from "./lib/components/Button.svelte";
import type { SvelteComponentTyped } from "svelte";
import type { IModel } from "./types/model";
import type { IImage } from "./types/image";
import { fetchAllImages } from "./lib/helpers";

const modelApi = "https://civitai.com/api/v1/models";
const imageApi = "https://civitai.com/api/v1/images";

let currentURL = null;
let currentVersion = null;
let currentModel = null;

let btn: SvelteComponentTyped = null;
const body = document.querySelector("body");

const observer = new MutationObserver(() => {
  checkURL();
  if (currentURL?.includes("models") && currentModel) {
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
  });
  button.$on("options", () => {
    chrome.runtime.sendMessage({ name: "showOptions" });
  });

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
  const modelData: IModel = await (await fetch(`${modelApi}/${id}`)).json();

  const modelVersion = currentVersion ? modelData.modelVersions.find(v => `${v.id}` === currentVersion) : modelData.modelVersions[0];

  const blob = new Blob([JSON.stringify(modelData)], { type: "text/info" });
  const blobURL = URL.createObjectURL(blob);

  const versionBlob = new Blob([JSON.stringify(modelVersion)], { type: "text/info" });
  const versionBlobURL = URL.createObjectURL(versionBlob);

  const fileName = modelVersion.files[0].name;
  const modelURL = modelVersion.downloadUrl;

  const allImages: IImage[] = await fetchAllImages(imageApi, modelVersion.id);

  const modelAuthor = modelData.creator.username;
  const imagesByAuthor = allImages.reduce((acc, i) => {
    if (i.username === modelAuthor) {
      acc.creator.push(i);
    } else {
      acc.others.push(i);
    }
    return acc;
  }, { creator: [], others: [] });


  const images = modelVersion.images?.map(i => i.url);

  const creatorImages = imagesByAuthor.creator.map(i => i.url);
  const galleryImages = imagesByAuthor.others.map(i => i.url);


  const { name } = getFilenameParts(fileName);

  btn.$set({ state: "loading" });

  chrome.runtime.onMessage.addListener((request) => {
    if (request.name === "download-ready") {
      btn.$set({ state: "success" });

      setTimeout(() => {
        btn.$set({ state: null });
      }, 1000);

    }
    if (request.name === "download-error") {
      btn.$set({ state: null });
      console.error(request);
    }
  })
  chrome.runtime.sendMessage<IAction>({
    name: "download",
    data: {
      modelData,
      modelVersion,
      blobURL,
      versionBlobURL,
      modelURL,
      name,
      fileName,
      images,
      creatorImages,
      galleryImages,
    }
  });
}