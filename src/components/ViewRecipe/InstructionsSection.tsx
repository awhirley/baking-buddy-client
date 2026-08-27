import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Pencil, PencilSparklesIcon, StickyNote } from "lucide-react";
import { Separator } from "#components/SharedComponents/ui/separator";
import type { Instruction } from "../../types/RecipeTypes";
import { recipeService } from "../../services/RecipeService";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../contexts/ToastContext";
import { Textarea } from "#components/ui/textarea";
import { useState } from "react";
import { Spinner } from "#components/SharedComponents/ui/spinner";

export function InstructionsSection({ instructions }: { instructions: Instruction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {instructions.map((instruction, index) => (
          <div key={instruction.id}>
            <InstructionRow instruction={instruction} stepNumber={index + 1} />
            {index < instructions.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InstructionRow({ instruction, stepNumber }: { instruction: Instruction; stepNumber: number }) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(instruction.notes ?? "");
  const [savedNote, setSavedNote] = useState(instruction.notes ?? "");
  const { addToast } = useToast();

  const { mutate: saveNote, isPending: isSaving } = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string | null }) =>
      recipeService.addNotesToInstruction(id, note),
    onSuccess: (_, variables) => {
      setSavedNote(variables.note ?? "");
      addToast("Note saved successfully", "and it's a good note, too.", { type: "default" });
      setIsEditingNote(false);
    },
    onError: () => {
      addToast("Failed to save note", "Please try again :(", { type: "destructive", duration: 6000 });
    },
  });

  function openEditor() {
    setNoteDraft(instruction.notes ?? "");
    setIsEditingNote(true);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between py-2 gap-4">
        <span className="text-sm">
          <span className="font-medium text-muted-foreground">{stepNumber}.</span>{" "}
          {instruction.description}
        </span>
        <div className="flex gap-1 shrink-0">
          <Button
            variant={isEditingNote ? "secondary" : "ghost"}
            size="icon"
            aria-label="Add note"
            aria-pressed={isEditingNote}
            onClick={() => (isEditingNote ? setIsEditingNote(false) : openEditor())}
          >
            <StickyNote className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Edit instruction">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
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
            placeholder="Add a note about this instruction..."
          />
          <div className="flex gap-2 self-end">
            <Button variant="ghost" size="sm" onClick={() => setIsEditingNote(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => saveNote({ id: instruction.id, note: noteDraft })} disabled={isSaving}>
              <span className="flex items-center gap-2">
                {isSaving ? <Spinner className="h-4 w-4" /> : <PencilSparklesIcon className="h-4 w-4" />}
                Save note
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
