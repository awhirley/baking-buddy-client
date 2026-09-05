import axios from 'axios';
import { createRecipePayloadtoApiPayload, type CreateRecipePayload, type UpdateIngredientPayload, type UpdateInstructionPayload, type Recipe, type RecipeDetail, type UpdateRecipePayload, updatedRecipePayloadtoApiPayload } from '../types/RecipeTypes';
import { toCamelCase } from './utils';
import type { IngredientHistory, InstructionHistory } from '../types/BakeTypes';

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

    async updateRecipe(id: string, args: UpdateRecipePayload): Promise<Recipe> {
      const response = await api.patch<Recipe>(`/recipes/${id}`, updatedRecipePayloadtoApiPayload(args));
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

    async updateIngredient(id: string, args: UpdateIngredientPayload): Promise<Recipe> {
      const response = await api.patch<Recipe>(`/ingredients/${id}`, args);
      return response.data;
    },

    async updateInstruction(id: string, args: UpdateInstructionPayload): Promise<Recipe> {
      const response = await api.patch<Recipe>(`/instructions/${id}`, args);
      return response.data;
    },

    async getIngredientHistory(ingredientId: string): Promise<IngredientHistory> {
      const response = await api.get<IngredientHistory>(`/ingredients/history/${ingredientId}`);
      return response.data;
    },

    async getInstructionHistory(instructionId: string): Promise<InstructionHistory> {
      const response = await api.get<InstructionHistory>(`/instructions/history/${instructionId}`);
      return response.data;
    },
}