import type { BakeImage, UploadBakeImageResponse } from '../types/BakeStorageTypes';
import { api } from './RecipeService';

export const BakeStorageService = {
  async uploadBakeImage(bakeId: string, file: File): Promise<UploadBakeImageResponse> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post<UploadBakeImageResponse>(`/bakes/${bakeId}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      path: response.data.path,
      imageUrl: response.data.imageUrl,
    };
  },

  async listBakeImages(bakeId: string): Promise<BakeImage[]> {
    const response = await api.get<BakeImage[]>(`/bakes/${bakeId}/image`);
    return response.data;
  }
}