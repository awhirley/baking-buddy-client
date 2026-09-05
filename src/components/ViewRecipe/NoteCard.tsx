import { NoteEditor } from "#components/SharedComponents/NoteEditor";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { useMutation } from "@tanstack/react-query";
import { recipeService } from "../../services/RecipeService";
import { useToast } from "../../contexts/ToastContext";

export function NoteCard({ recipeId, notes }: { recipeId: string; notes: string | null; }) {
  const { addToast } = useToast();
  
  const { mutate: saveNote, isPending: isSaving } = useMutation({
      mutationFn: (note: string | null) => recipeService.addNotesToRecipe(recipeId, note),
      onSuccess: () => {
        addToast("Note saved successfully", null, { type: "default" });
      },
      onError: () => {
        addToast("Failed to save note", "Please try again.", { type: "destructive", duration: 6000 });
      },
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <NoteEditor
          existingNote={notes}
          editModeOn={true}
          onSaveNote={saveNote}
          isSaving={isSaving}
          subject="Recipe"
          showHeader={false}
          hideSaveNoteButton={true}
        />
      </CardContent>
    </Card>
  );
}