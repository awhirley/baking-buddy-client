import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Pencil, StickyNote } from "lucide-react";
import { Separator } from "#components/ui/separator";
import type { Instruction } from "../../types/Types";

export function InstructionsSection({ instructions }: { instructions: Instruction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {instructions.map((instruction, index) => (
          <div key={instruction.id}>
            <div className="flex items-start justify-between py-2 gap-4">
              <span className="text-sm">
                <span className="font-medium text-muted-foreground">{index + 1}.</span>{" "}
                {instruction.description}
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
