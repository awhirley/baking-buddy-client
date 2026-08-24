import { useNavigate } from "react-router-dom";

import { type RecipeDetail } from '../../types/Types';
import { Badge } from '#components/ui/badge';
import { Button } from '#components/ui/button';
import { ButtonGroup } from "#components/ui/button-group"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '#components/ui/card';
import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { useState } from "react";

export function Recipe({ recipe }: { recipe: RecipeDetail }) {
  return (
    <Card className="mb-4 outline-1 transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
        <CardAction className="flex flex-row gap-x-4">
          <ActionMenu recipeId={recipe.id}/>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {recipe.recipeSource && (
            <>
              <span>Source: {recipe.recipeSource}</span>
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

function ActionMenu({ recipeId }: { recipeId: string }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <DeleteRecipeTrigger isOpen={isOpen} setIsOpen={setIsOpen} recipeId={recipeId} />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" onClick={() => console.log("New!")}>New Bake</Button>
        <Button variant="outline" onClick={() => navigate(`/view/${recipeId}`)}>View Recipe</Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}

function formatAddedDate(iso: string): string {
  const trimmed = iso.replace(/(\.\d{3})\d+/, "$1");
  const date = new Date(trimmed);

  if (isNaN(date.getTime())) return "recently";

  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}