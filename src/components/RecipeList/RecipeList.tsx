import { useQuery } from '@tanstack/react-query';
import { recipeService } from '../../services/RecipeService';
import { type RecipeDetail } from "../../types/RecipeTypes"
import { H3 } from '../SharedComponents/ui/typography';
import { Recipe } from './RecipeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#components/SharedComponents/ui/card';
import { Skeleton } from '#components/SharedComponents/ui/skeleton';
import { useRecipeFilters } from './useRecipeFilters';
import { RecipeFilterSidebar } from './RecipeFilterSidebar';

export function RecipeList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipesList'],
    queryFn: async () => {
      const response = await recipeService.listRecipes();
      return response;
    }
  });

  const { filters, setFilters, bounds, filteredRecipes, activeFilterCount } = useRecipeFilters(data);
  const hasActiveSearchOrFilters = activeFilterCount > 0 || filters.search.trim().length > 0;

  return (
    <div>
      <H3 className="mb-4">Recipes</H3>
      <div className="flex gap-6">
        <RecipeFilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          bounds={bounds}
          activeFilterCount={activeFilterCount}
        />

        <div className="flex-1">
          {isLoading && <ListLoadingSkeleton />}
          {filteredRecipes?.length === 0 && !isLoading && (
            <EmptyView hasActiveFilters={hasActiveSearchOrFilters} />
          )}
          {error !== null && <ListErrorView />}
          {filteredRecipes && filteredRecipes.length > 0 &&
            filteredRecipes.map((recipe: RecipeDetail) => <Recipe key={recipe.id} recipe={recipe} />)}
        </div>
      </div>
    </div>
  );
}

function EmptyView({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <Card className="mb-4 outline-1">
      <CardHeader>
        <CardTitle>{hasActiveFilters ? "No matching recipes" : "No recipes yet"}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {hasActiveFilters
          ? "Try adjusting your search or filters."
          : "Create a recipe to see it show up here."}
      </CardContent>
    </Card>
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