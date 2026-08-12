import axios from 'axios';
import { createRecipePayloadtoApiPayload, type CreateRecipePayload, type Recipe, type RecipeDetail } from '../types/Recipe';

const recipeServiceApi = `${import.meta.env.VITE_API_URL}/api`;

export const api = axios.create({
  baseURL: recipeServiceApi,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const recipeService = {
    async listRecipes(): Promise<Recipe[]> {
      const response = await api.get<Recipe[]>('/recipes');
      return response.data;
    },

    async createRecipe(args: CreateRecipePayload): Promise<RecipeDetail[]> {
      const response = await api.post<RecipeDetail[]>('/recipes', createRecipePayloadtoApiPayload(args));
      return response.data;
    },
}