// components/Bake/BakeDetailsCard.tsx
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { formatAddedDate } from "#components/RecipeList/utils";
import type { BakeDetail, CompleteBakePayload } from "../../types/BakeTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../contexts/ToastContext";
import { bakeService } from "../../services/BakeService";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "#components/SharedComponents/ui/alert-dialog";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";

export function BakeDetailsCard({ id, startDatetime, endDatetime, elevation, notes }: BakeDetail) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Bake Session</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Started {formatAddedDate(startDatetime)}
            {endDatetime && <span>, completed {formatAddedDate(endDatetime)}</span>}
            {elevation != null && <span>, {elevation}ft elevation</span>}
          </p>
        </div>
        <CompleteBakeTrigger bakeId={id} />
      </CardHeader>
      {notes && (
        <CardContent>
          <p className="text-sm">{notes}</p>
        </CardContent>
      )}
    </Card>
  );
}

function CompleteBakeTrigger({ bakeId }: { bakeId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [deltasAsBest, setDeltasAsBest] = useState(false);

  const { mutate: completeBake, isPending: isCompleting } = useMutation({
    mutationFn: () => bakeService.completeBake(bakeId, { setDeltasAsBest: deltasAsBest }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes"] });
      // queryClient.invalidateQueries({ queryKey: ["bakes", "recipe", recipeId] });
      addToast("Bake completed!", null, { type: "default" });
      setIsOpen(false);
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