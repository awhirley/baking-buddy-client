export interface UploadBakeImageResponse {
  path: string;
  imageUrl: string;
}

export interface BakeImage {
  id: string;
  bakeId: string;
  path: string;
  imageUrl: string;
  createdAt: string;
}