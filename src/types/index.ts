import type { IModel, IModelVersion } from "./model";
import type { modelTypes } from "./../lib/constants";

export interface IAction {
  name: string;
  data?: Record<string, any>;
}

export type TAction = IDownloadAction | IShowOptionsAction | ICheckHistoryAction | IGetSettingsAction;

export interface IDownloadAction {
  name: "download";
  data: IDownloadActionData;
}
export interface IShowOptionsAction {
  name: "showOptions";
}
export interface ICheckHistoryAction {
  name: "checkHistory";
  data: {
    modelId: string;
    versionId: string;
  }
}
export interface IGetSettingsAction {
  name: "getSettings";
}
export interface IDownloadActionData {
  modelData: IModel;
  modelVersion: IModelVersion;
  blobURL: string;
  versionBlobURL: string;
  modelURL: string;
  name: string;
  fileName: string;
  images: string[];
  galleryImages: string[];
  creatorImages: string[];

}

export type TImageSize = "preview" | "original";
export type TImageName = "model" | "original";

export interface IState {
  imageSize: TImageSize;
  imageName: TImageName;
  imageFrom: "creator" | "gallery" | "all" | "model";

  saveModel: boolean;
  saveImages: boolean;
  saveGallery: boolean;

  saveFullData: boolean;
  saveVersionData: boolean;

  imagesLimit: number;
  galleryLimit: number;

  fullDataExt: string;
  versionDataExt: string;

  downloadHistory: string[];
  downloadHistoryMeta: Record<string, any>;
  modelTypes: typeof modelTypes;
  groupByFolder: boolean;

  ui: {
    folderNamesVisible: boolean;
  },

  whatsnewVersion: string;
}

