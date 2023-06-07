import type { IAction } from "./types";
const modelApi = "https://civitai.com/api/v1/models";

let currentURL = null;
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
  if (btnParent.contains(btn)) {
    return;
  }

  const url = new URL(window.location.href).toString();
  if (url.includes("models") && currentURL !== url) {
    currentURL = url;
    const id = url.split("/").at(-2);

    const button = document.createElement("button");
    button.innerText = "Download full data";
    button.classList.add("cd-extension-button");

    button.addEventListener("click", async () => {
      downloadData(id);
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

async function downloadData(id: string) {
  const modelData = await (await fetch(`${modelApi}/${id}`)).json();
  const blob = new Blob([JSON.stringify(modelData)], { type: "text/info" });

  const blobURL = URL.createObjectURL(blob);
  const fileName = modelData.modelVersions[0].files[0].name;
  const modelURL = modelData.modelVersions[0].downloadUrl;
  const images = modelData.modelVersions[0].images?.map(i => i.url);

  const name = fileName.split(".").at(0);

  chrome.runtime.sendMessage<IAction>({ name: "download", data: { blobURL, modelURL, name, fileName, images } });
}