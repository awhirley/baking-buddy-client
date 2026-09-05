import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import {
  ChefHat,
  MoreVertical,
  Plus,
  Sword,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { RecipeDetail } from "../../types/RecipeTypes";
import { formatAddedDate } from "#components/RecipeList/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { bakeService } from "../../services/BakeService";
import { useToast } from "../../contexts/ToastContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#components/SharedComponents/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { UpdateRecipeDetailsTrigger } from "#components/ActionDialogs/UpdateRecipeDetailsTrigger";
import { Rating } from "#components/SharedComponents/ui/rating";

interface RecipeDetailsCardProps {
  details: RecipeDetail;
  editModeOn: boolean;
  setEditModeOn: Dispatch<SetStateAction<boolean>>;
}

export function RecipeDetailsCard({ details, editModeOn, setEditModeOn }: RecipeDetailsCardProps) {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [updateDialogIsOpen, setUpdateDialogIsOpen] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const { data: bakes } = useQuery({
    queryKey: ["bakes", "recipe", details.id],
    queryFn: () => bakeService.listBakesForRecipe(details.id),
  });

  const { mutate: createBake } = useMutation({
    mutationFn: (recipeId: string) =>
      bakeService.createBake(recipeId),
    onSuccess: (data) => {
      addToast('New bake started!', null, { type: 'default' });
      navigate(`/bake/${data.id}`)
    },
    onError: () => {
      addToast('Failed to start new bake', "Please try again.", { type: 'destructive', duration: 6000 });
    },
  });

  const handleBakeCreate = () => {
    createBake(details.id);
  };

  const sortedBakes = bakes?.slice().sort((a, b) => b.startDatetime.localeCompare(a.startDatetime)) ?? [];
  const mostRecentBake = sortedBakes[0];
  const openBake = sortedBakes.find((bake) => bake.endDatetime === null);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl">{details.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Added {formatAddedDate(details.createdAt)}
            {(details.recipeSourceType || details.recipeSource) && (
              <span>
                , from {details.recipeSourceType}: {details.recipeSource}
              </span>
            )}
          </p>

          {bakes && (
            <button
              type="button"
              onClick={() => navigate(`/bakes/${details.id}`)} // TODO this is wrong
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-1 w-fit"
            >
              <ChefHat className="h-3.5 w-3.5" />
              {sortedBakes.length === 0 ? (
                <span>No bakes yet</span>
              ) : (
                <span>
                  {sortedBakes.length} bake{sortedBakes.length !== 1 && "s"}
                  {openBake ? (
                    <span className="text-amber-600 font-medium"> · Bake in progress</span>
                  ) : (
                    mostRecentBake && <span> · Last baked {formatAddedDate(mostRecentBake.startDatetime)}</span>
                  )}
                </span>
              )}
            </button>
          )}
        </div>

        <CardAction className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" size="icon" aria-label="More actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-full">
              <DropdownMenuItem onClick={() => setUpdateDialogIsOpen(true)}>
                Edit recipe details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditModeOn(!editModeOn)}>
                Turn recipe edit mode { editModeOn ? "off" : "on"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleBakeCreate}>
                <Plus className="h-4 w-4 mr-2" />
                New bake
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!mostRecentBake}
                onClick={() => mostRecentBake && navigate(`/bakes/${mostRecentBake.id}`)}
              >
                Go to most recent bake
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/recipes/${details.id}/bakes`)}>
                See all bakes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteDialogIsOpen(true)}
              >
                Delete recipe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteRecipeTrigger
            recipeId={details.id}
            isOpen={deleteDialogIsOpen}
            setIsOpen={setDeleteDialogIsOpen}
            navigateToHome={true}
            renderButton={false}
          />
          <UpdateRecipeDetailsTrigger
            isOpen={updateDialogIsOpen}
            setIsOpen={setUpdateDialogIsOpen}
            recipe={{ ...details }}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <p className="text-sm">{details.description}</p>

        {(details.tags?.length > 0 || details.tools?.length > 0) && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Prep time:</span>
              X minutes
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Bake time:</span>
              X minutes
            </div>
            {details.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Tags:</span>
                {details.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {details.tools.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Tools:</span>
                {details.tools.map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            )}
            {details.difficultyRating && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Difficulty rating:</span>
                <Rating value={details.difficultyRating} max={5} icon={<Sword />} readOnly />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
