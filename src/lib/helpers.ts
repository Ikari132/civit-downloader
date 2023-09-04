import { writable } from "svelte/store";
import type { ICheckHistoryAction, IDownloadActionData, IState } from "../types";
import type { IImageResponce } from "../types/image";

export async function getOptions() {
  return new Promise<{ saveAll: boolean, saveModel: boolean }>((resolve) => {
    chrome.storage.local.get(["save-all", "save-model"], (result) => {
      const saveAll =
        result["save-all"] === undefined ? "true" : result["save-all"];
      const saveModel =
        result["save-model"] === undefined ? "true" : result["save-model"];

      resolve({
        saveAll: saveAll === "true",
        saveModel: saveModel === "true",
      });
    })
  });
}

export type TStore<T> = {
  state: T;
  loading: Promise<T>;
  updating: Promise<any>;
  error: string | null;
};
export const getSettingsStore = () => {
  const defaultState: IState = {
    imageSize: "preview",
    imageName: "model",
    imageFrom: "model",

    saveModel: true,
    saveImages: true,
    saveGallery: false,

    saveFullData: true,
    saveVersionData: true,

    imagesLimit: 50,
    // [todo] remove
    galleryLimit: 10,

    fullDataExt: "civit.full.info",
    versionDataExt: "civit.info",

    downloadHistory: [],
    downloadHistoryMeta: {},
  };

  const storeState: TStore<IState> = {
    state: defaultState,
    loading: Promise.resolve() as Promise<any>,
    updating: Promise.resolve() as Promise<any>,
    error: null,
  };
  const w = writable(storeState);

  const loading = new Promise<IState>((resolve) => {
    chrome.storage.local.get().then((result) => {
      console.log("result", result);
      const state = { ...defaultState, ...result } as IState;

      w.update((v) => {
        return {
          ...v,
          state,
        };
      });

      resolve(state);
    });
  });

  let currentState: TStore<IState> = null;
  w.subscribe((state) => {
    currentState = state;
  });

  w.update((storeState) => {
    return {
      ...storeState,
      loading,
    };
  });

  type TUpdater = (state: TStore<IState>) => TStore<IState>;
  const update = (updater: TUpdater) => {
    w.update(updater);
  };

  const set = (state: TStore<IState>) => {
    state.updating = chrome.storage.local
      .set(currentState.state)
      .catch((e) => {
        console.error(e);
        w.set({ ...currentState, error: e.message });
      });

    w.set(state);
  };

  const getValue = () => {
    return currentState;
  }
  return { ...w, set, update, getValue };
};

export function parseExt(ext: string) {
  if (ext[0] === ".") {
    return ext.slice(1);
  }
  return ext;
}

export function downloadImages(data: IDownloadActionData, state: IState) {
  const modelName = data.name;
  let images = data.images;

  if (state.imageFrom === "creator") {
    images = data.creatorImages;
  } else if (state.imageFrom === "gallery") {
    images = data.galleryImages;
  } else if (state.imageFrom === "all") {
    images = data.creatorImages.concat(data.galleryImages);
  }


  if (state.imagesLimit) {
    images = images.slice(0, +state.imagesLimit);
  }

  return images.map((url: string, i: number) => {
    const urlParts = url.split("/");
    const imageName = urlParts.at(-1);
    const imageExt = imageName.split(".").at(-1);

    const originalImageUrl =
      urlParts.slice(0, -2).join("/") + `/${imageName}`;
    const previewUrl = urlParts.slice(0, -2).join("/") + "/width=450" + `/${imageName}`;

    const modelNameWithCount = `${modelName}_${i}.${imageExt}`;

    const finalImageName = state.imageName === "original" ? imageName : modelNameWithCount;
    const finalImageUrl = state.imageSize === "original" ? originalImageUrl : previewUrl;

    return chrome.downloads.download({
      url: finalImageUrl,
      filename: `${modelName}/${finalImageName}`
    })
  })
}


export async function fetchAllImages(url: string, modelVersionId: number) {
  const allImages: any[] = [];

  let ready = false;

  let totalUrl = `${url}?modelVersionId=${modelVersionId}`;

  try {
    while (!ready) {
      const modelImages: IImageResponce = await (await fetch(totalUrl)).json();
      const images = modelImages.items;

      allImages.push(...images);
      if (modelImages.metadata.nextPage) {
        totalUrl = modelImages.metadata.nextPage;
      } else {
        ready = true;
      }
    }

    return allImages;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

export async function updateHistory(modelVersionId: number, state: IState) {
  if (!state.saveModel) {
    return;
  }

  const { downloadHistory = [] } = await chrome.storage.local.get("downloadHistory");


  if (downloadHistory.indexOf(modelVersionId) === -1) {
    downloadHistory.push(modelVersionId);
    await chrome.storage.local.set({ downloadHistory });
  }
}

export async function checkHistory({ data }: ICheckHistoryAction, sendResponse: (value: any) => void) {
  const settingsStore = getSettingsStore();
  await settingsStore.getValue().loading;
  const { state } = settingsStore.getValue();

  if (state.downloadHistory?.find(v => `${v}` === `${data.versionId}`)) {
    sendResponse(true);
  } else {
    sendResponse(false);
  }
}