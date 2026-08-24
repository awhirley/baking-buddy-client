import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../../services/RecipeService';
import { type RecipeDetail } from "../../types/Types"
import { H3 } from '../SharedComponents/ui/typography';
import { Recipe } from './RecipeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#components/SharedComponents/ui/card';
import { Skeleton } from '#components/SharedComponents/ui/skeleton';

export function RecipeList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipesList'],
    queryFn: async () => {
      const response = await recipeService.listRecipes();
      return response;
    }
  });

  return (
    <div>
      <H3 className="mb-4">Recipes</H3>
        {isLoading && <ListLoadingSkeleton /> }
        { (error !== null) ? <ListErrorView /> : data?.map((recipe: RecipeDetail) => (
          <Recipe recipe={recipe} />
        ))}
    </div>
  );
}

// TODO: make this better
function ListErrorView() {
  return (<>
    <Card className="mb-4 outline-1">
      <CardHeader>
        <CardTitle>Oh no!</CardTitle>
      </CardHeader>
      <CardContent>
        An error occured while loading the recipes. Please refresh to try again.
      </CardContent>
    </Card>
  </>)
}

function ListLoadingSkeleton() {
  return (<>
    <Card className="mb-4 outline-1">
      <CardHeader>
        <CardTitle><Skeleton className="h-4 w-1/4" /></CardTitle>
        <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
      </CardHeader>
    </Card>
  </>)
}