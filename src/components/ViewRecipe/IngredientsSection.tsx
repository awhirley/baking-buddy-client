import { History as HistoryIcon, MoreVertical, Pencil, PencilSparklesIcon, StickyNote } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { formatAddedDate } from "#components/RecipeList/utils";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "#components/SharedComponents/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/SharedComponents/ui/dropdown-menu";
import { Input } from "#components/SharedComponents/ui/input";
import { Separator } from "#components/SharedComponents/ui/separator";
import { Spinner } from "#components/SharedComponents/ui/spinner";
import { Textarea } from "#components/SharedComponents/ui/textarea";

import { useToast } from "../../contexts/ToastContext";
import { recipeService } from "../../services/RecipeService";
import type { IngredientDeltaEntry } from "../../types/BakeTypes";
import type { Ingredient } from "../../types/RecipeTypes";

export function IngredientsSection({ ingredients, editModeOn }: { ingredients: Ingredient[]; editModeOn: boolean }) {
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
  const [noteDraft, setNoteDraft] = useState(ingredient.notes);
  const [savedNote, setSavedNote] = useState(ingredient.notes);

  const [isEditingIngredient, setIsEditingIngredient] = useState(false);
  const [nameDraft, setNameDraft] = useState(ingredient.name);
  const [amountDraft, setAmountDraft] = useState(ingredient.amount);

  const [isViewingHistory, setIsViewingHistory] = useState(false);

  const { addToast } = useToast();

  const { mutate: updateIngredient, isPending: isSavingIngredient } = useMutation({
    mutationFn: ({ name, amount, notes }: { name: string; amount: string; notes: string | null }) =>
      recipeService.updateIngredient(ingredient.id, { name, amount, notes }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      addToast("Ingredient updated", null, { type: "default" });
      setIsEditingIngredient(false);
      setIsEditingNote(false);
      setSavedNote(variables.notes);
    },
    onError: () => {
      addToast("Failed to update ingredient", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  function openNoteEditor() {
    setNoteDraft(ingredient.notes ?? "");
    setIsEditingIngredient(false);
    setIsViewingHistory(false);
    setIsEditingNote(true);
  }

  function openIngredientEditor() {
    setNameDraft(ingredient.name);
    setAmountDraft(ingredient.amount);
    setIsEditingNote(false);
    setIsViewingHistory(false);
    setIsEditingIngredient(true);
  }

  function openHistory() {
    setIsEditingNote(false);
    setIsEditingIngredient(false);
    setIsViewingHistory(true);
  }

  const isEditingSomething = isEditingNote || isEditingIngredient || isViewingHistory;

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

        { !editModeOn &&
          <Button
            variant={isViewingHistory ? "secondary" : "ghost"}
            size="icon"
            aria-label="View history"
            aria-pressed={isViewingHistory}
            disabled={isEditingSomething && !isViewingHistory}
            onClick={() => (isViewingHistory ? setIsViewingHistory(false) : openHistory())}
          >
            <HistoryIcon className="h-4 w-4" />
          </Button>
        }

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
                  onClick={() => updateIngredient({ name: nameDraft, amount: amountDraft, notes: noteDraft?.trim() === "" ? null : noteDraft })}
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
                <Button
                  variant={isViewingHistory ? "secondary" : "ghost"}
                  size="icon"
                  aria-label="View history"
                  aria-pressed={isViewingHistory}
                  disabled={isEditingSomething && !isViewingHistory}
                  onClick={() => (isViewingHistory ? setIsViewingHistory(false) : openHistory())}
                >
                  <HistoryIcon className="h-4 w-4" />
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
            value={noteDraft ?? undefined}
            onChange={(event) => setNoteDraft(event.target.value)}
            className="border p-2"
            placeholder="Add a note about this ingredient..."
          />
          <div className="flex gap-2 self-end">
            <Button variant="ghost" size="sm" onClick={() => setIsEditingNote(false)} disabled={isSavingIngredient}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => updateIngredient({ amount: amountDraft, name: nameDraft, notes: noteDraft })} disabled={isSavingIngredient}>
              <span className="flex items-center gap-2">
                {isSavingIngredient ? <Spinner className="h-4 w-4" /> : <PencilSparklesIcon className="h-4 w-4" />}
                Save note
              </span>
            </Button>
          </div>
        </div>
      )}

      {isViewingHistory && <IngredientHistoryPreview ingredientId={ingredient.id} />}
    </div>
  );
}

function IngredientHistoryPreview({ ingredientId }: { ingredientId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredientHistory", ingredientId],
    queryFn: () => recipeService.getIngredientHistory(ingredientId),
  });

  const sortedHistory = data?.history.slice().sort((a, b) => b.version - a.version) ?? [];
  const recentEntries = sortedHistory.slice(0, 3);

  return (
    <div className="flex flex-col gap-1 pb-3 pl-4 border-l-2 border-muted ml-1">
      {isLoading && <p className="text-xs text-muted-foreground">Loading history...</p>}
      {error && <p className="text-xs text-destructive">Couldn't load history.</p>}

      {recentEntries.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between text-xs text-muted-foreground gap-2 py-0.5">
          <span>
            <span className="font-medium">{entry.amount}</span> {entry.name}
            {entry.version === data?.bestVersion && (
              <Badge variant="secondary" className="ml-2 text-[10px] py-0">
                Current
              </Badge>
            )}
          </span>
          <span className="shrink-0">{formatAddedDate(entry.createdAt)}</span>
        </div>
      ))}

      {data && sortedHistory.length > 0 && (
        <IngredientHistoryDialog
          ingredientId={ingredientId}
          bestVersion={data.bestVersion}
          entries={sortedHistory}
          trigger={
            <Button variant="link" size="sm" className="self-start px-0 h-auto text-xs">
              {sortedHistory.length > 3 ? `View full history (${sortedHistory.length})` : "View history"}
            </Button>
          }
        />
      )}
    </div>
  );
}

function IngredientHistoryDialog({
  entries,
  bestVersion,
  trigger,
}: {
  ingredientId: string;
  bestVersion: number;
  entries: IngredientDeltaEntry[];
  trigger: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ingredient history</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 max-h-96 overflow-y-auto">
          {entries.map((entry) => {
            const isCurrent = entry.version === bestVersion;
            return (
              <div key={entry.id} className="flex items-center justify-between py-2 gap-4 border-b last:border-b-0">
                <div className="text-sm">
                  <span className="font-medium">{entry.amount}</span> {entry.name}
                  {isCurrent && (
                    <Badge variant="secondary" className="ml-2">
                      Current
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground">
                    v{entry.version} · {formatAddedDate(entry.createdAt)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon" aria-label="Version actions">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    { !isCurrent && <DropdownMenuItem onClick={() => {}}>
                      Revert to this version
                    </DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => {}}>
                      See bakes associated with this version
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" disabled={isCurrent} onClick={() => {}}>
                      Delete this version
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}