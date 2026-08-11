import axios from 'axios';

const recipeServiceApi = `${import.meta.env.VITE_API_URL}/api`;

export const api = axios.create({
  baseURL: recipeServiceApi,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type Recipe = {
  id: string;
  name: string;
  description: string;
  createdAt: string | null;
};

export type CreateRecipeArgs = {
  name: string;
  description: string;
};

export const recipeService = {
    async listRecipes(): Promise<Recipe[]> {
      const response = await api.get<Recipe[]>('/recipes');
      return response.data;
    },

    async createRecipe(args: CreateRecipeArgs): Promise<Recipe[]> {
      const response = await api.post<Recipe[]>('/recipes', args);
      return response.data;
    },
}