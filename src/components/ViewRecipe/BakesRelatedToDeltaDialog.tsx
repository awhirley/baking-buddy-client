import { BakeListForIngredientDelta, BakeListForInstructionDelta } from "#components/Bakes/BakeList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#components/SharedComponents/ui/dialog";
import type { Dispatch, SetStateAction } from "react";

export function BakesRelatedToDeltaDialog({
  deltaType,
  deltaId,
  deltaName,
  deltaVersion,
  isOpen,
  setIsOpen,
}: {
  deltaType: "INGREDIENT" | "INSTRUCTION";
  deltaId: string;
  deltaName: string;
  deltaVersion: number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Bakes related to version {deltaVersion} of "{deltaName}"</DialogTitle>
        </DialogHeader>
        { deltaType === "INGREDIENT" ?
          <BakeListForIngredientDelta ingredientDeltaId={deltaId} /> :
          <BakeListForInstructionDelta instructionDeltaId={deltaId} />
        }
      </DialogContent>
    </Dialog>
  );
}