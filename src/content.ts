import type { IAction, IDownloadActionData, IState } from "./types";
import Button from "./lib/components/Button.svelte";
import type { SvelteComponentTyped } from "svelte";
import type { IModel } from "./types/model";
import type { IImage } from "./types/image";
import { fetchAllImages, messageStore } from "./lib/helpers";
import { imageApi, modelApi } from "./lib/constants";

let currentURL = null;
let currentVersion = null;
let currentModel = null;
let alreadyDownloaded = false;
let settings: IState = null;

let btn: SvelteComponentTyped = null;
const body = document.querySelector("body");

loadSettings();

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
  try {
    const url = new URL(window.location.href).pathname;
    let version = new URL(window.location.href).searchParams.get("modelVersionId");

    if (!version) {
      const linkEls: NodeListOf<HTMLAnchorElement> = document.querySelector("main").querySelectorAll("[data-button='true']");
      const downloadLinkEl = Array.from(linkEls).find(link => link.href?.includes("/api/download/models/"));
      let idFromButton = downloadLinkEl?.getAttribute("href").replace("/api/download/models/", "");
      idFromButton = idFromButton?.split("?")[0];

      if (idFromButton) {
        version = idFromButton;
      }
    }

    if (!url.includes("models")) {
      currentURL = null;
      currentVersion = null;
      currentModel = null;
      alreadyDownloaded = false;

      return;
    }

    if (currentURL !== url || currentVersion !== version) {
      const urlParts = url.split("/");
      const index = urlParts.indexOf("models");
      const id = urlParts[index + 1];

      currentURL = url;
      currentVersion = version;
      currentModel = id;

      chrome.runtime.sendMessage<IAction>({
        name: "checkHistory",
        data: {
          modelId: id,
          versionId: version,
        }
      }).then((data) => {
        if (data === true) {
          alreadyDownloaded = true;
        } else {
          alreadyDownloaded = false;
        }

        if (btn) {
          btn.$set({ alreadyDownloaded });
        }
      })
    }
  } catch (error) {
    console.error("Civit downloader error:", error);
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

async function loadSettings() {
  return new Promise<void>((res) => {
    return chrome.runtime
      .sendMessage<IAction>({
        name: "getSettings",
      })
      .then((data) => {
        settings = data;
        res();
      });
  });
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
  try {
    btn.$set({ state: "loading" });

    await loadSettings();

    const modelReq: Response = await fetch(`${modelApi}/${id}`);

    if (!modelReq.ok) {
      messageStore.set({ status: "error", message: "Failed to fetch model data" });
      return;
    }

    const modelData: IModel = await modelReq.json();

    const modelVersion = currentVersion
      ? modelData.modelVersions.find((v) => `${v.id}` === currentVersion)
      : modelData.modelVersions[0];

    const blob = new Blob([JSON.stringify(modelData)], { type: "text/info" });
    const blobURL = URL.createObjectURL(blob);

    const versionBlob = new Blob([JSON.stringify(modelVersion)], {
      type: "text/info",
    });
    const versionBlobURL = URL.createObjectURL(versionBlob);

    let modelFileData = modelVersion.files.find((f) => f.type === "Model");

    if(!modelFileData) {
      modelFileData = modelVersion.files[0];
    }

    const fileName = modelFileData.name;
    const modelURL = modelVersion.downloadUrl;

    const modelAuthor = modelData.creator.username;
    const images = modelVersion.images?.map((i) => i.url);

    const { name } = getFilenameParts(fileName);

    const data: IDownloadActionData = {
      modelData,
      modelVersion,
      blobURL,
      versionBlobURL,
      modelURL,
      name,
      fileName,
      images,
      creatorImages: [],
      galleryImages: [],
    };

    if (settings.imageFrom !== "model") {
      const allImages: IImage[] = await fetchAllImages(
        imageApi,
        modelVersion.id
      );

      if (allImages) {
        const imagesByAuthor = allImages.reduce(
          (acc, i) => {
            if (i.username === modelAuthor) {
              acc.creator.push(i);
            } else {
              acc.others.push(i);
            }
            return acc;
          },
          { creator: [], others: [] }
        );

        data.creatorImages = imagesByAuthor.creator.map((i) => i.url);
        data.galleryImages = imagesByAuthor.others.map((i) => i.url);
      }
    }

    chrome.runtime.onMessage.addListener((request) => {
      if (request.name === "download-ready") {
        btn.$set({ state: "success" });

        setTimeout(() => {
          alreadyDownloaded = true;
          btn.$set({ state: null, alreadyDownloaded });
        }, 1000);
      }
      if (request.name === "download-error") {
        messageStore.set({ status: "error", message: "Failed to download" });
      }
    });

    chrome.runtime.sendMessage<IAction>({
      name: "download",
      data: data,
    });
  } catch (err) {
    messageStore.set({ status: "error", message: "Failed to download" });
  }
}

messageStore.subscribe((data) => {
  if (data.status === "error") {
    btn.$set({ state: "error" });
    setTimeout(() => {
      btn.$set({ state: null });
    }, 3000);
  }
});
