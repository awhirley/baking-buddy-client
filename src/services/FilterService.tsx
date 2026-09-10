import { api } from './RecipeService';

export const filterService = {
  async listTags(): Promise<string[]> {
    const response = await api.get<string[]>("/tags");
    return response.data;
  },

  async listTools(): Promise<string[]> {
    const response = await api.get<string[]>("/tools");
    return response.data;
  }
}