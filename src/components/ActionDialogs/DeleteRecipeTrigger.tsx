import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#components/ui/alert-dialog"
import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "#components/ui/alert"
import { recipeService } from '../../services/RecipeService';
import { Button } from "#components/ui/button"
import { Trash2Icon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";

interface DeleteRecipeTriggerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  recipeId: string;
}

export function DeleteRecipeTrigger({ isOpen, setIsOpen, recipeId }: DeleteRecipeTriggerProps) {
  const queryClient = useQueryClient();
  const [showAlert, setShowAlert] = useState(false);

  const deleteRecipeMutation = useMutation({
    mutationFn: (id: string) => recipeService.deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipesList'] });
      setIsOpen(false);
    },
    onError: () => {
      setShowAlert(true);
    }
  });

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger onClick={() => setIsOpen(true)} render={<Button variant="outline" size="icon"><Trash2Icon /></Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
          { showAlert && <DeleteFailureAlert /> }
          <AlertDialogDescription>
            This will permanently delete all recipe details and history. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
          <AlertDialogAction onClick={() => deleteRecipeMutation.mutate(recipeId)}>Delete recipe</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DeleteFailureAlert() {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Deletion failed</AlertTitle>
      <AlertDescription>
        Please refresh and try again.
      </AlertDescription>
    </Alert>
  )
}
