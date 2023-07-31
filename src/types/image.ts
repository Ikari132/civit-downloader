export interface IImage {
  id: number;
  url: string;
  hash: string;
  width: number;
  height: number;
  nsfw: boolean;
  nsfwLevel: TNSFWLevel;
  createdAt: Date;
  postId: number;
  stats: IImageStats;
  meta: Record<string, any>;
  username: string;
}
export type TNSFWLevel = "None" | "Soft" | "Mature" | "X";
export interface IImageStats {
  cryCount: number;
  laughCount: number;
  likeCount: number;
  heartCount: number;
  commentCount: number;
}
export interface IImageMetadata {
  nextCursor: number;
  nextPage: string;
  currentPage?: number;
  pageSize?: number;
}
export interface IImageResponce {
  items: IImage[];
  metadata: IImageMetadata;
}