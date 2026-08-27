import axios from 'axios';
import { createRecipePayloadtoApiPayload, type CreateRecipePayload, type Recipe, type RecipeDetail } from '../types/RecipeTypes';
import { toCamelCase } from './utils';

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
    },

    async addNotesToRecipe(id: string, note: string | null): Promise<void> {
      await api.patch(`/recipes/notes/${id}`, note, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    },

    async addNotesToIngredient(id: string, note: string | null): Promise<void> {
      await api.patch(`/ingredients/notes/${id}`, note, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    },

    async addNotesToInstruction(id: string, note: string | null): Promise<void> {
      await api.patch(`/instructions/notes/${id}`, note, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    },
}