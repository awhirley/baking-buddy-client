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
  const nameChanged = ingredient.initialDeltaValues.name !== ingredient.updatedDeltaValues.updatedName;
  const amountChanged = ingredient.initialDeltaValues.amount !== ingredient.updatedDeltaValues.updatedAmount;
  const notesChanged = ingredient.initialDeltaValues.notes !== ingredient.updatedDeltaValues.updatedNotes;

  const effectiveName = ingredient.updatedDeltaValues.updatedName;
  const effectiveAmount = ingredient.updatedDeltaValues.updatedAmount;
  const effectiveNotes = ingredient.updatedDeltaValues.updatedNotes;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col py-2 gap-4">
        <span className="text-sm flex flex-col gap-0.5">
          {(nameChanged || amountChanged) && (
            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
              <span className="pr-3">{ingredient.initialDeltaValues.amount}</span> {ingredient.initialDeltaValues.name}
            </span>
          )}
          <span className="flex flex-row gap-3">
            <span className="font-medium bold">{effectiveAmount}</span> {effectiveName}
          </span>
        </span>
      </div>

      {notesChanged && ingredient.initialDeltaValues.notes && (
        <p className="text-sm text-muted-foreground/60 italic line-through decoration-muted-foreground/50">
          {ingredient.initialDeltaValues.notes}
        </p>
      )}
      {effectiveNotes && (
        <p className="text-sm text-muted-foreground italic pb-4">{effectiveNotes}</p>
      )}
    </div>
  );
}