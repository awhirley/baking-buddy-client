import { useParams } from "react-router-dom";
import { Header } from "../components/HomePage/Header";
import { recipeService } from "../services/RecipeService";
import { skipToken, useQuery } from "@tanstack/react-query";
import type { Ingredient, Instruction } from "../types/Types";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Pencil, StickyNote, AlertCircle } from "lucide-react";

export function ViewRecipe() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipe", id],
    queryFn: id
      ? async () => {
          const response = await recipeService.getRecipeById(id!);
          return response;
        }
      : skipToken,
  });

  return (
    <div className="px-30 py-20">
      <div className="grid grid-cols-1 gap-6 justify-items-center">
        <Header />

        <div className="w-full max-w-3xl">
          {isLoading && <RecipeSkeleton />}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Couldn't load this recipe</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : "Something went wrong. Try refreshing the page."}
              </AlertDescription>
            </Alert>
          )}

          {data && (
            <div className="flex flex-col gap-6">
              <RecipeDetailsCard
                name={data.name}
                description={data.description}
                recipeSource={data.recipeSource}
                tags={data.tags}
                tools={data.tools}
              />

              <IngredientsSection ingredients={data.ingredients} />

              <InstructionsSection instructions={data.instructions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecipeDetailsCard({
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

function IngredientsSection({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id}>
            <div className="flex items-center justify-between py-2 gap-4">
              <span className="text-sm">
                <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
              </span>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" aria-label="Add note">
                  <StickyNote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Edit ingredient">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {index < ingredients.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function InstructionsSection({ instructions }: { instructions: Instruction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {instructions.map((instruction, index) => (
          <div key={instruction.id}>
            <div className="flex items-start justify-between py-2 gap-4">
              <span className="text-sm">
                <span className="font-medium text-muted-foreground">{index + 1}.</span>{" "}
                {instruction.description}
              </span>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" aria-label="Add note">
                  <StickyNote className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Edit instruction">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {index < instructions.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecipeSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/2" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </CardContent>
      </Card>
    </div>
  );
}