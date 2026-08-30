// BakeList.tsx
import { useQuery } from "@tanstack/react-query";
import { bakeService } from "../../services/BakeService";
import { type BakeDetail } from "../../types/BakeTypes";
import { H3 } from "../SharedComponents/ui/typography";
import { BakeCard } from "./BakeCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Skeleton } from "#components/SharedComponents/ui/skeleton";
import { useParams } from "react-router-dom";

export function BakeList() {
  const { recipeId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: recipeId ? ["bakes", "recipe", recipeId] : ["bakes"],
    queryFn: async () => {
      const response = recipeId ? await bakeService.listBakesForRecipe(recipeId) : await bakeService.listBakes();
      return response;
    },
  });

  const sortedBakes = data
    ?.slice()
    .sort((a, b) => {
      // Open bakes (no endDatetime) first, most recently started first;
      // completed bakes after, most recently completed first.
      if (a.endDatetime === null && b.endDatetime !== null) return -1;
      if (a.endDatetime !== null && b.endDatetime === null) return 1;
      if (a.endDatetime === null && b.endDatetime === null) {
        return b.startDatetime.localeCompare(a.startDatetime);
      }
      return b.endDatetime!.localeCompare(a.endDatetime!);
    });

  return (
    <div>
      <H3 className="mb-4">Bakes</H3>
      {isLoading && <ListLoadingSkeleton />}
      {error !== null ? (
        <ListErrorView />
      ) : (
        sortedBakes?.map((bake: BakeDetail) => <BakeCard key={bake.id} bake={bake} />)
      )}
      {!isLoading && !error && sortedBakes?.length === 0 && <EmptyView />}
    </div>
  );
}

function EmptyView() {
  return (
    <Card className="mb-4 outline-1">
      <CardHeader>
        <CardTitle>No bakes yet</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Start a bake from a recipe to see it show up here.
      </CardContent>
    </Card>
  );
}

// TODO: make this better
function ListErrorView() {
  return (
    <Card className="mb-4 outline-1">
      <CardHeader>
        <CardTitle>Oh no!</CardTitle>
      </CardHeader>
      <CardContent>An error occured while loading the bakes. Please refresh to try again.</CardContent>
    </Card>
  );
}

function ListLoadingSkeleton() {
  return (
    <Card className="mb-4 outline-1">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-1/4" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/2" />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
