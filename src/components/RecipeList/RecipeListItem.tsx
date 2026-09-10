import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Clock, Star, Sword } from "lucide-react";

import { type RecipeDetail } from '../../types/RecipeTypes';
import { Badge } from '#components/SharedComponents/ui/badge';
import { Button } from '#components/SharedComponents/ui/button';
import { ButtonGroup } from "#components/SharedComponents/ui/button-group"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '#components/SharedComponents/ui/card';
import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { formatAddedDate, formatDuration } from "./utils";
import { bakeService } from "../../services/BakeService";
import { useToast } from "../../contexts/ToastContext";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";

const MAX_DIFFICULTY = 5;

export function RecipeListItem({ recipe }: { recipe: RecipeDetail }) {
  return (
    <Card className="mb-4 outline-1 transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {recipe.name}
          {recipe.favorite && (
            <Star
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
              aria-label="Favorite recipe"
            />
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
        <CardAction className="flex flex-row gap-x-4">
          <ActionMenu recipeId={recipe.id} openBakeId={recipe.openBakeId}/>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {(recipe.recipeSource || recipe.recipeSourceType) && (
            <>
              <span>Source: {recipe.recipeSourceType} {recipe.recipeSource}</span>
              <span aria-hidden="true">•</span>
            </>
          )}
          <span>Added {formatAddedDate(recipe.createdAt)}</span>
        </div>

        {(recipe.prepTime != null || recipe.bakeTime != null) && (
          <div className="flex flex-wrap items-center gap-x-4 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {recipe.prepTime != null && (
              <span className="flex items-center gap-1">
                Prep: {formatDuration(recipe.prepTime)}
              </span>
            )}
            {recipe.bakeTime != null && (
              <span className="flex items-center gap-1">
                Bake: {formatDuration(recipe.bakeTime)}
              </span>
            )}
          </div>
        )}

        {recipe.difficultyRating != null && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Difficulty:</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: MAX_DIFFICULTY }).map((_, i) => (
                <Sword
                  key={i}
                  className={
                    i < recipe.difficultyRating!
                      ? "h-3.5 w-3.5 fill-primary text-primary"
                      : "h-3.5 w-3.5 text-muted-foreground/40"
                  }
                />
              ))}
            </div>
          </div>
        )}

        {(recipe.tags.length > 0 || recipe.tools.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {recipe.tools.map((tool) => (
              <Badge key={tool} variant="outline">
                {tool}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActionMenu({ recipeId, openBakeId }: { recipeId: string, openBakeId: string | null }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: createBake, isPending: isCreating } = useMutation({
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
    createBake(recipeId);
  };

  return (
    <ButtonGroup>
      <ButtonGroup>
        { !openBakeId && 
          <LoadingButton variant="outline" onClick={() => handleBakeCreate()} isLoading={isCreating}>
            New Bake
          </LoadingButton>
        }
        { openBakeId && <Button variant="outline" onClick={() => navigate(`/bake/${openBakeId}`)}>See In Progress Bake</Button>}
        <Button variant="outline" onClick={() => navigate(`/recipe/${recipeId}`)}>View Recipe</Button>
      </ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <DeleteRecipeTrigger isOpen={isOpen} setIsOpen={setIsOpen} recipeId={recipeId} />
      </ButtonGroup>
    </ButtonGroup>
  )
}