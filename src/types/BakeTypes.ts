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
  startDatetime: string; // TODO: should this be nullable?
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
