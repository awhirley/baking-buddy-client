import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Separator } from "#components/SharedComponents/ui/separator";

import type { BakeIngredient } from "../../types/BakeTypes";

export function CompletedBakeIngredientsSection({
  ingredients,
}: {
  ingredients: BakeIngredient[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.bakeIngredientId}>
            <BakeIngredientRow ingredient={ingredient} />
            {index < ingredients.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function BakeIngredientRow({ ingredient }: { ingredient: BakeIngredient }) {
  console.log(ingredient);
  const effectiveName = ingredient.updatedName ?? ingredient.name;
  const effectiveAmount = ingredient.updatedAmount ?? ingredient.amount;
  const effectiveNotes = (ingredient.updatedNotes || ingredient.notesUpdatedToNull) ? ingredient.updatedNotes : ingredient.notes;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between py-2 gap-4">
        <span className="text-sm flex items-center gap-2">
          <span>
            <span className="font-medium">{effectiveAmount}</span> {effectiveName}
          </span>
        </span>
      </div>

      {effectiveNotes && (
        <p className="text-sm text-muted-foreground italic pb-4">{effectiveNotes}</p>
      )}
    </div>
  );
}