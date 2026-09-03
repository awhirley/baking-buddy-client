import { NotepadText, PencilSparklesIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { LoadingButton } from "./LoadingButton";

interface NoteEditorProps {
  existingNote: string | null;
  editModeOn: boolean;
  onSaveNote: (note: string | null) => void;
  isSaving: boolean;
  subject: string;
  hideSaveNoteButton?: boolean;
}

export function NoteEditor(
  {
    existingNote,
    editModeOn,
    onSaveNote,
    isSaving,
    subject,
    hideSaveNoteButton = false,
  }: NoteEditorProps) {
  const [note, setNote] = useState<string | null>(existingNote);

  const buttonStyling = hideSaveNoteButton ? "hidden group-focus-within:block self-end pr-2 pb-2" : "self-end pr-2 pb-2";

  if (editModeOn) {
    return (
      <div className="flex flex-col gap-2 group">
        <span className="flex items-center font-semibold pb-2 gap-2">
          <NotepadText className="w-4 h-4" />
          {subject} Notes
        </span>
        <div className="flex flex-col gap-2 border-l-4 border-amber-300 pl-3 py-1 bg-input/50 rounded-xl">
          <Textarea
            value={note ?? undefined}
            onChange={(event) => setNote(event.target.value)}
            className="border bg-transparent"
            placeholder={`Enter anything you'd like to remember about your ${subject}`}
          ></Textarea>
          <span className={buttonStyling}>
            <LoadingButton isLoading={isSaving} onClick={() => onSaveNote(note)}>
              <span className="flex items-center gap-2">
                <PencilSparklesIcon />
                Save note
              </span>
            </LoadingButton>
          </span>
        </div>
      </div>
    );
  }

  if (note) {
    return (
      <div className="flex flex-col gap-2">
        <span className="flex items-center font-semibold pb-2 gap-2">
          <NotepadText className="w-4 h-4" />
          {subject} Notes
        </span>
        <div className="border-l-4 border-amber-300 pl-3 py-1 bg-input/50 rounded-xl whitespace-pre-wrap break-words">
          <div className="m-3">
            {note}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center font-semibold pb-2 gap-2">
        <NotepadText className="w-4 h-4" />
        {subject} Notes
      </span><p className="text-sm text-muted-foreground italic">No recipe notes yet.</p>
    </div>);
}
