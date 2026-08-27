import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Textarea } from "#components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { NotepadText, Pencil, PencilSparklesIcon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { RecipeDetail } from "../../types/RecipeTypes";
import { formatAddedDate } from "#components/RecipeList/utils";
import { useMutation } from "@tanstack/react-query";
import { recipeService } from "../../services/RecipeService";
import { useToast } from "../../contexts/ToastContext";
import { Spinner } from "#components/SharedComponents/ui/spinner";
import { Toggle } from "#components/ui/toggle";

interface RecipeDetailsCardProps {
  details: RecipeDetail,
  editModeOn: boolean,
  setEditModeOn: Dispatch<SetStateAction<boolean>>,
}

export function RecipeDetailsCard({ details, editModeOn, setEditModeOn }: RecipeDetailsCardProps) {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [note, setNote] = useState<string | null>(details.notes);
  const { addToast } = useToast();

  const { mutate: saveNote, isPending: isSaving } = useMutation({
    mutationFn: (note: string | null) =>
      recipeService.addNotesToRecipe(details.id, note),
    onSuccess: () => {
      addToast('Note saved successfully', null, { type: 'default' });
    },
    onError: () => {
      addToast('Failed to save note', "Please try again.", { type: 'destructive', duration: 6000 });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">{details.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Added {formatAddedDate(details.createdAt)}
            { (details.recipeSourceType || details.recipeSource) && <span>, from {details.recipeSourceType} {details.recipeSource}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Toggle aria-label="Toggle bookmark" variant="outline" pressed={editModeOn} onPressedChange={setEditModeOn} >
            <Pencil className="group-aria-pressed/toggle:fill-foreground"/>
            <span className="pl-1">Edit Mode</span>
          </Toggle>
          <DeleteRecipeTrigger recipeId={details.id} isOpen={deleteDialogIsOpen} setIsOpen={setDeleteDialogIsOpen} navigateToHome={true} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="text-sm">{details.description}</p>

        {(details.tags?.length > 0 || details.tools?.length > 0) && (
          <div className="flex flex-col gap-2">
            {details.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                Tags:
                {details.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {details.tools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                Tools:
                {details.tools.map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {
          editModeOn && <div className="flex flex-col gap-2 group">
            <span className="flex items-center gap-1 font-semibold"><NotepadText className="w-4 h-4"/>Recipe Notes</span>
            <Textarea value={note ?? undefined} onChange={(event) => { setNote(event.target.value) }} className="border" placeholder="Recipe notes: enter anything you'd like to remember about your recipe"></Textarea>
            <Button onClick={() => saveNote(note)} className="hidden group-focus-within:block self-end">
              <span className="flex items-center gap-2">
                { isSaving ? <Spinner /> : <PencilSparklesIcon /> }
                Save note
              </span>
            </Button>
          </div>
        }

        {
          (!editModeOn && note) &&
          <>
            <span className="flex items-center gap-1 font-semibold"><NotepadText className="w-4 h-4"/>Recipe Notes</span>
            {note}
          </>
        }
      </CardContent>
    </Card>
  );
}
