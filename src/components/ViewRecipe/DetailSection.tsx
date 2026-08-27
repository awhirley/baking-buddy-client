import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Textarea } from "#components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Pencil, PencilSparklesIcon } from "lucide-react";
import { useState } from "react";
import type { RecipeDetail } from "../../types/RecipeTypes";
import { formatAddedDate } from "#components/RecipeList/utils";
import { useMutation } from "@tanstack/react-query";
import { recipeService } from "../../services/RecipeService";
import { useToast } from "../../contexts/ToastContext";
import { Spinner } from "#components/SharedComponents/ui/spinner";

export function RecipeDetailsCard({
  id,
  name,
  description,
  recipeSourceType,
  recipeSource,
  tags,
  tools,
  createdAt,
  notes,
}: RecipeDetail) {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [note, setNote] = useState<string | null>(notes);
  const { addToast } = useToast();

  const { mutate: saveNote, isPending: isSaving } = useMutation({
    mutationFn: (note: string | null) =>
      recipeService.addNotesToRecipe(id, note),
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
          <CardTitle className="text-2xl">{name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Added {formatAddedDate(createdAt)}
            { (recipeSourceType || recipeSource) && <span>, from {recipeSourceType} {recipeSource}</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" aria-label="Edit recipe details">
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteRecipeTrigger recipeId={id} isOpen={deleteDialogIsOpen} setIsOpen={setDeleteDialogIsOpen} navigateToHome={true} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="text-sm">{description}</p>

        {(tags?.length > 0 || tools?.length > 0) && (
          <div className="flex flex-col gap-2">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                Tags:
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {tools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                Tools:
                {tools.map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 group">
          <Textarea value={note ?? undefined} onChange={(event) => { setNote(event.target.value) }} className="border p-2" placeholder="Recipe notes: enter anything you'd like to remember about your recipe"></Textarea>
          <Button onClick={() => saveNote(note)} className="hidden group-focus-within:block self-end">
            <span className="flex items-center gap-2">
              { isSaving ? <Spinner /> : <PencilSparklesIcon /> }
              Save note
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
