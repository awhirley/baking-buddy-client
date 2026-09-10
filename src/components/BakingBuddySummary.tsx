import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChefHat, NotebookTabs, Plus, Star, type LucideIcon } from "lucide-react";

import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent } from "#components/SharedComponents/ui/card";
import { recipeService } from "../services/RecipeService";
import { bakeService } from "../services/BakeService";
import { BakeCard } from "./Bakes/BakeCard";
import { RecipeListItem } from "./RecipeList/RecipeListItem";

export function BakingBuddySummary() {
  const navigate = useNavigate();

  const { data: recipes = [] } = useQuery({
    queryKey: ["recipes"],
    queryFn: () => recipeService.listRecipes(),
  });

  const { data: bakes = [] } = useQuery({
    queryKey: ["bakes"],
    queryFn: () => bakeService.listBakes(),
  });

  const recentBakes = useMemo(
    () =>
      [...bakes]
        .sort((a, b) => new Date(b.startDatetime).getTime() - new Date(a.startDatetime).getTime())
        .slice(0, 3),
    [bakes],
  );

  const favoriteRecipes = useMemo(() => {
    // Most recent bake date per recipe; recipes never baked sort first (oldest/never = most "due").
    const lastBakedByRecipe = new Map<string, number>();
    for (const bake of bakes) {
      const time = new Date(bake.startDatetime).getTime();
      const existing = lastBakedByRecipe.get(bake.recipeId);
      if (existing === undefined || time > existing) {
        lastBakedByRecipe.set(bake.recipeId, time);
      }
    }

    return recipes
      .filter((recipe) => recipe.favorite)
      .sort((a, b) => {
        const aLast = lastBakedByRecipe.get(a.id) ?? -Infinity;
        const bLast = lastBakedByRecipe.get(b.id) ?? -Infinity;
        return aLast - bLast;
      })
      .slice(0, 3);
  }, [recipes, bakes]);

  const stats = {
    recipeCount: recipes.length,
    bakeCount: bakes.length,
    favoriteCount: recipes.filter((r) => r.favorite).length,
  };

  return (
    <div className="flex flex-col gap-8 mx-auto max-w-3xl py-8">
      <section className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">What would you like to bake?</h1>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/create")}>
            <Plus className="h-4 w-4" />
            New Recipe
          </Button>
          <Button variant="outline" onClick={() => navigate("/recipes")}>
            <NotebookTabs className="h-4 w-4" />
            See Recipes
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatCard
          icon={NotebookTabs}
          label="recipe"
          value={stats.recipeCount}
          onClick={() => navigate("/recipes")}
        />
        <StatCard
          icon={ChefHat}
          label="bake"
          value={stats.bakeCount}
          onClick={() => navigate("/bakes")}
        />
        <StatCard
          icon={Star}
          label="favorite"
          value={stats.favoriteCount}
          onClick={() => navigate("/recipes?favorite=true")}
        />
      </section>

      <section className="flex flex-col">
        <h2 className="text-lg font-semibold pb-3">Recent Bakes</h2>
        {recentBakes.length === 0 && (
          <p className="text-sm text-muted-foreground">No bakes yet.</p>
        )}
        {recentBakes.map((bake) => (
          <BakeCard key={bake.id} bake={bake} />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Favorites you haven't baked in a while</h2>
        {favoriteRecipes.length === 0 && (
          <p className="text-sm text-muted-foreground">No favorited recipes yet.</p>
        )}
        {favoriteRecipes.map((recipe) => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center gap-2 py-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xl leading-none"> <span className="font-bold">{value} </span>{label}{ value !== 1 ? 's' : ''}</span>
      </CardContent>
    </Card>
  );
}