import { writable, type Writable } from "svelte/store";
import type { ICheckHistoryAction, IDownloadActionData, IState } from "../types";
import type { IImageResponce } from "../types/image";
import type { IModel, IModelVersion } from "../types/model";
import { DEFAULT_STATE, modelTypes, modelVersionApi } from "./constants";

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

export const messageStore = writable<{
  status: "success" | "warning" | "error" | null;
  message?: string;
}>({ status: null });

messageStore.subscribe((data) => {
  if (data.status) {
    setTimeout(() => {
      messageStore.set({ status: null });
    }, 3000);
  }
  if (data.status === "error" || data.status === "warning") {
    console.error(data.message);
  }
});

export type TStore<T> = {
  state: T;
  customState: T;

  loading: Promise<T>;
  updating: Promise<any>;
  error: string | null;
};
export type TWritableStore = Writable<TStore<IState>>;

const storeState: TStore<IState> = {
  state: DEFAULT_STATE,
  customState: DEFAULT_STATE,
  loading: Promise.resolve() as Promise<any>,
  updating: Promise.resolve() as Promise<any>,
  error: null,
};
const w = writable(storeState);

export const getSettingsStore = () => {
  const loading = new Promise<IState>((resolve) => {
    chrome.storage.local.get().then((result) => {
      const state = { ...DEFAULT_STATE, ...result } as IState;

      let delay = 0;
      const metaPr = state.downloadHistory.filter(v => !state.downloadHistoryMeta[`${v}`]).map((v) => {
        delay += 200;
        return new Promise<IModelVersion>((res, rej) => {
          setTimeout(() => {
            fetch(`${modelVersionApi}/${v}`).then(res => res.json()).then(data => {
              res(data);
            }).catch((e) => {
              rej(e);
            })
          }, delay);
        });
      });

      Promise.allSettled(metaPr).then((res) => {
        res.map((pr) => {
          if (pr.status === "fulfilled") {
            const modelVersion = pr.value
            if (modelVersion?.id) {
              state.downloadHistoryMeta[modelVersion.id] = {
                name: modelVersion.name,
                modelName: (modelVersion as any)?.model?.name,
                modelId: modelVersion.modelId,
                preview: modelVersion.images[0]
              }
            }
          }
        })
        chrome.storage.local.set({ downloadHistoryMeta: state.downloadHistoryMeta });
      }).then(() => {
        w.update((v) => {
          return {
            ...v,
            state,
          };
        });

        resolve(state);
      })
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
  const getState = () => {
    if (currentState.customState) {
      return { ...currentState.state, ...currentState.customState }
    }
  }

  return { ...w, set, update, getValue, getState };
};

export function parseExt(ext: string) {
  if (ext[0] === ".") {
    return ext.slice(1);
  }
  return ext;
}
export function getDownloadFolder(modelData: IModel, state: IState) {
  let folderName = "";

  if (state.groupByFolder) {
    const modelTypeName = state.modelTypes[modelData.type];

    if (modelTypeName) {
      folderName = `${modelTypeName}/`;
    }
  }
  return folderName;

}
export function downloadImages(data: IDownloadActionData, state: IState) {
  const modelName = data.name;
  let images = data.images;

  const folderName = getDownloadFolder(data.modelData, state);


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
      filename: `${folderName}${modelName}/${finalImageName}`
    })
  })
}


export async function fetchAllImages(url: string, modelVersionId: number, limit: number) {
  const allImages: any[] = [];
  let downloaded = 0;

  let ready = false;

  let totalUrl = `${url}?modelVersionId=${modelVersionId}`;

  try {
    while (!ready) {
      const modelReq: Response = await fetch(totalUrl);

      if (!modelReq.ok) {
        throw Error("Failed to fetch all images");
      }
      const modelImages: IImageResponce = await modelReq.json();
      const images = modelImages.items;

      images.some(() => {
        downloaded++;
        if (downloaded > limit) {
          ready = true;
          return false;
        }
      });
      
      allImages.push(...images);

      if (modelImages.metadata.nextPage) {
        totalUrl = modelImages.metadata.nextPage;
      } else {
        ready = true;
      }
    }

    return allImages;
  } catch (error) {
    messageStore.set({ status: "warning", message: "Error fetching images" });
    return null;
  }
}

export async function updateHistory({ modelData, modelVersion }: IDownloadActionData, state: IState) {
  if (!state.saveModel) {
    return;
  }
  const modelVersionId = modelVersion.id;

  const { downloadHistory = [], downloadHistoryMeta = {} } = await chrome.storage.local.get();

  if (downloadHistory.indexOf(modelVersionId) === -1) {
    downloadHistory.push(modelVersionId);
    downloadHistoryMeta[modelVersionId] = {
      name: modelVersion.name,
      modelName: modelData?.name,
      modelId: modelVersion.modelId,
      preview: modelVersion.images[0],
      date: new Date().valueOf(),
    }
    await chrome.storage.local.set({ downloadHistory, downloadHistoryMeta });
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

export async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

export async function getSettings(sendResponse: (value: any) => void
) {
  const settingsStore = getSettingsStore();
  await settingsStore.getValue().loading;
  const { state } = settingsStore.getValue();

  sendResponse(state);
}