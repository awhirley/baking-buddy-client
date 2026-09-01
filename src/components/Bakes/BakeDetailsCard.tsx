// components/Bake/BakeDetailsCard.tsx
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { formatAddedDate } from "#components/RecipeList/utils";
import type { BakeDetail, BakeRating, UpdateBakePayload } from "../../types/BakeTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../contexts/ToastContext";
import { bakeService } from "../../services/BakeService";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "#components/SharedComponents/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#components/SharedComponents/ui/dialog";
import { Input } from "#components/SharedComponents/ui/input";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { Field, FieldContent, FieldDescription, FieldLabel } from "#components/SharedComponents/ui/field";
import { Checkbox } from "#components/SharedComponents/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { recipeService } from "../../services/RecipeService";
import { P } from "#components/SharedComponents/ui/typography";
import { Rating } from "#components/SharedComponents/ui/rating";

// overall: star
// taste: utensils
// texture: waves-horizontal
// appearance: eye
// rise & structure: chevrons-up
// difficulty: sword or swords

const RATING_FIELDS: { key: keyof Omit<BakeRating, "createdAt">; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "taste", label: "Taste" },
  { key: "texture", label: "Texture" },
  { key: "appearance", label: "Appearance" },
  { key: "riseStructure", label: "Rise / Structure" },
  { key: "difficulty", label: "Difficulty" },
];

export function BakeDetailsCard({ id, recipeId, recipeName, startDatetime, endDatetime, elevation, notes, ratings }: BakeDetail) {
   const { data } = useQuery({
      queryKey: ["recipe", recipeId],
      queryFn: async () => {
          const response = await recipeService.getRecipeById(recipeId!);
          return response;
        }
    });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Bake Session: {recipeName}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Started {formatAddedDate(startDatetime)}
            {endDatetime && <span>, completed {formatAddedDate(endDatetime)}</span>}
          </p>
          <P>{`Elevation: ${elevation != null ? `${elevation}ft` : "null"}`}</P>
          <P>{data?.details.description ? `Description: ${data.details.description}` : "Description: N/A"}</P>
        </div>
        <div className="flex items-center gap-2">
          <EditBakeDetailsTrigger bakeId={id} elevation={elevation} notes={notes} ratings={ratings} />
          {!endDatetime && <CompleteBakeTrigger bakeId={id} recipeId={recipeId} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes && <p className="text-sm">{notes}</p>}
        <RatingsSummary ratings={ratings} />
      </CardContent>
    </Card>
  );
}

function RatingsSummary({ ratings }: { ratings: BakeRating }) {
  const hasAnyRating = RATING_FIELDS.some(({ key }) => ratings?.[key] != null);

  if (!hasAnyRating) {
    return <p className="text-sm text-muted-foreground">No ratings yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
      {RATING_FIELDS.map(({ key, label }) => {
        const value = ratings?.[key];
        return (
          <div key={key} className="flex flex-col">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value != null ? `${value}/5` : "—"}</span>
            <Rating
              value={value != null ? value : 0}
              max={5}
              disabled
            />
          </div>
        );
      })}
    </div>
  );
}

function EditBakeDetailsTrigger({ bakeId, elevation, notes, ratings }: { bakeId: string; elevation: number | null; notes: string | null; ratings: BakeRating }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const buildInitialRatingsInput = () =>
    RATING_FIELDS.reduce((acc, { key }) => {
      const value = ratings?.[key];
      acc[key] = value != null ? String(value) : "";
      return acc;
    }, {} as Record<string, string>);

  const [elevationInput, setElevationInput] = useState<string>(elevation != null ? String(elevation) : "");
  const [ratingsInput, setRatingsInput] = useState<Record<string, string>>(buildInitialRatingsInput);

  const resetForm = () => {
    setElevationInput(elevation != null ? String(elevation) : "");
    setRatingsInput(buildInitialRatingsInput());
  };

  const { mutate: updateDetails, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const parsedElevation = elevationInput.trim() === "" ? null : Number(elevationInput);

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
        parsedRatings[key] = raw.trim() === "" ? null : Number(raw);
      });

      const payload: UpdateBakePayload = {
        bakeId,
        elevation: parsedElevation,
        notes,
        ratings: parsedRatings,
      };

      return bakeService.updateBake(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes"] });
      queryClient.invalidateQueries({ queryKey: ["bake", bakeId] });
      addToast("Bake details updated", null, { type: "default" });
      setIsOpen(false);
    },
    onError: () => {
      addToast("Failed to update bake details", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsOpen(open);
  };

  const handleRatingChange = (key: string, value: string) => {
    setRatingsInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button variant="outline" onClick={() => handleOpenChange(true)}>
        Edit details
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit bake details</DialogTitle>
          <DialogDescription>
            Update the elevation and ratings for this bake.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Field>
            <FieldLabel htmlFor="elevationInput">Elevation (ft)</FieldLabel>
            <Input
              id="elevationInput"
              type="number"
              value={elevationInput}
              onChange={(e) => setElevationInput(e.target.value)}
              placeholder="e.g. 5280"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            {RATING_FIELDS.map(({ key, label }) => (
              <Field key={key}>
                <FieldLabel htmlFor={`${key}Input`}>{label}</FieldLabel>
                <Input
                  id={`${key}Input`}
                  type="number"
                  min={1}
                  max={5}
                  value={ratingsInput[key]}
                  onChange={(e) => handleRatingChange(key, e.target.value)}
                  placeholder="1–5"
                />
              </Field>
            ))}
          </div>
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

function CompleteBakeTrigger({ bakeId, recipeId }: { bakeId: string, recipeId: string }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [deltasAsBest, setDeltasAsBest] = useState(false);

  const { mutate: completeBake, isPending: isCompleting } = useMutation({
    mutationFn: () => bakeService.completeBake(bakeId, { setDeltasAsBest: deltasAsBest }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes"] });
      queryClient.invalidateQueries({ queryKey: ["bakes", "recipe", recipeId] });
      addToast("Bake completed!", null, { type: "default" });
      setIsOpen(false);
       navigate(`/view/${recipeId}`);
    },
    onError: () => {
      addToast("Failed to complete bake", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Complete bake
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete this bake?</AlertDialogTitle>
          <AlertDialogDescription>
            You will still be able to report results, but you will no longer be able to update ingredients or instructions.
            <Field orientation="horizontal" className="pt-6">
              <Checkbox
                name="setDeltasAsBestCheckbox"
                onCheckedChange={(checked) => { checked ? setDeltasAsBest(true) : setDeltasAsBest(false)}}
              />
              <FieldContent>
                <FieldLabel htmlFor="setDeltasAsBestCheckbox">
                  Update the recipe with these versions
                </FieldLabel>
                <FieldDescription>
                  <p className="pt-2">By clicking this checkbox, the recipe's ingredients and instructions will be updated with the changes you made here.</p>
                  <p className="pt-2">You can always update them at a later time from the main recipe view.</p>
                </FieldDescription>
              </FieldContent>
            </Field>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCompleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <LoadingButton
              isLoading={isCompleting}
              onClick={() => completeBake()}
            >
              Complete bake
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}