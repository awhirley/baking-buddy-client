export interface Recipe {
  id: string;
  details: RecipeDetail;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface Ingredient {
  id: string;
  recipeId: string;
  bestVersion: number;
  notes: string | null;
  amount: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface Instruction {
  id: string;
  recipeId: string;
  bestVersion: number;
  notes: string | null;
  description: string;
  order: number;
  createdAt: string;
}

export interface RecipeDetail {
  id: string;
  name: string;
  description: string;
  recipeSourceType: string | null;
  recipeSource: string | null;
  tags: string[];
  tools: string[];
  createdAt: string;
  openBakeId: string | null;
  notes: string | null;
  difficulty: number | null;
  favorite: boolean;
}

export interface CreateIngredientPayload {
  amount: string;
  name: string;
}

export interface EditIngredientPayload {
  amount: string;
  name: string;
}

export interface EditInstructionPayload {
  description: string;
}

export interface CreateRecipePayload {
  name: string;
  description: string | null;
  recipeSourceType: string | null;
  recipeSource: string | null;
  tags: string[] | null;
  tools: string[] | null;
  ingredients: CreateIngredientPayload[];
  instructions: string[];
}

// TODO: reorganize and put this somewhere else
export function createRecipePayloadtoApiPayload(payload: CreateRecipePayload) {
  return {
    name: payload.name,
    description: payload.description,
    recipe_source_type: payload.recipeSourceType,
    recipe_source: payload.recipeSource,
    tags: payload.tags,
    tools: payload.tools,
    ingredients: payload.ingredients,
    instructions: payload.instructions,
  };
}

