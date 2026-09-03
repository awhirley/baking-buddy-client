import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { Field, FieldLabel } from "#components/SharedComponents/ui/field";

import { useToast } from "../../contexts/ToastContext";
import { bakeService } from "../../services/BakeService";
import { Button } from "#components/SharedComponents/ui/button";
import { RATING_FIELDS } from "#components/Bakes/RatingSummary";
import type { BakeRating, UpdateBakePayload } from "../../types/BakeTypes";
import { DialogContent, DialogHeader, DialogFooter, Dialog, DialogTitle, DialogDescription } from "#components/SharedComponents/ui/dialog";
import { Rating } from "#components/SharedComponents/ui/rating";

export function UpdateBakeRatingsTrigger({ bakeId, ratings }: { bakeId: string; elevation: number | null; notes: string | null; ratings: BakeRating }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const buildInitialRatingsInput = () =>
    RATING_FIELDS.reduce((acc, { key }) => {
      const value = ratings?.[key];
      acc[key] = value != null ? value : null;
      return acc;
    }, {} as Record<string, number | null>);

  const [ratingsInput, setRatingsInput] = useState<Record<string, number | null>>(buildInitialRatingsInput);

  const resetForm = () => {
    setRatingsInput(buildInitialRatingsInput());
  };

  const { mutate: updateDetails, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const parsedRatings: BakeRating = {
        overall: null,
        taste: null,
        texture: null,
        appearance: null,
        riseStructure: null,
        difficulty: null,
        createdAt: ratings?.createdAt ?? new Date().toISOString(),
      };
      RATING_FIELDS.forEach(({ key }) => {
        const raw = ratingsInput[key];
        if (raw === 0) {
          parsedRatings[key] = null;
        } else {
          parsedRatings[key] = raw;
        }
      });

      const payload: UpdateBakePayload = {
        bakeId,
        elevation: undefined,
        notes: undefined,
        ratings: parsedRatings,
      };

      return bakeService.updateBake(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes"] });
      queryClient.invalidateQueries({ queryKey: ["bake", bakeId] });
      addToast("Bake ratings updated", null, { type: "default" });
      setIsOpen(false);
    },
    onError: () => {
      addToast("Failed to update bake ratings", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsOpen(open);
  };

  const handleRatingChange = (key: string, value: number) => {
    setRatingsInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button variant="outline" onClick={() => handleOpenChange(true)}>Rate</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate this bake</DialogTitle>
          <DialogDescription>
            Update the ratings for this bake.
          </DialogDescription>
        </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            {RATING_FIELDS.map(({ key, label, icon }) => (
              <Field key={key}>
                <FieldLabel htmlFor={`${key}Input`}>{label}</FieldLabel>
                <Rating
                  id={`${key}Rating`}
                  value={ratingsInput[key] ? Number(ratingsInput[key]) : undefined}
                  onValueChange={(e) => handleRatingChange(key, e) }
                  icon={icon}
                />
              </Field>
            ))}
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