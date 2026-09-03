import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Info } from 'lucide-react';

import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "#components/SharedComponents/ui/alert-dialog";
import { Field, FieldContent, FieldLabel } from "#components/SharedComponents/ui/field";

import { useToast } from "../../contexts/ToastContext";
import { bakeService } from "../../services/BakeService";
import { Button } from "#components/SharedComponents/ui/button";
import { Checkbox } from "#components/SharedComponents/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "#components/SharedComponents/ui/tooltip";

export function CompleteBakeTrigger({ bakeId, recipeId }: { bakeId: string, recipeId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [deltasAsBest, setDeltasAsBest] = useState(false);

  const { mutate: completeBake, isPending: isCompleting } = useMutation({
    mutationFn: () => bakeService.completeBake(bakeId, { setDeltasAsBest: deltasAsBest }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes"] });
      queryClient.invalidateQueries({ queryKey: ["bake", bakeId] });
      queryClient.invalidateQueries({ queryKey: ["bakes", "recipe", recipeId] });
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
            <Field orientation="horizontal" className="pt-6">
              <Checkbox
                name="setDeltasAsBestCheckbox"
                onCheckedChange={(checked) => setDeltasAsBest(checked)}
              />
              <FieldContent>
                <FieldLabel htmlFor="setDeltasAsBestCheckbox">
                  <span>Update the recipe with these versions</span>
                  <Tooltip>
                    <TooltipTrigger render={ <Info className="h-4 w-4" /> } />
                    <TooltipContent className="flex flex-col gap-2">
                      <p>By clicking this checkbox, the recipe's ingredients and instructions will be updated with the changes you made here.</p>
                      <p>You can always update them at a later time from the main recipe view.</p>
                    </TooltipContent>
                  </Tooltip>
                </FieldLabel>
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