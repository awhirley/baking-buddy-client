import type { BakeDetail, IngredientHistory, InstructionHistory } from '../types/BakeTypes';
import { api } from './RecipeService';

export const deltaService = {
  async getIngredientHistory(ingredientId: string): Promise<IngredientHistory> {
    const response = await api.get<IngredientHistory>(`/ingredients/history/${ingredientId}`);
    return response.data;
  },

  async getInstructionHistory(instructionId: string): Promise<InstructionHistory> {
    const response = await api.get<InstructionHistory>(`/instructions/history/${instructionId}`);
    return response.data;
  },

  async getBakesByIngredientDeltaId(ingredientDeltaId: string): Promise<BakeDetail[]> {
    const response = await api.get<BakeDetail[]>(`/ingredients/history/${ingredientDeltaId}/bakes`);
    return response.data;
  },

  async getBakesByInstructionDeltaId(instructionDeltaId: string): Promise<BakeDetail[]> {
    const response = await api.get<BakeDetail[]>(`/instructions/history/${instructionDeltaId}/bakes`);
    return response.data;
  },
}