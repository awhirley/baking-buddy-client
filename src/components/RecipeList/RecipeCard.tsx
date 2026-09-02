import { useNavigate } from "react-router-dom";

import { type RecipeDetail } from '../../types/RecipeTypes';
import { Badge } from '#components/SharedComponents/ui/badge';
import { Button } from '#components/SharedComponents/ui/button';
import { ButtonGroup } from "#components/SharedComponents/ui/button-group"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '#components/SharedComponents/ui/card';
import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { useState } from "react";
import { formatAddedDate } from "./utils";
import { bakeService } from "../../services/BakeService";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../contexts/ToastContext";
import { LoadingButton } from "#components/SharedComponents/LoadingButton";

export function Recipe({ recipe }: { recipe: RecipeDetail }) {
  return (
    <Card className="mb-4 outline-1 transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
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
      <ButtonGroup className="hidden sm:flex">
        <DeleteRecipeTrigger isOpen={isOpen} setIsOpen={setIsOpen} recipeId={recipeId} />
      </ButtonGroup>
      <ButtonGroup>
        { !openBakeId && 
          <LoadingButton variant="outline" onClick={() => handleBakeCreate()} isLoading={isCreating}>
            New Bake
          </LoadingButton>
        }
        { openBakeId && <Button variant="outline" onClick={() => navigate(`/bake/${openBakeId}`)}>See In Progress Bake</Button>}
        <Button variant="outline" onClick={() => navigate(`/view/${recipeId}`)}>View Recipe</Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
