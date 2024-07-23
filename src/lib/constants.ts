import type { IState } from "../types";

export const modelApi = "https://civitai.com/api/v1/models";
export const modelVersionApi = "https://civitai.com/api/v1/model-versions";
export const imageApi = "https://civitai.com/api/v1/images";

export const modelTypes = {
  Checkpoint: "Checkpoint",
  TextualInversion: "TextualInversion",
  Hypernetwork: "Hypernetwork",
  AestheticGradient: "AestheticGradient",
  LORA: "LORA",
  LoCon: "LoCon",
  Controlnet: "Controlnet",
  Upscaler: "Upscaler",
  MotionModule: "MotionModule",
  VAE: "VAE",
  Poses: "Poses",
  Wildcards: "Wildcards",
  Workflows: "Workflows",
  Other: "Other"
}

export const currentVersion = "1.5.3";

export const CHANGELOG = {
  "1.5.3":[
    {
      text:"Added errors notification"
    }
  ]
}

export const DEFAULT_STATE: IState = {
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
  modelTypes,
  groupByFolder: false,

  ui: {
    folderNamesVisible: true,
  },

  whatsnewVersion: null
};