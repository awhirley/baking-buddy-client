import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Pencil, PencilSparklesIcon, StickyNote } from "lucide-react";
import { Separator } from "#components/SharedComponents/ui/separator";
import type { Instruction } from "../../types/RecipeTypes";
import { recipeService } from "../../services/RecipeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../contexts/ToastContext";
import { Textarea } from "#components/ui/textarea";
import { useState } from "react";
import { Spinner } from "#components/SharedComponents/ui/spinner";
import { useParams } from "react-router-dom";

export function InstructionsSection({ instructions, editModeOn }: { instructions: Instruction[], editModeOn: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {instructions.map((instruction, index) => (
          <div key={instruction.id}>
            <InstructionRow instruction={instruction} stepNumber={index + 1} editModeOn={editModeOn} />
            {index < instructions.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InstructionRow({
  instruction,
  stepNumber,
  editModeOn,
}: {
  instruction: Instruction;
  stepNumber: number;
  editModeOn: boolean;
}) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(instruction.notes ?? "");
  const [savedNote, setSavedNote] = useState(instruction.notes ?? "");

  const [isEditingInstruction, setIsEditingInstruction] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(instruction.description);

  const { addToast } = useToast();

  const { mutate: editInstruction, isPending: isSavingInstruction } = useMutation({
    mutationFn: ({ description }: { description: string }) =>
      recipeService.editInstruction(instruction.id, { description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      addToast("Instruction updated", null, { type: "default" });
      setIsEditingInstruction(false);
    },
    onError: () => {
      addToast("Failed to update instruction", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const { mutate: saveNote, isPending: isSavingNote } = useMutation({
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

  function openNoteEditor() {
    setNoteDraft(instruction.notes ?? "");
    setIsEditingInstruction(false);
    setIsEditingNote(true);
  }

  function openInstructionEditor() {
    setDescriptionDraft(instruction.description);
    setIsEditingNote(false);
    setIsEditingInstruction(true);
  }

  const isEditingSomething = isEditingNote || isEditingInstruction;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between py-2 gap-4">
        {isEditingInstruction ? (
          <div className="flex items-start gap-2 flex-1">
            <span className="font-medium text-muted-foreground pt-2">{stepNumber}.</span>
            <Textarea
              autoFocus
              value={descriptionDraft}
              onChange={(event) => setDescriptionDraft(event.target.value)}
              className="flex-1 border p-2"
              placeholder="Instruction step..."
            />
          </div>
        ) : (
          <span className="text-sm">
            <span className="font-medium text-muted-foreground">{stepNumber}.</span> {instruction.description}
          </span>
        )}

        {editModeOn && (
          <div className="flex shrink-0 gap-1">
            {isEditingInstruction ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingInstruction(false)}
                  disabled={isSavingInstruction}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => editInstruction({ description: descriptionDraft })}
                  disabled={isSavingInstruction}
                >
                  <span className="flex items-center gap-2">
                    {isSavingInstruction ? <Spinner className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    Save
                  </span>
                </Button>
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
                  aria-label="Edit instruction"
                  disabled={isEditingSomething}
                  onClick={openInstructionEditor}
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
            placeholder="Add a note about this instruction..."
          />
          <div className="flex gap-2 self-end">
            <Button variant="ghost" size="sm" onClick={() => setIsEditingNote(false)} disabled={isSavingNote}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => saveNote({ id: instruction.id, note: noteDraft })} disabled={isSavingNote}>
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
