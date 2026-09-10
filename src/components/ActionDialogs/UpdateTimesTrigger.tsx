import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { LoadingButton } from "#components/SharedComponents/LoadingButton";

import { useToast } from "../../contexts/ToastContext";
import { Button } from "#components/SharedComponents/ui/button";
import { DialogContent, DialogHeader, DialogFooter, Dialog, DialogTitle } from "#components/SharedComponents/ui/dialog";
import { Blender, Microwave, Pencil } from "lucide-react";
import type { UpdateRecipePayload } from "../../types/RecipeTypes";
import { recipeService } from "../../services/RecipeService";
import { clampMinutes, clampNonNegative, hourValueFromMinutes, minutesValueFromMinutes, TimeCounter, timeToTotalMinutes } from "#components/SharedComponents/TimeCounter";

export function UpdateTimesTrigger({ time, timeType, recipeId }: { timeType: "PREP" | "BAKE", triggerType: "LINK" | "ICON", recipeId: string; time: number | null; }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [hoursInput, setHoursInput] = useState<number | undefined>(hourValueFromMinutes(time ?? undefined));
  const [minutesInput, setMinutesInput] = useState<number | undefined>(minutesValueFromMinutes(time ?? undefined));

  const resetForm = () => {
    setHoursInput(hourValueFromMinutes(time ?? undefined));
    setMinutesInput(minutesValueFromMinutes(time ?? undefined));
  };

  const { mutate: updateDetails, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const parsedTime = timeToTotalMinutes(hoursInput, minutesInput);

      const payload: UpdateRecipePayload = {
        prepTime: timeType === "PREP" ? parsedTime : undefined,
        bakeTime: timeType === "BAKE" ? parsedTime : undefined,
        name: undefined,
        description: undefined,
        recipeSourceType: undefined,
        recipeSource: undefined,
        tags: undefined,
        tools: undefined,
        favorite: undefined,
        difficultyRating: undefined
      };

      return recipeService.updateRecipe(recipeId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      addToast("Time updated", null, { type: "default" });
      setIsOpen(false);
    },
    onError: () => {
      addToast("Failed to update time", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      { (!hoursInput && !minutesInput) ? <div className="flex">
        <Button onClick={() => handleOpenChange(true)} variant="link" className="px-0">
          { timeType === "BAKE" ? 
            <><Microwave/> Set bake time</> : 
            <><Blender/> Set preparation time</>
          }
        </Button>
      </div> :
      <div className="flex flex-row items-center text-xs text-muted-foreground">
        {timeType === "BAKE" ? "Bake time:" : "Prep time:"} { hourValueFromMinutes(time) } hours { minutesValueFromMinutes(time) } minutes
        <Button
          onClick={() => handleOpenChange(true)}
          variant="link"
          className="h-4 w-4 p-0 pl-3"
          size="icon"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set {timeType === "BAKE" ? "bake" : "preparatation"} time</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <TimeCounter
            label="Hours"
            value={hoursInput}
            onChange={(v) => setHoursInput(clampNonNegative(v))}
          />
          <TimeCounter
            label="Minutes"
            value={minutesInput}
            step={5}
            onChange={(v) => setMinutesInput(clampMinutes(v))}
          />
        </div>

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