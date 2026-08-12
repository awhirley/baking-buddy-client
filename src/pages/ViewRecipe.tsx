import { useParams } from "react-router-dom";
import { Header } from "../components/HomePage/Header";
import { recipeService } from "../services/RecipeService";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { Instruction } from "../types/Types";

export function ViewRecipe() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['recipesList'],
    queryFn: id ? async () => {
      const response = await recipeService.getRecipeById(id!);
      return response;
    } : skipToken
  });

  data?.name
  const instructions = data?.instructions?.map((v: Instruction) => v.description);
  
  return (
    <div className="px-30 py-20">
      <div className="grid grid-cols-1 gap-4 justify-items-center">
        <Header />
        View Recipe! for id: {id}

        {data?.name}
        {instructions}
      </div>
    </div>
  );
}