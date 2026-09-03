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

  const effectiveDescription = instruction.updatedDescription ?? instruction.description;
  const effectiveNotes = (instruction.updatedNotes || instruction.notesUpdatedToNull) ? instruction.updatedNotes : instruction.notes

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start justify-between py-2 gap-4">
        <span className="text-sm flex items-start gap-2">
            <span>
              <span className="font-medium text-muted-foreground">{stepNumber}.</span> {effectiveDescription}
            </span>
          </span>
      </div>
      {effectiveNotes && <p className="text-sm text-muted-foreground italic pb-4">{effectiveNotes}</p> }
    </div>
  );
}