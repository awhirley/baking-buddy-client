import { useQuery } from '@tanstack/react-query';
import { recipeService, type Recipe } from '../services/RecipeService';

export function RecipeList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipesList'],
    queryFn: async () => {
      const response = await recipeService.listRecipes();
      return response;
    }
  });

  console.log('isLoading', isLoading);
  console.log('data', data);

  return (
    <div>
      <h2>Recipes</h2>
        {data?.map((recipe: Recipe) => (
          <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <p>{recipe.description}</p>
          </div>
        ))}
    </div>
  );
}