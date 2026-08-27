import { api } from './RecipeService'; // adjust path/name to wherever `api` is exported from
import type {
  Bake,
  BakeDetail,
  UpdateBakeInstructionPayload,
  UpdateBakeIngredientPayload,
  CompleteBakePayload,
} from '../types/BakeTypes';

export const bakeService = {
  async createBake(recipeId: string): Promise<Bake> {
    const response = await api.post<Bake>(`/bakes/recipe/${recipeId}`);
    return response.data;
  },

  async listBakes(recipeId: string): Promise<BakeDetail[]> {
    const response = await api.get<BakeDetail[]>(`/bakes/recipe/${recipeId}`);
    return response.data;
  },

  async listBakesWithProcedure(recipeId: string): Promise<Bake[]> {
    const response = await api.get<Bake[]>(`/bakes/recipe/${recipeId}/procedure`);
    return response.data;
  },

  async getBake(id: string): Promise<Bake> {
    const response = await api.get<Bake>(`/bakes/${id}`);
    return response.data;
  },

  async deleteBake(id: string): Promise<void> {
    await api.delete(`/bakes/${id}`);
  },

  async updateBakeInstruction(bakeId: string, args: UpdateBakeInstructionPayload): Promise<void> {
    await api.patch(`/bakes/${bakeId}/instruction`, args);
  },

  async updateBakeIngredient(bakeId: string, args: UpdateBakeIngredientPayload): Promise<void> {
    await api.patch(`/bakes/${bakeId}/ingredient`, args);
  },

  async completeBake(bakeId: string, args: CompleteBakePayload): Promise<void> {
    await api.patch(`/bakes/${bakeId}/complete`, args);
  },
};