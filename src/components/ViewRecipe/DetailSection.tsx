import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Textarea } from "#components/SharedComponents/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import {
  ChefHat,
  MoreVertical,
  NotepadText,
  Pencil,
  PencilSparklesIcon,
  Plus,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { RecipeDetail } from "../../types/RecipeTypes";
import { formatAddedDate } from "#components/RecipeList/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { recipeService } from "../../services/RecipeService";
import { bakeService } from "../../services/BakeService";
import { useToast } from "../../contexts/ToastContext";
import { Spinner } from "#components/SharedComponents/ui/spinner";
import { Toggle } from "#components/SharedComponents/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "#components/SharedComponents/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#components/SharedComponents/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface RecipeDetailsCardProps {
  details: RecipeDetail;
  editModeOn: boolean;
  setEditModeOn: Dispatch<SetStateAction<boolean>>;
}

export function RecipeDetailsCard({ details, editModeOn, setEditModeOn }: RecipeDetailsCardProps) {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [note, setNote] = useState<string | null>(details.notes);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const { mutate: saveNote, isPending: isSaving } = useMutation({
    mutationFn: (note: string | null) => recipeService.addNotesToRecipe(details.id, note),
    onSuccess: () => {
      addToast("Note saved successfully", null, { type: "default" });
    },
    onError: () => {
      addToast("Failed to save note", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const { data: bakes } = useQuery({
    queryKey: ["bakes", "recipe", details.id],
    queryFn: () => bakeService.listBakesForRecipe(details.id),
  });

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
                , from {details.recipeSourceType} {details.recipeSource}
              </span>
            )}
          </p>

          {/*
            Rating/"refined" indicator slot: once the rating system is designed,
            this is the natural spot for it — e.g. a small row of topic scores
            or a "Refined" badge, sitting right under the source line.
          */}

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

        <div className="flex gap-2 shrink-0">
          <Tooltip>
            <TooltipTrigger
              render={
                <Toggle
                  aria-label="Toggle edit mode"
                  variant="outline"
                  pressed={editModeOn}
                  onPressedChange={setEditModeOn}
                >
                  <Pencil className="group-aria-pressed/toggle:fill-foreground" />
                </Toggle>
              }
            />
            <TooltipContent>
              <p>Turn edit mode {editModeOn ? "off" : "on"}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon" aria-label="More actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/bakes/new/${details.id}`)}>
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
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <p className="text-sm">{details.description}</p>

        {(details.tags?.length > 0 || details.tools?.length > 0) && (
          <div className="flex flex-col gap-2">
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
          </div>
        )}

        {editModeOn && (
          <div className="flex flex-col gap-2 group border-l-4 border-amber-300 pl-3 py-1 bg-input/50 rounded-xl">
            <span className="flex items-center gap-1 font-semibold pb-2">
              <NotepadText className="w-4 h-4" />
              Recipe Notes
            </span>
            <Textarea
              value={note ?? undefined}
              onChange={(event) => setNote(event.target.value)}
              className="border"
              placeholder="Recipe notes: enter anything you'd like to remember about your recipe"
            ></Textarea>
            <Button onClick={() => saveNote(note)} className="hidden group-focus-within:block self-end">
              <span className="flex items-center gap-2">
                {isSaving ? <Spinner /> : <PencilSparklesIcon />}
                Save note
              </span>
            </Button>
          </div>
        )}

        {!editModeOn && note && (
          <div className="border-l-4 border-amber-300 pl-3 py-1 bg-input/50 rounded-xl">
            <span className="flex items-center gap-1 font-semibold pb-2">
              <NotepadText className="w-4 h-4" />
              Recipe Notes
            </span>
            {note}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
