export interface IAction {
  name: string;
  data?: Record<string, any>;
}

export type TImageSize = "preview" | "original";
export type TImageName = "model" | "original";

export interface IState {
  imageSize: TImageSize;
  imageName: TImageName;

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
}