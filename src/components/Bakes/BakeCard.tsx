// BakeCard.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type BakeDetail } from "../../types/BakeTypes";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { ButtonGroup } from "#components/SharedComponents/ui/button-group";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { formatAddedDate } from "../RecipeList/utils";
import { bakeService } from "../../services/BakeService";
import { recipeService } from "../../services/RecipeService";
import { useToast } from "../../contexts/ToastContext";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#components/SharedComponents/ui/alert-dialog";
import { Trash2, Mountain } from "lucide-react";
import { RatingsSummary } from "./RatingSummary";

export function BakeCard({ bake }: { bake: BakeDetail }) {
  const isInProgress = !bake.endDatetime;

  const { data: recipe } = useQuery({
    queryKey: ["recipe", bake.recipeId],
    queryFn: () => recipeService.getRecipeById(bake.recipeId!),
  });

  return (
    <Card className="mb-4 outline-1 transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {recipe?.details.name ?? "Loading recipe…"}
          {isInProgress && (
            <Badge variant="secondary">
              In progress
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Started {formatAddedDate(bake.startDatetime)}
          {!isInProgress && bake.endDatetime && <span> · Completed {formatAddedDate(bake.endDatetime)}</span>}
        </CardDescription>
        <CardAction className="flex flex-row gap-x-4">
          <BakeActionMenu bake={bake} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-4 text-xs text-muted-foreground">
          {bake.elevation != null && (
            <span className="flex items-center gap-1">
              <Mountain className="h-3 w-3" />
              {bake.elevation}ft elevation
            </span>
          )}
        </div>

        {!isInProgress && bake.ratings && (
          <div className="border-t pt-3">
            <RatingsSummary ratings={bake.ratings} />
          </div>
        )}

        {bake.notes && <p className="text-sm text-muted-foreground italic line-clamp-2">{bake.notes}</p>}
      </CardContent>
    </Card>
  );
}

function BakeActionMenu({ bake }: { bake: BakeDetail }) {
  const navigate = useNavigate();
  const isInProgress = bake.endDatetime === null;

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" onClick={() => navigate(`/bake/${bake.id}`)}>
          {isInProgress ? "Continue Bake" : "View Bake"}
        </Button>
      </ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <DeleteBakeTrigger bakeId={bake.id} recipeId={bake.recipeId} />
      </ButtonGroup>
    </ButtonGroup>
  );
}

function DeleteBakeTrigger({ bakeId, recipeId }: { bakeId: string; recipeId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { mutate: deleteBake, isPending: isDeleting } = useMutation({
    mutationFn: () => bakeService.deleteBake(bakeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bakes"] });
      queryClient.invalidateQueries({ queryKey: ["bakes", "recipe", recipeId] });
      addToast("Bake deleted", null, { type: "default" });
      setIsOpen(false);
    },
    onError: () => {
      addToast("Failed to delete bake", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button variant="outline" size="icon" aria-label="Delete bake" onClick={() => setIsOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this bake?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this bake session and its notes. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <LoadingButton
              variant="default"
              isLoading={isDeleting}
              onClick={() => deleteBake()}
            >
              Delete
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
