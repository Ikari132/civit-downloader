import { writable } from "svelte/store";
import type { IState } from "../types";

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

    saveModel: true,
    saveImages: true,
    saveGallery: false,

    saveFullData: true,
    saveVersionData: true,

    imagesLimit: 0,
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
      // chrome.storage.local.remove()
      const saveAll =
        result["save-all"] === undefined ? "true" : result["save-all"];
      const saveModel =
        result["save-model"] === undefined ? "true" : result["save-model"];

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