import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#components/SharedComponents/ui/alert-dialog"
import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "#components/SharedComponents/ui/alert"
import { recipeService } from '../../services/RecipeService';
import { Button } from "#components/SharedComponents/ui/button"
import { Trash2Icon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";

interface DeleteRecipeTriggerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  recipeId: string;
  navigateToHome?: boolean;
  renderButton?: boolean;
}

export function DeleteRecipeTrigger({ isOpen, setIsOpen, recipeId, navigateToHome = false, renderButton = true }: DeleteRecipeTriggerProps) {
  const queryClient = useQueryClient();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const deleteRecipeMutation = useMutation({
    mutationFn: (id: string) => recipeService.deleteRecipe(id),
    onSuccess: () => {
      addToast('Recipe was deleted successfully!', null, { type: 'default' });
      queryClient.invalidateQueries({ queryKey: ['recipesList'] });
      setIsOpen(false);
      if (navigateToHome) navigate("/");
    },
    onError: () => {
      setShowAlert(true);
    }
  });

  const handleDelete = () => {
    setIsLoading(true);
    deleteRecipeMutation.mutate(recipeId);
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger onClick={() => setIsOpen(true)} render={renderButton ? <Button variant="outline" size="icon"><Trash2Icon /></Button> : <></>} />
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
          <LoadingButton onClick={handleDelete} isLoading={isLoading} variant="default">Delete recipe</LoadingButton>
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
