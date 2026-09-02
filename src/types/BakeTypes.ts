export interface Bake {
  id: string;
  recipeId: string;
  details: BakeDetail;
  ingredientVersions: BakeIngredient[];
  instructionVersions: BakeInstruction[];
}

export interface BakeRating {
  overall: number | null;
  taste: number | null;
  texture: number | null;
  appearance: number | null;
  riseStructure: number | null;
  difficulty: number | null;
  createdAt: string;
}

export interface BakeDetail {
  id: string;
  recipeId: string;
  recipeName: string;
  elevation: number | null;
  notes: string | null;
  createdAt: string;
  startDatetime: string;
  endDatetime: string | null;
  ratings: BakeRating;
}

export interface BakeIngredient {
  bakeIngredientId: string;
  ingredientId: string;
  ingredientDeltaId: string | null;
  version: number | null;
  amount: string;
  name: string;
  notes: string | null;
}

export interface BakeInstruction {
  bakeInstructionId: string;
  instructionId: string;
  instructionDeltaId: string | null;
  version: number | null;
  description: string;
  notes: string | null;
}

export interface UpdateBakePayload {
  bakeId: string,
  elevation: number | null,
  notes: string | null,
  ratings: BakeRating | null,
}

export interface UpdateBakeIngredientPayload {
  bakeIngredientId: string;
  amount: string;
  name: string;
  notes?: string | null;
}

export interface UpdateBakeInstructionPayload {
  bakeInstructionId: string;
  description: string;
  notes?: string | null;
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

export function updateBakePayloadToJson(payload: UpdateBakePayload) {
  return {
    bake_id: payload.bakeId,
    elevation: payload.elevation,
    notes: payload.notes,
    ratings: {
      overall: payload.ratings?.overall,
      taste: payload.ratings?.taste,
      texture: payload.ratings?.texture,
      appearance: payload.ratings?.appearance,
      rise_structure: payload.ratings?.riseStructure,
      difficulty: payload.ratings?.difficulty,
    }
  };
}

export function updateBakeIngredientPayloadToJson(payload: UpdateBakeIngredientPayload) {
  return {
    bake_ingredient_id: payload.bakeIngredientId,
    amount: payload.amount,
    name: payload.name,
    notes: payload.notes
  };
}

export function updateBakeInstructionPayloadToJson(payload: UpdateBakeInstructionPayload) {
  return {
    bake_instruction_id: payload.bakeInstructionId,
    description: payload.description,
    notes: payload.notes
  };
}
