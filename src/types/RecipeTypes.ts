export interface Recipe {
  id: string;
  details: RecipeDetail;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface Ingredient {
  id: string;
  amount: string;
  name: string;
}

export interface Instruction {
  id: string;
  description: string;
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
}

export interface CreateIngredientPayload {
  amount: string;
  name: string;
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
