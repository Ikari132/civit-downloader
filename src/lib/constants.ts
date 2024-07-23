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

export const currentVersion = "1.5.4";

export const CHANGELOG = {
  "1.5.3":[
    {
      text:"Added errors notification"
    }
  ],
  "1.5.4":[
    {
      text:"Fixed an issue where training_data.zip was downloaded instead of the model file"
    }
  ]
}