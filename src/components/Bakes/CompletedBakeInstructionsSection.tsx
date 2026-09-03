import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Separator } from "#components/SharedComponents/ui/separator";

import type { BakeInstruction } from "../../types/BakeTypes";

export function CompletedBakeInstructionsSection({
  instructions,
}: {
  instructions: BakeInstruction[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {instructions.map((instruction, index) => (
          <div key={instruction.bakeInstructionId}>
            <BakeInstructionRow instruction={instruction} stepNumber={index + 1} />
            {index < instructions.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function BakeInstructionRow({
  instruction,
  stepNumber,
}: {
  instruction: BakeInstruction;
  stepNumber: number;
}) {
  const descriptionChanged = instruction.updatedDescription !== null;
  const notesChanged = instruction.updatedNotes !== null || instruction.notesUpdatedToNull;

  const effectiveDescription = instruction.updatedDescription ?? instruction.description;
  const effectiveNotes = notesChanged ? instruction.updatedNotes : instruction.notes;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col py-2 gap-1">
        {descriptionChanged && (
          <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50 pl-5">
            {instruction.description}
          </span>
        )}
        <span className="text-sm flex items-start gap-2">
          <span className="font-medium text-muted-foreground">{stepNumber}.</span>
          <span>{effectiveDescription}</span>
        </span>
      </div>

      {notesChanged && instruction.notes && (
        <p className="text-sm text-muted-foreground/60 italic line-through decoration-muted-foreground/50">
          {instruction.notes}
        </p>
      )}
      {effectiveNotes && (
        <p className="text-sm text-muted-foreground italic pb-4">{effectiveNotes}</p>
      )}
    </div>
  );
}