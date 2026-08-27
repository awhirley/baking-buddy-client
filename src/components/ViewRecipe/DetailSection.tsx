import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { Badge } from "#components/SharedComponents/ui/badge";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Pencil } from "lucide-react";
import { useState } from "react";
import type { RecipeDetail } from "../../types/RecipeTypes";
import { formatAddedDate } from "#components/RecipeList/utils";

export function RecipeDetailsCard({
  id,
  name,
  description,
  recipeSourceType,
  recipeSource,
  tags,
  tools,
  createdAt,
}: RecipeDetail) {
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">{name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Added {formatAddedDate(createdAt)}
            { (recipeSourceType || recipeSource) && <span>, from {recipeSourceType} {recipeSource}</span>}
            {/* { (recipeSourceType || recipeSource) && <span className='pl-4'>Source: {recipeSourceType} {recipeSource}</span>} */}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" aria-label="Edit recipe details">
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteRecipeTrigger recipeId={id} isOpen={deleteDialogIsOpen} setIsOpen={setDeleteDialogIsOpen} navigateToHome={true} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm">{description}</p>

        {(tags?.length > 0 || tools?.length > 0) && (
          <div className="flex flex-col gap-2">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {tools.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
