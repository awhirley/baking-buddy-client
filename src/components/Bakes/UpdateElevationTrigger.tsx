import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { LoadingButton } from "#components/SharedComponents/LoadingButton";

import { useToast } from "../../contexts/ToastContext";
import { bakeService } from "../../services/BakeService";
import { Button } from "#components/SharedComponents/ui/button";
import type { BakeRating, UpdateBakePayload } from "../../types/BakeTypes";
import { DialogContent, DialogHeader, DialogFooter, Dialog, DialogTitle } from "#components/SharedComponents/ui/dialog";
import { Input } from "#components/SharedComponents/ui/input";
import { MountainSnow, Pencil } from "lucide-react";

export function UpdateElevationTrigger({ triggerType, bakeId, elevation }: { triggerType: "LINK" | "ICON", bakeId: string; elevation: number | null; }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [elevationInput, setElevationInput] = useState<string>(elevation != null ? String(elevation) : "");

  const resetForm = () => {
    setElevationInput(elevation != null ? String(elevation) : "");
  };

  const { mutate: updateDetails, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const parsedElevation = elevationInput.trim() === "" ? null : Number(elevationInput);

      console.log('parsedElevation', parsedElevation);

      const payload: UpdateBakePayload = {
        bakeId,
        elevation: parsedElevation,
        notes: undefined,
        ratings: undefined,
      };

      return bakeService.updateBake(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes"] });
      queryClient.invalidateQueries({ queryKey: ["bake", bakeId] });
      addToast("Elevation updated", null, { type: "default" });
      setIsOpen(false);
    },
    onError: () => {
      addToast("Failed to update elevation", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      { triggerType === "LINK" && <div className="flex gap-2">
        <Button onClick={() => handleOpenChange(true)} variant="link" className="px-0">
          <MountainSnow/> Set elevation
        </Button>
      </div>}
      { triggerType === "ICON" &&
      <div className="flex flex-row gap-2 items-center">
        Baked at {elevation} feet
        <Button onClick={() => handleOpenChange(true)} variant="link" className="px-0" size="icon">
          <Pencil className="h-2 w-2"/>
        </Button>
      </div>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit bake elevation</DialogTitle>
        </DialogHeader>
        <Input
          id="elevationInput"
          type="number"
          value={elevationInput}
          onChange={(e) => setElevationInput(e.target.value)}
          placeholder="e.g. 5280"
        />

        <DialogFooter>
          <Button variant="outline" disabled={isSaving} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <LoadingButton isLoading={isSaving} onClick={() => updateDetails()}>
            Save changes
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}