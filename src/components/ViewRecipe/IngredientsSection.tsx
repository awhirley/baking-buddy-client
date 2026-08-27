import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Pencil, StickyNote } from "lucide-react";
import type { Ingredient } from "../../types/RecipeTypes";
import { Separator } from "#components/SharedComponents/ui/separator";

export function IngredientsSection({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id}>
            <div className="flex items-center justify-between py-2 gap-4">
              <span className="text-sm">
                <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
              </span>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" aria-label="Add note">
                  <StickyNote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Edit ingredient">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {index < ingredients.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
