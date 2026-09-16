import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sword } from "lucide-react";

import { Rating } from "#components/SharedComponents/ui/rating";
import { recipeService } from "../../services/RecipeService";
import { useToast } from "../../contexts/ToastContext";
import type { UpdateRecipePayload } from "../../types/RecipeTypes";

export function UpdateDifficultyTrigger({
  recipeId,
  difficultyRating,
  readOnly,
}: {
  recipeId: string;
  difficultyRating: number | null | undefined;
  readOnly: boolean;
}) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { mutate: updateDifficulty } = useMutation({
    mutationFn: (value: number | undefined) => {
      const payload: UpdateRecipePayload = {
        name: undefined,
        description: undefined,
        recipeSourceType: undefined,
        recipeSource: undefined,
        tags: undefined,
        tools: undefined,
        favorite: undefined,
        prepTime: undefined,
        bakeTime: undefined,
        difficultyRating: value,
      };

      return recipeService.updateRecipe(recipeId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
    },
    onError: () => {
      addToast("Failed to update difficulty", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  return (
    <Rating
      readOnly={readOnly}
      value={difficultyRating ? Number(difficultyRating) : undefined}
      onValueChange={(value) => updateDifficulty(value)}
      icon={<Sword />}
    />
  );
}