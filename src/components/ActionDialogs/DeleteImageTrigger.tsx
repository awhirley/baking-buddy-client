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
import { Button } from "#components/SharedComponents/ui/button"
import { Trash2Icon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useToast } from "../../contexts/ToastContext";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { BakeStorageService } from "../../services/BakeStorageService";

interface DeleteImageTriggerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  bakeId: string;
  path: string;
}

export function DeleteImageTrigger({ isOpen, setIsOpen, bakeId, path }: DeleteImageTriggerProps) {
  const queryClient = useQueryClient();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const deleteImageMutation = useMutation({
    mutationFn: () => BakeStorageService.deleteBakeImage(bakeId, path),
    onSuccess: () => {
      addToast('Image was deleted successfully!', null, { type: 'default' });
      queryClient.invalidateQueries({ queryKey: ['bakes', bakeId, 'images'] });
      setIsOpen(false);
      setIsLoading(false);
    },
    onError: () => {
      setShowAlert(true);
    }
  });

  const handleDelete = () => {
    setIsLoading(true);
    deleteImageMutation.mutate();
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger onClick={() => setIsOpen(true)} render={<Button variant="secondary" size="icon"><Trash2Icon /></Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete image?</AlertDialogTitle>
          { showAlert && <DeleteFailureAlert /> }
          <AlertDialogDescription>
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button>
          <LoadingButton onClick={handleDelete} isLoading={isLoading} variant="default">Delete image</LoadingButton>
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
