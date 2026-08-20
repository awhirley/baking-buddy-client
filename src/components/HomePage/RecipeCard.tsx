import { useNavigate } from "react-router-dom";

import { type RecipeDetail } from '../../types/Types';
import { Button } from '#components/ui/button';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '#components/ui/card';

export function Recipe({ recipe }: { recipe: RecipeDetail }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
         <CardAction className="flex flex-row gap-x-4">
          <Button variant="outline" size="sm" onClick={() => console.log("New!")}>
            New Bake
          </Button>
          <Button size="sm" onClick={() => navigate(`/view/${recipe.id}`)}>
            View Recipe
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}