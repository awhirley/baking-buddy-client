// components/Bake/BakeInstructionsSection.tsx
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Pencil, StickyNote } from "lucide-react";
import { Separator } from "#components/SharedComponents/ui/separator";
import type { BakeInstruction } from "../../types/BakeTypes";

function isModified({ version, instructionDeltaId }: BakeInstruction) {
  return version === null && instructionDeltaId === null;
}

export function BakeInstructionsSection({ instructions }: { instructions: BakeInstruction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {instructions.map((instruction, index) => (
          <div key={instruction.instructionId}>
            <div className="flex items-start justify-between py-2 gap-4">
              <span className="text-sm flex items-start gap-2">
                <span>
                  <span className="font-medium text-muted-foreground">{index + 1}.</span>{" "}
                  {instruction.description}
                </span>
                {isModified(instruction) && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 shrink-0">
                    Modified this bake
                  </Badge>
                )}
              </span>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" aria-label="Add note">
                  <StickyNote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Edit instruction">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {index < instructions.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}