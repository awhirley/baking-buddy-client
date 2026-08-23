import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import { skipToken, useQuery } from "@tanstack/react-query";

import { RecipeSkeleton } from "./RecipeSkeleton";
import { Alert, AlertDescription, AlertTitle } from "#components/ui/alert";
import { recipeService } from "../../services/RecipeService";
import { RecipeDetailsCard } from "./DetailSection";
import { IngredientsSection } from "./IngredientsSection";
import { InstructionsSection } from "./InstructionsSection";

export function Recipe() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe", id],
    queryFn: id
      ? async () => {
          const response = await recipeService.getRecipeById(id!);
          return response;
        }
      : skipToken,
  });

  return (
    <div className="w-full max-w-3xl">
      {isLoading && <RecipeSkeleton />}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Couldn't load this recipe</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Something went wrong. Try refreshing the page."}
          </AlertDescription>
        </Alert>
      )}

      {data && (
        <div className="flex flex-col gap-6">
          <RecipeDetailsCard {...data.details} />

          <IngredientsSection ingredients={data.ingredients} />

          <InstructionsSection instructions={data.instructions} />
        </div>
      )}
    </div>
  );
}
