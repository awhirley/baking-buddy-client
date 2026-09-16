import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#components/SharedComponents/ui/alert-dialog"
import { AlertCircleIcon, NotebookPen } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "#components/SharedComponents/ui/alert"
import { Button } from "#components/SharedComponents/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useToast } from "../../contexts/ToastContext";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { BakeStorageService } from "../../services/BakeStorageService";
import { Tooltip, TooltipContent, TooltipTrigger } from "#components/SharedComponents/ui/tooltip"

interface SetImageAsRecipeDisplayTriggerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  bakeImageId: string;
  recipeId: string;
}

export function SetImageAsRecipeDisplayTrigger({ isOpen, setIsOpen, bakeImageId, recipeId }: SetImageAsRecipeDisplayTriggerProps) {
  const queryClient = useQueryClient();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const setImageMutation = useMutation({
    mutationFn: () => BakeStorageService.setImageAsRecipeDisplay(bakeImageId, recipeId),
    onSuccess: () => {
      addToast('Image set as recipe display image', null, { type: 'default' });
      queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
      setIsOpen(false);
      setIsLoading(false);
    },
    onError: () => {
      setShowAlert(true);
      setIsLoading(false);
    }
  });

  const handleSetImage = () => {
    setIsLoading(true);
    setImageMutation.mutate();
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger render={
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="secondary" onClick={() => setIsOpen(true)} size="icon"><NotebookPen /></Button>
            }
          />
          <TooltipContent>
            <p>Set image as recipe display photo</p>
          </TooltipContent>
        </Tooltip>
      } />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set image as recipe display?</AlertDialogTitle>
          { showAlert && <SetFailureAlert /> }
          <AlertDialogDescription>
            This image will become the display thumbnail for the recipe around the application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
          <LoadingButton onClick={handleSetImage} isLoading={isLoading} variant="default">Set</LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SetFailureAlert() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Failed to set image as display</AlertTitle>
      <AlertDescription>
        Please refresh and try again.
      </AlertDescription>
    </Alert>
  )
}
