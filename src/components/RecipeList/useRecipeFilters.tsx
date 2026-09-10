import { useMemo, useState } from "react";
import type { RecipeDetail } from "../../types/RecipeTypes";

export type NumberRange = [number, number];

export interface RecipeFilters {
  search: string;
  tags: string[];
  tools: string[];
  // null = filter not active (full range). Non-null = user has narrowed the slider.
  difficultyRange: NumberRange | null;
  prepTimeRange: NumberRange | null;
  bakeTimeRange: NumberRange | null;
}

export const DIFFICULTY_BOUNDS: NumberRange = [1, 5];

export const EMPTY_FILTERS: RecipeFilters = {
  search: "",
  tags: [],
  tools: [],
  difficultyRange: null,
  prepTimeRange: null,
  bakeTimeRange: null,
};

export interface RecipeFilterBounds {
  difficulty: NumberRange;
  // null if no recipe currently has this field set — hide that slider entirely.
  prepTime: NumberRange | null;
  bakeTime: NumberRange | null;
}

function numericBounds(values: number[]): NumberRange | null {
  if (values.length === 0) return null;
  return [Math.min(...values), Math.max(...values)];
}

export function useRecipeFilters(recipes: RecipeDetail[] | undefined) {
  const [filters, setFilters] = useState<RecipeFilters>(EMPTY_FILTERS);

  // Bounds are always computed from the full unfiltered list, so the sliders'
  // min/max don't shrink as the user narrows other filters.
  const bounds: RecipeFilterBounds = useMemo(() => {
    const prepTimes = (recipes ?? [])
      .map((r) => r.prepTime)
      .filter((v): v is number => v != null);
    const bakeTimes = (recipes ?? [])
      .map((r) => r.bakeTime)
      .filter((v): v is number => v != null);

    return {
      difficulty: DIFFICULTY_BOUNDS,
      prepTime: numericBounds(prepTimes),
      bakeTime: numericBounds(bakeTimes),
    };
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    if (!recipes) return recipes;

    return recipes.filter((recipe) => {
      if (filters.search.trim().length > 0) {
        const query = filters.search.trim().toLowerCase();
        const matchesName = recipe.name.toLowerCase().includes(query);
        const matchesDescription = (recipe.description ?? "").toLowerCase().includes(query);
        if (!matchesName && !matchesDescription) return false;
      }

      if (filters.tags.length > 0) {
        const recipeTags = recipe.tags ?? [];
        if (!filters.tags.every((tag) => recipeTags.includes(tag))) return false;
      }

      if (filters.tools.length > 0) {
        const recipeTools = recipe.tools ?? [];
        if (!filters.tools.every((tool) => recipeTools.includes(tool))) return false;
      }

      // A recipe with no difficulty set is excluded once the user narrows this
      // filter away from the full 1-5 range — there's nothing to match against.
      if (filters.difficultyRange) {
        const [min, max] = filters.difficultyRange;
        if (recipe.difficultyRating == null || recipe.difficultyRating < min || recipe.difficultyRating > max) return false;
      }

      if (filters.prepTimeRange) {
        const [min, max] = filters.prepTimeRange;
        if (recipe.prepTime == null || recipe.prepTime < min || recipe.prepTime > max) {
          return false;
        }
      }

      if (filters.bakeTimeRange) {
        const [min, max] = filters.bakeTimeRange;
        if (recipe.bakeTime == null || recipe.bakeTime < min || recipe.bakeTime > max) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, filters]);

  const activeFilterCount =
    filters.tags.length +
    filters.tools.length +
    (filters.difficultyRange ? 1 : 0) +
    (filters.prepTimeRange ? 1 : 0) +
    (filters.bakeTimeRange ? 1 : 0);

  return { filters, setFilters, bounds, filteredRecipes, activeFilterCount };
}