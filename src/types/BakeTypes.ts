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
  initialDeltaValues: IngredientDeltaEntry;
  updatedDeltaValues: UpdatedBakeIngredient;
  completedBakeDeltaId: string | null;
}

export interface UpdatedBakeIngredient {
  updatedAmount: string;
  updatedName: string;
  updatedNotes: string | null;
  updatedOrder: number;
}

export interface BakeInstruction {
  bakeInstructionId: string;
  initialDeltaValues: InstructionDeltaEntry;
  updatedDeltaValues: UpdatedBakeInstruction;
  completedBakeDeltaId: string | null;
}

export interface UpdatedBakeInstruction {
  updatedDescription: string;
  updatedNotes: string | null;
  updatedOrder: number;
}

export interface UpdateBakePayload {
  bakeId: string,
  elevation: number | null | undefined,
  notes: string | null | undefined,
  ratings: BakeRating | null | undefined,
}

export interface UpdateBakeIngredientPayload {
  bakeIngredientId: string;
  amount: string;
  name: string;
  notes?: string | null;
  order: number;
}

export interface UpdateBakeInstructionPayload {
  bakeInstructionId: string;
  description: string;
  notes?: string | null;
  order: number;
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
  notes: string | null;
  createdAt: string;
  order: number;
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
  notes: string | null;
  order: number;
  createdAt: string;
}

export function completeBakePayloadToJson(payload: CompleteBakePayload) {
  return {
    set_deltas_as_best: payload.setDeltasAsBest
  };
}

function presentOrOmit<K extends string, V>(key: K, value: V | undefined): { [P in K]?: V } {
  return value === undefined ? {} : { [key]: value } as { [P in K]?: V };
}

export function updateBakePayloadToJson(payload: UpdateBakePayload) {
  return {
    bake_id: payload.bakeId,
    ...presentOrOmit("elevation", payload.elevation),
    ...presentOrOmit("notes", payload.notes),
    ...(payload.ratings !== undefined && {
      ratings: {
        ...presentOrOmit("overall", payload.ratings?.overall),
        ...presentOrOmit("taste", payload.ratings?.taste),
        ...presentOrOmit("texture", payload.ratings?.texture),
        ...presentOrOmit("appearance", payload.ratings?.appearance),
        ...presentOrOmit("rise_structure", payload.ratings?.riseStructure),
        ...presentOrOmit("difficulty", payload.ratings?.difficulty),
      },
    }),
  };
}

export function updateBakeIngredientPayloadToJson(payload: UpdateBakeIngredientPayload) {
  return {
    bake_ingredient_id: payload.bakeIngredientId,
    amount: payload.amount,
    name: payload.name,
    notes: payload.notes,
    order: payload.order,
  };
}

export function updateBakeInstructionPayloadToJson(payload: UpdateBakeInstructionPayload) {
  return {
    bake_instruction_id: payload.bakeInstructionId,
    description: payload.description,
    notes: payload.notes,
    order: payload.order,
  };
}
