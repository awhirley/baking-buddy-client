import { useQuery } from '@tanstack/react-query';
import { recipeService, type Recipe as RecipeType } from '../../services/RecipeService';
import { H3 } from './../ui/typography';
import { Recipe } from './Recipe';

export function RecipeList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipesList'],
    queryFn: async () => {
      const response = await recipeService.listRecipes();
      return response;
    }
  });

  // TODO: Handle loading and error states

  return (
    <div>
      <H3 className="mb-4">Recipes</H3>
        {data?.map((recipe: RecipeType) => (
          <Recipe recipe={recipe} />
        ))}
    </div>
  );
}