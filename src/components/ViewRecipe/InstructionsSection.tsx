import { History as HistoryIcon, MoreVertical, Pencil, PencilSparklesIcon, StickyNote } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { formatAddedDate } from "#components/RecipeList/utils";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "#components/SharedComponents/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/SharedComponents/ui/dropdown-menu";
import { Separator } from "#components/SharedComponents/ui/separator";
import { Spinner } from "#components/SharedComponents/ui/spinner";
import { Textarea } from "#components/SharedComponents/ui/textarea";

import { useToast } from "../../contexts/ToastContext";
import { recipeService } from "../../services/RecipeService";
import type { InstructionDeltaEntry } from "../../types/BakeTypes";
import type { Instruction } from "../../types/RecipeTypes";

export function InstructionsSection({ instructions, editModeOn }: { instructions: Instruction[]; editModeOn: boolean }) {
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
  const [noteDraft, setNoteDraft] = useState(instruction.notes);
  const [savedNote, setSavedNote] = useState(instruction.notes);

  const [isEditingInstruction, setIsEditingInstruction] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(instruction.description);

  const [isViewingHistory, setIsViewingHistory] = useState(false);

  const { addToast } = useToast();

  const { mutate: updateInstruction, isPending: isSavingInstruction } = useMutation({
    mutationFn: ({ description, notes }: { description: string; notes: string | null }) =>
      recipeService.updateInstruction(instruction.id, { description, notes }),
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
                <Button
                  size="sm"
                  onClick={() => updateInstruction({ description: descriptionDraft, notes: savedNote })}
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
            <Button size="sm" onClick={() => updateInstruction({ description: descriptionDraft, notes: noteDraft })} disabled={isSavingInstruction}>
              <span className="flex items-center gap-2">
                {isSavingInstruction ? <Spinner className="h-4 w-4" /> : <PencilSparklesIcon className="h-4 w-4" />}
                Save note
              </span>
            </Button>
          </div>
        </div>
      )}

      {isViewingHistory && <InstructionHistoryPreview instructionId={instruction.id} />}
    </div>
  );
}

function InstructionHistoryPreview({ instructionId }: { instructionId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["instructionHistory", instructionId],
    queryFn: () => recipeService.getInstructionHistory(instructionId),
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
                    <DropdownMenuItem onClick={() => {}}>See bakes associated with this version</DropdownMenuItem>
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