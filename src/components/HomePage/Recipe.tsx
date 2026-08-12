
import { type Recipe } from '../../services/RecipeService';
import { Button } from '#components/ui/button';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '#components/ui/card';

export function Recipe({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
         <CardAction className="flex flex-row gap-x-4">
          <Button variant="outline" size="sm" onClick={() => console.log("New!")}>
            New Bake
          </Button>
          <Button size="sm" onClick={() => console.log("View!")}>
            View Recipe
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}