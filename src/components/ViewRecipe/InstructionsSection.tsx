import { History as HistoryIcon, MoreVertical, MoveDown, MoveUp, Pencil, PencilSparklesIcon, Plus, StickyNote, Trash2 } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { formatAddedDate } from "#components/RecipeList/utils";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "#components/SharedComponents/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/SharedComponents/ui/dropdown-menu";
import { Separator } from "#components/SharedComponents/ui/separator";
import { Textarea } from "#components/SharedComponents/ui/textarea";

import { useToast } from "../../contexts/ToastContext";
import { deltaService } from "../../services/DeltaService";
import { recipeService } from "../../services/RecipeService";
import type { InstructionDeltaEntry } from "../../types/BakeTypes";
import type { Instruction } from "../../types/RecipeTypes";
import { BakesRelatedToDeltaDialog } from "./BakesRelatedToDeltaDialog";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { DeleteInstructionOrIngredientDialog } from "#components/Triggers/DeleteInstructionOrIngredientDialog";

export function InstructionsSection({ instructions, editModeOn }: { instructions: Instruction[]; editModeOn: boolean }) {
  const { id } = useParams();

  // null = append at the end
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const position = Math.min(insertIndex ?? instructions.length, instructions.length);

  // don't carry a stale insert position across edit-mode toggles
  useEffect(() => {
    if (!editModeOn) setInsertIndex(null);
  }, [editModeOn]);

  const previousInstructionId = position > 0 ? instructions[position - 1].id : null;
  const nextInstructionId = position < instructions.length ? instructions[position].id : null;

  const moveUp = () => setInsertIndex(Math.max(position - 1, 0));
  const moveDown = () => setInsertIndex(Math.min(position + 1, instructions.length));

  const items = instructions.map((instruction, index) => ({
    key: instruction.id,
    node: (
      <InstructionRow
        instruction={instruction}
        // steps after the insertion point shift down by one while adding
        stepNumber={editModeOn && index >= position ? index + 2 : index + 1}
        editModeOn={editModeOn}
      />
    ),
  }));

  if (editModeOn && id) {
    items.splice(position, 0, {
      key: "add-instruction-row", // stable key so state survives moving
      node: (
        <AddInstructionRow
          recipeId={id}
          previousInstructionId={previousInstructionId}
          nextInstructionId={nextInstructionId}
          stepNumber={position + 1}
          canMoveUp={position > 0}
          canMoveDown={position < instructions.length}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          onClose={() => setInsertIndex(null)}
        />
      ),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {items.map((item, i) => (
          <Fragment key={item.key}>
            {item.node}
            {i < items.length - 1 && <Separator />}
          </Fragment>
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
  const [noteDraft, setNoteDraft] = useState(instruction.notes);
  const [savedNote, setSavedNote] = useState(instruction.notes);

  const [isEditingInstruction, setIsEditingInstruction] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(instruction.description);

  const [isViewingHistory, setIsViewingHistory] = useState(false);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { addToast } = useToast();

  const { mutate: updateInstruction, isPending: isSavingInstruction } = useMutation({
    mutationFn: ({ description, notes }: { description: string; notes: string | null }) =>
      recipeService.updateInstruction(instruction.id, { description, notes, order: instruction.order }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      addToast("Instruction updated", null, { type: "default" });
      setSavedNote(variables.notes);
      setIsEditingInstruction(false);
      setIsEditingNote(false);
    },
    onError: () => {
      addToast("Failed to update instruction", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const { mutate: deleteInstruction, isPending: isDeletingInstruction } = useMutation({
    mutationFn: () => recipeService.deleteInstruction(instruction.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      addToast("Instruction deleted", null, { type: "default" });
      setIsConfirmingDelete(false);
    },
    onError: () => {
      addToast("Failed to delete instruction", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  function openNoteEditor() {
    setNoteDraft(instruction.notes ?? "");
    setIsEditingInstruction(false);
    setIsViewingHistory(false);
    setIsEditingNote(true);
  }

  function openInstructionEditor() {
    setDescriptionDraft(instruction.description);
    setIsEditingNote(false);
    setIsViewingHistory(false);
    setIsEditingInstruction(true);
  }

  function openHistory() {
    setIsEditingNote(false);
    setIsEditingInstruction(false);
    setIsViewingHistory(true);
  }

  const isEditingSomething = isEditingNote || isEditingInstruction || isViewingHistory;

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

        {!editModeOn && (
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
                <LoadingButton
                  size="sm"
                  isLoading={isSavingInstruction}
                  onClick={() => updateInstruction({ description: descriptionDraft, notes: savedNote })}
                >
                  <span className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Save
                  </span>
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
                  aria-label="Edit instruction"
                  disabled={isEditingSomething}
                  onClick={openInstructionEditor}
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
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete instruction"
                  disabled={isEditingSomething}
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
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
            placeholder="Add a note about this instruction..."
          />
          <div className="flex gap-2 self-end">
            <Button variant="ghost" size="sm" onClick={() => setIsEditingNote(false)} disabled={isSavingInstruction}>
              Cancel
            </Button>
            <LoadingButton
              size="sm"
              isLoading={isSavingInstruction}
              onClick={() => updateInstruction({ description: descriptionDraft, notes: noteDraft })}
            >
              <span className="flex items-center gap-2">
                <PencilSparklesIcon className="h-4 w-4" />
                Save note
              </span>
            </LoadingButton>
          </div>
        </div>
      )}

      {isViewingHistory && <InstructionHistoryPreview instructionId={instruction.id} />}

      <DeleteInstructionOrIngredientDialog
        isOpen={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
        title="Delete instruction?"
        description={`Step ${stepNumber} will be permanently removed from this recipe. The steps after it will be renumbered.`}
        isDeleting={isDeletingInstruction}
        onConfirm={() => deleteInstruction()}
      />
    </div>
  );
}

function AddInstructionRow({
  recipeId,
  previousInstructionId,
  nextInstructionId,
  stepNumber,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onClose,
}: {
  recipeId: string;
  previousInstructionId: string | null;
  nextInstructionId: string | null;
  stepNumber: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");

  const canSubmit = descriptionDraft.trim() !== "";

  function closeForm() {
    setDescriptionDraft("");
    setIsAdding(false);
    onClose(); // reset insert position to the end
  }

  const { mutate: createInstruction, isPending: isCreating } = useMutation({
    mutationFn: () =>
      recipeService.createInstruction(recipeId, {
        description: descriptionDraft.trim(),
        previousInstructionId,
        nextInstructionId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      addToast("Instruction added", null, { type: "default" });
      closeForm();
    },
    onError: () => {
      addToast("Failed to add instruction", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  if (!isAdding) {
    return (
      <Button variant="ghost" size="sm" className="self-start" onClick={() => setIsAdding(true)}>
        <Plus className="h-4 w-4" />
        Add step
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-start gap-2">
        <div className="flex">
          <Button size="icon" variant="ghost" aria-label="Move up" disabled={!canMoveUp} onClick={onMoveUp}>
            <MoveUp />
          </Button>
          <Button size="icon" variant="ghost" aria-label="Move down" disabled={!canMoveDown} onClick={onMoveDown}>
            <MoveDown />
          </Button>
        </div>
        <span className="font-medium text-muted-foreground pt-2">{stepNumber}.</span>
        <Textarea
          autoFocus
          value={descriptionDraft}
          onChange={(event) => setDescriptionDraft(event.target.value)}
          className="flex-1 border p-2"
          placeholder="Instruction step..."
        />
      </div>
      <div className="flex gap-2 self-end">
        <Button variant="ghost" size="sm" onClick={closeForm} disabled={isCreating}>
          Cancel
        </Button>
        <LoadingButton size="sm" isLoading={isCreating} onClick={() => createInstruction()} disabled={isCreating || !canSubmit}>
          Add step
        </LoadingButton>
      </div>
    </div>
  );
}

function InstructionHistoryPreview({ instructionId }: { instructionId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["instructionHistory", instructionId],
    queryFn: () => deltaService.getInstructionHistory(instructionId),
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
            {entry.description}
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
        <InstructionHistoryDialog
          instructionId={instructionId}
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

function InstructionHistoryDialog({
  entries,
  bestVersion,
  trigger,
}: {
  instructionId: string;
  bestVersion: number;
  entries: InstructionDeltaEntry[];
  trigger: React.ReactNode;
}) {
  const [bakesByDeltaIsOpen, setBakesByDeltaIsOpen] = useState<boolean>(false);

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Instruction history</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 max-h-96 overflow-y-auto">
          {entries.map((entry) => {
            const isCurrent = entry.version === bestVersion;
            return (
              <div key={entry.id} className="flex items-start justify-between py-2 gap-4 border-b last:border-b-0">
                <div className="text-sm">
                  {entry.description}
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
                    {!isCurrent && (
                      <DropdownMenuItem onClick={() => {}}>Revert to this version</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => {setBakesByDeltaIsOpen(true)}}>See bakes associated with this version</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" disabled={isCurrent} onClick={() => {}}>
                      Delete this version
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <BakesRelatedToDeltaDialog
                    deltaType={"INSTRUCTION"}
                    deltaId={entry.id}
                    deltaName={entry.description}
                    deltaVersion={entry.version}
                    isOpen={bakesByDeltaIsOpen}
                    setIsOpen={setBakesByDeltaIsOpen}
                  />
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}