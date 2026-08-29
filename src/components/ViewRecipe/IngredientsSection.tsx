import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Pencil, PencilSparklesIcon, StickyNote } from "lucide-react";
import type { Ingredient } from "../../types/RecipeTypes";
import { Separator } from "#components/SharedComponents/ui/separator";
import { recipeService } from "../../services/RecipeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../contexts/ToastContext";
import { Textarea } from "#components/ui/textarea";
import { useState } from "react";
import { Spinner } from "#components/SharedComponents/ui/spinner";
import { Input } from "#components/ui/input";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { useParams } from "react-router-dom";

export function IngredientsSection({ ingredients, editModeOn }: { ingredients: Ingredient[], editModeOn: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id}>
            <IngredientRow ingredient={ingredient} editModeOn={editModeOn} />
            {index < ingredients.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function IngredientRow({ ingredient, editModeOn }: { ingredient: Ingredient; editModeOn: boolean }) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(ingredient.notes ?? "");
  const [savedNote, setSavedNote] = useState(ingredient.notes ?? "");

  const [isEditingIngredient, setIsEditingIngredient] = useState(false);
  const [nameDraft, setNameDraft] = useState(ingredient.name);
  const [amountDraft, setAmountDraft] = useState(ingredient.amount);

  const { addToast } = useToast();

  const { mutate: editIngredient, isPending: isSavingIngredient } = useMutation({
    mutationFn: ({ name, amount }: { name: string; amount: string }) =>
      recipeService.editIngredient(ingredient.id, { name, amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      addToast("Ingredient updated", null, { type: "default" });
      setIsEditingIngredient(false);
    },
    onError: () => {
      addToast("Failed to update ingredient", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const { mutate: saveNote, isPending: isSavingNote } = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string | null }) =>
      recipeService.addNotesToIngredient(id, note),
    onSuccess: (_, variables) => {
      setSavedNote(variables.note ?? "");
      addToast("Note saved successfully", "and it's a good note, too.", { type: "default" });
      setIsEditingNote(false);
    },
    onError: () => {
      addToast("Failed to save note", "Please try again :(", { type: "destructive", duration: 6000 });
    },
  });

  function openNoteEditor() {
    setNoteDraft(ingredient.notes ?? "");
    setIsEditingIngredient(false);
    setIsEditingNote(true);
  }

  function openIngredientEditor() {
    setNameDraft(ingredient.name);
    setAmountDraft(ingredient.amount);
    setIsEditingNote(false);
    setIsEditingIngredient(true);
  }

  const isEditingSomething = isEditingNote || isEditingIngredient;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between py-2 gap-4">
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
          <span className="text-sm">
            <span className="font-bold pr-2">{ingredient.amount}</span> {ingredient.name}
          </span>
        )}

        {editModeOn && (
          <div className="flex shrink-0 gap-1">
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
                  disabled={isSavingIngredient || (nameDraft === ingredient.name && amountDraft === ingredient.amount)}
                >
                    Save
                </LoadingButton>
              </>
            ) : (
              <>
                <Button
                  variant={isEditingNote ? "secondary" : "ghost"}
                  size="icon"
                  aria-label="Add note"
                  aria-pressed={isEditingNote}
                  disabled={isEditingSomething}
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
        )}
      </div>

      {!isEditingNote && savedNote && (
        <p className="text-sm text-muted-foreground italic pb-4">{savedNote}</p>
      )}

      {isEditingNote && (
        <div className="flex flex-col gap-2 pb-2">
          <Textarea
            autoFocus
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            className="border p-2"
            placeholder="Add a note about this ingredient..."
          />
          <div className="flex gap-2 self-end">
            <Button variant="ghost" size="sm" onClick={() => setIsEditingNote(false)} disabled={isSavingNote}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => saveNote({ id: ingredient.id, note: noteDraft })} disabled={isSavingNote}>
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
