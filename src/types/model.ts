export interface IModel {
  id: number;
  name: string;
  description: string | null;
  type: string;
  poi: boolean;
  nsfw: boolean;
  allowNoCredit: boolean;
  allowCommercialUse: string;
  allowDerivatives: boolean;
  allowDifferentLicense: boolean;
  stats: IStats;
  creator: ICreatorInfo;
  tags: string[];
  modelVersions: IModelVersion[];
}

export interface IModelVersion {
  id: number;
  modelId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  trainedWords: any[]; // You could replace 'any[]' with the appropriate type
  baseModel: string;
  earlyAccessTimeFrame: number;
  description: string | null;
  downloadUrl: string;
  stats: {
    downloadCount: number;
    ratingCount: number;
    rating: number;
  };
  files: {
    name: string;
    id: number;
    sizeKB: number;
    type: string;
    metadata: {
      fp: any; // You could replace 'any' with the appropriate type
      size: any; // You could replace 'any' with the appropriate type
      format: string;
    };
    pickleScanResult: string;
    pickleScanMessage: string;
    virusScanResult: string;
    scannedAt: string;
    hashes: {
      AutoV1: string;
      AutoV2: string;
      SHA256: string;
      CRC32: string;
      BLAKE3: string;
    };
    downloadUrl: string;
    primary: boolean;
  }[];
  images: {
    url: string;
    nsfw: string;
    width: number;
    height: number;
    hash: string;
    meta: {
      ENSD: string;
      Size: string;
      seed: number;
      Model: string;
      steps: number;
      Script: string;
      'X Type': string;
      'Y Type': string;
      hashes: {
        model: string
      };
      prompt: string;
      sampler: string;
      'X Values': string;
      'Y Values': string;
      cfgScale: number;
      clipSkip: number;
      resources: {
        hash: string;
        name: string;
        type: string;
        weight: any; // You could replace 'any' with the appropriate type
      }[];
      'Model hash': string;
      'AddNet Enabled': string;
      'AddNet Model 1': string;
      'AddNet Weight A 1': string;
      'AddNet Weight B 1': string;
      negativePrompt: string;
      'AddNet Module 1': string;
    };
  }[];
}

export interface ICreatorInfo {
  username: string;
  image: string;
}

export interface IStats {
  downloadCount: number;
  favoriteCount: number;
  commentCount: number;
  ratingCount: number;
  rating: number;
}

