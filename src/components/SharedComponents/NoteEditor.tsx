import { NotepadText, PencilSparklesIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { LoadingButton } from "./LoadingButton";

export function NoteEditor({ existingNote, editModeOn, onSaveNote, isSaving, subject }: { existingNote: string | null; editModeOn: boolean; onSaveNote: (note: string | null) => void; isSaving: boolean; subject: string }) {
  const [note, setNote] = useState<string | null>(existingNote);

  if (editModeOn) {
    return (
      <div className="flex flex-col gap-2 group border-l-4 border-amber-300 pl-3 py-1 bg-input/50 rounded-xl">
        <span className="flex items-center gap-1 font-semibold pb-2">
          <NotepadText className="w-4 h-4" />
          {subject} Notes
        </span>
        <Textarea
          value={note ?? undefined}
          onChange={(event) => setNote(event.target.value)}
          className="border"
          placeholder={`Enter anything you'd like to remember about your ${subject}`}
        ></Textarea>
        <span className="hidden group-focus-within:block self-end">
          <LoadingButton isLoading={isSaving} onClick={() => onSaveNote(note)}>
            <span className="flex items-center gap-2">
              <PencilSparklesIcon />
              Save note
            </span>
          </LoadingButton>
        </span>
      </div>
    );
  }

  if (note) {
    return (
      <div className="border-l-4 border-amber-300 pl-3 py-1 bg-input/50 rounded-xl">
        <span className="flex items-center gap-1 font-semibold pb-2">
          <NotepadText className="w-4 h-4" />
          {subject} Notes
        </span>
        {note}
      </div>
    );
  }
}
