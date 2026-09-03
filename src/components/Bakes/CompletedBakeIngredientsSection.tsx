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
  const nameChanged = ingredient.updatedName !== null;
  const amountChanged = ingredient.updatedAmount !== null;
  const notesChanged = ingredient.updatedNotes !== null || ingredient.notesUpdatedToNull;

  const effectiveName = ingredient.updatedName ?? ingredient.name;
  const effectiveAmount = ingredient.updatedAmount ?? ingredient.amount;
  const effectiveNotes = notesChanged ? ingredient.updatedNotes : ingredient.notes;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col py-2 gap-4">
        <span className="text-sm flex flex-col gap-0.5">
          {(nameChanged || amountChanged) && (
            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
              {ingredient.amount} {ingredient.name}
            </span>
          )}
          <span>
            <span className="font-medium">{effectiveAmount}</span> {effectiveName}
          </span>
        </span>
      </div>

      {notesChanged && ingredient.notes && (
        <p className="text-sm text-muted-foreground/60 italic line-through decoration-muted-foreground/50">
          {ingredient.notes}
        </p>
      )}
      {effectiveNotes && (
        <p className="text-sm text-muted-foreground italic pb-4">{effectiveNotes}</p>
      )}
    </div>
  );
}