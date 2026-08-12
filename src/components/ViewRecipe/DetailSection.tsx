import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card";
import { Pencil } from "lucide-react";

export function RecipeDetailsCard({
  name,
  description,
  recipeSource,
  tags,
  tools,
}: {
  name: string;
  description: string;
  recipeSource: string | null;
  tags: string[];
  tools: string[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">{name}</CardTitle>
          {recipeSource && (
            <p className="text-sm text-muted-foreground mt-1">Source: {recipeSource}</p>
          )}
        </div>
        <Button variant="outline" size="icon" aria-label="Edit recipe details">
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm">{description}</p>

        {(tags.length > 0 || tools.length > 0) && (
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
