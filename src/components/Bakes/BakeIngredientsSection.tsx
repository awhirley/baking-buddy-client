// components/Bake/BakeIngredientsSection.tsx
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Pencil, StickyNote } from "lucide-react";
import { Separator } from "#components/SharedComponents/ui/separator";
import type { BakeIngredient } from "../../types/BakeTypes";

function isModified({ version, ingredientDeltaId }: BakeIngredient) {
  return version === null && ingredientDeltaId === null;
}

export function BakeIngredientsSection({ ingredients }: { ingredients: BakeIngredient[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.ingredientId}>
            <div className="flex items-center justify-between py-2 gap-4">
              <span className="text-sm flex items-center gap-2">
                <span>
                  <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
                </span>
                {isModified(ingredient) && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    Modified this bake
                  </Badge>
                )}
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