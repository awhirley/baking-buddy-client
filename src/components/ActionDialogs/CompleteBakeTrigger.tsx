import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "#components/SharedComponents/ui/alert-dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "#components/SharedComponents/ui/field";

import { useToast } from "../../contexts/ToastContext";
import { bakeService } from "../../services/BakeService";
import { Button } from "#components/SharedComponents/ui/button";
import { Checkbox } from "#components/SharedComponents/ui/checkbox";

export function CompleteBakeTrigger({ bakeId, recipeId }: { bakeId: string, recipeId: string }) {
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