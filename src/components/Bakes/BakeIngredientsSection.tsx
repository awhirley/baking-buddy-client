import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { History, Pencil, PencilSparklesIcon, StickyNote } from "lucide-react";

import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Input } from "#components/SharedComponents/ui/input";
import { Separator } from "#components/SharedComponents/ui/separator";
import { Spinner } from "#components/SharedComponents/ui/spinner";
import { Textarea } from "#components/SharedComponents/ui/textarea";

import { useToast } from "../../contexts/ToastContext";
import type { BakeIngredient } from "../../types/BakeTypes";
import { bakeService } from "../../services/BakeService";

function ingredientIsModified(ingredient: BakeIngredient) {
  const amountIsModified = ingredient.initialDeltaValues.amount !== ingredient.updatedDeltaValues.updatedAmount;
  const nameIsModified = ingredient.initialDeltaValues.name !== ingredient.updatedDeltaValues.updatedName;
  return amountIsModified || nameIsModified;
}

function noteIsModified(ingredient: BakeIngredient) {
  return ingredient.initialDeltaValues.notes !== ingredient.updatedDeltaValues.updatedNotes;
}

export function BakeIngredientsSection({
  bakeId,
  ingredients,
}: {
  bakeId: string;
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
            <BakeIngredientRow bakeId={bakeId} ingredient={ingredient} />
            {index < ingredients.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function BakeIngredientRow({ bakeId, ingredient }: { bakeId: string; ingredient: BakeIngredient }) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const ingredientModified = ingredientIsModified(ingredient);
  const noteModified = noteIsModified(ingredient);

  const effectiveName = ingredient.updatedDeltaValues.updatedName;
  const effectiveAmount = ingredient.updatedDeltaValues.updatedAmount;
  const effectiveNotes = ingredient.updatedDeltaValues.updatedNotes;

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(effectiveNotes);

  const [isEditingIngredient, setIsEditingIngredient] = useState(false);
  const [nameDraft, setNameDraft] = useState(effectiveName);
  const [amountDraft, setAmountDraft] = useState(effectiveAmount);

  const [showOriginal, setShowOriginal] = useState(false);

  const { mutate: editIngredient, isPending: isSavingIngredient } = useMutation({
    mutationFn: ({ name, amount }: { name: string; amount: string }) =>
      bakeService.updateBakeIngredient(bakeId, {
        bakeIngredientId: ingredient.bakeIngredientId,
        amount,
        name,
        order: ingredient.updatedDeltaValues.updatedOrder,
        // notes intentionally omitted — leaves notes untouched on the backend (PatchField.Absent)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bake", bakeId] });
      addToast("Ingredient updated", null, { type: "default" });
      setIsEditingIngredient(false);
      setShowOriginal(false);
    },
    onError: () => {
      addToast("Failed to update ingredient", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const { mutate: saveNote, isPending: isSavingNote } = useMutation({
    mutationFn: ({ note }: { note: string | null }) =>
      bakeService.updateBakeIngredient(bakeId, {
        bakeIngredientId: ingredient.bakeIngredientId,
        // send the current *effective* amount/name back unchanged so a note-only save can't
        // accidentally look like a revert-to-original for an already-modified ingredient
        amount: effectiveAmount,
        name: effectiveName,
        notes: note,
        order: ingredient.updatedDeltaValues.updatedOrder,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bake", bakeId] });
      addToast("Note saved successfully", "and it's a good note, too.", { type: "default" });
      setIsEditingNote(false);
    },
    onError: () => {
      addToast("Failed to save note", "Please try again :(", { type: "destructive", duration: 6000 });
    },
  });

  function openNoteEditor() {
    setNoteDraft(effectiveNotes);
    setIsEditingIngredient(false);
    setIsEditingNote(true);
  }

  function openIngredientEditor() {
    setNameDraft(effectiveName);
    setAmountDraft(effectiveAmount);
    setIsEditingNote(false);
    setIsEditingIngredient(true);
    setShowOriginal(false);
  }

  const isEditingSomething = isEditingNote || isEditingIngredient;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-4">
        {isEditingIngredient ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              autoFocus
              value={amountDraft}
              onChange={(event) => setAmountDraft(event.target.value)}
              className="w-24"
            />
            <Input
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              className="flex-1"
              placeholder="Ingredient name"
            />
          </div>
        ) : (
            <span>
              <span className="font-medium bold pr-3">{effectiveAmount}</span> {effectiveName}
            </span>
        )}

        <div className="flex items-center shrink-0 gap-1">
          {isEditingIngredient ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingIngredient(false)}
                disabled={isSavingIngredient}
              >
                Cancel
              </Button>
              <LoadingButton
                isLoading={isSavingIngredient}
                size="sm"
                onClick={() => editIngredient({ name: nameDraft, amount: amountDraft })}
                disabled={isSavingIngredient || (nameDraft === effectiveName && amountDraft === effectiveAmount)}
              >
                Save
              </LoadingButton>
            </>
          ) : (
            <>
              {(ingredientModified || noteModified) && (
                <Badge
                  variant="secondary"
                  className="shrink-0 cursor-pointer gap-1"
                  onClick={() => setShowOriginal((prev) => !prev)}
                >
                  <History className="h-3 w-3" />
                  Modified
                </Badge>
              )}
              <Button
                variant={isEditingNote ? "secondary" : "ghost"}
                className="pl-2"
                size="icon"
                aria-label="Add note"
                aria-pressed={isEditingNote}
                disabled={isEditingSomething && !isEditingNote}
                onClick={() => (isEditingNote ? setIsEditingNote(false) : openNoteEditor())}
              >
                <StickyNote className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit ingredient"
                disabled={isEditingSomething}
                onClick={openIngredientEditor}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {!isEditingIngredient && ingredientModified && showOriginal && (
        <div className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
          <span className="pr-3">{ingredient.initialDeltaValues.amount}</span> {ingredient.initialDeltaValues.name}
        </div>
      )}

      {!isEditingNote && effectiveNotes && (
        <>
          <p className="text-sm text-muted-foreground italic pt-4 pb-2">{effectiveNotes}</p>
          {noteModified && showOriginal && (
            <p className="text-sm text-muted-foreground/60 italic line-through decoration-muted-foreground/50 pb-2">
              {ingredient.initialDeltaValues.notes}
            </p>
          )}
        </>
      )}

      {isEditingNote && (
        <div className="flex flex-col gap-2 pb-2">
          <Textarea
            autoFocus
            value={noteDraft ?? undefined}
            onChange={(event) => setNoteDraft(event.target.value)}
            className="border p-2"
            placeholder="Add a note about this ingredient..."
          />
          <div className="flex gap-2 self-end">
            <Button variant="ghost" size="sm" onClick={() => setIsEditingNote(false)} disabled={isSavingNote}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => saveNote({ note: noteDraft?.trim() === "" ? null : noteDraft })}
              disabled={isSavingNote}
            >
              <span className="flex items-center gap-2">
                {isSavingNote ? <Spinner className="h-4 w-4" /> : <PencilSparklesIcon className="h-4 w-4" />}
                Save note
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}