export interface Recipe {
  id: string;
  details: RecipeDetail;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface Ingredient {
  id: string;
  recipeId: string;
  version: number;
  notes: string | null;
  amount: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface Instruction {
  id: string;
  recipeId: string;
  version: number;
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
  difficultyRating: number | null;
  favorite: boolean;
}

export interface CreateIngredientPayload {
  amount: string;
  name: string;
}

export interface UpdateIngredientPayload {
  amount: string;
  name: string;
  notes: string | null;
  order: number;
}

export interface UpdateInstructionPayload {
  description: string;
  notes: string | null;
  order: number;
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

export interface UpdateRecipePayload {
  name: string | undefined;
  description: string | null | undefined;
  recipeSourceType: string | null | undefined;
  recipeSource: string | null | undefined;
  tags: string[] | undefined;
  tools: string[] | undefined;
  favorite: boolean | null | undefined;
  difficultyRating: number | null | undefined;
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

function presentOrOmit<K extends string, V>(key: K, value: V | undefined): { [P in K]?: V } {
  return value === undefined ? {} : { [key]: value } as { [P in K]?: V };
}

export function updatedRecipePayloadtoApiPayload(payload: UpdateRecipePayload) {
  return {
    ...presentOrOmit("name", payload.name),
    ...presentOrOmit("description", payload.description),
    ...presentOrOmit("recipe_source_type", payload.recipeSourceType),
    ...presentOrOmit("recipe_source", payload.recipeSource),
    ...presentOrOmit("tags", payload.tags),
    ...presentOrOmit("tools", payload.tools),
    ...presentOrOmit("favorite", payload.favorite),
    ...presentOrOmit("difficulty_rating", payload.difficultyRating),
  };
}
