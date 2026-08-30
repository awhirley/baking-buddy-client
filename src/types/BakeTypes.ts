export interface Bake {
  id: string;
  recipeId: string;
  details: BakeDetail;
  ingredientVersions: BakeIngredient[];
  instructionVersions: BakeInstruction[];
}

export interface BakeDetail {
  id: string;
  recipeId: string;
  elevation: number | null;
  notes: string | null;
  createdAt: string;
  startDatetime: string;
  endDatetime: string | null;
}

export interface BakeIngredient {
  ingredientId: string;
  ingredientDeltaId: string | null;
  version: number | null;
  amount: string;
  name: string;
}

export interface BakeInstruction {
  instructionId: string;
  instructionDeltaId: string | null;
  version: number | null;
  description: string;
}

export interface UpdateBakeIngredientPayload {
  deltaId: string,
  amount: string,
  name: string,
}

export interface UpdateBakeInstructionPayload {
  deltaId: string,
  description: string,
}

export interface CompleteBakePayload {
  setDeltasAsBest: boolean;
}

export interface IngredientHistory {
  id: string;
  recipeId: string;
  bestVersion: number;
  history: IngredientDeltaEntry[];
}

export interface IngredientDeltaEntry {
  id: string;
  ingredientId: string;
  version: number;
  amount: string;
  name: string;
  createdAt: string;
}

export interface InstructionHistory {
  id: string;
  recipeId: string;
  bestVersion: number;
  history: InstructionDeltaEntry[];
}

export interface InstructionDeltaEntry {
  id: string;
  instructionId: string;
  version: number;
  description: string;
  createdAt: string;
}

export function completeBakePayloadToJson(payload: CompleteBakePayload) {
  return {
    set_deltas_as_best: payload.setDeltasAsBest
  };
}