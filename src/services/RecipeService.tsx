import axios from 'axios';
import { createRecipePayloadtoApiPayload, type CreateRecipePayload, type Recipe, type RecipeDetail } from '../types/Types';
import { toCamelCase } from './caseConversion';

const recipeServiceApi = `${import.meta.env.VITE_API_URL}/api`;

export const api = axios.create({
  baseURL: recipeServiceApi,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use((response) => {
  response.data = toCamelCase(response.data);
  return response;
});

export const recipeService = {
    async listRecipes(): Promise<RecipeDetail[]> {
      const response = await api.get<RecipeDetail[]>('/recipes');
      return response.data;
    },

    async createRecipe(args: CreateRecipePayload): Promise<Recipe> {
      const response = await api.post<Recipe>('/recipes', createRecipePayloadtoApiPayload(args));
      return response.data;
    },

    async getRecipeById(id: string): Promise<Recipe> {
      const response = await api.get<Recipe>(`/recipes/${id}`);
      return response.data;
    },

    async deleteRecipe(id: string): Promise<void> {
      await api.delete(`/recipes/${id}`);
    }
}