import { useQuery } from "@tanstack/react-query";
import { bakeService } from "../../services/BakeService";
import { type BakeDetail } from "../../types/BakeTypes";
import { H3 } from "../SharedComponents/ui/typography";
import { BakeListItem } from "./BakeListItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Skeleton } from "#components/SharedComponents/ui/skeleton";
import { deltaService } from "../../services/DeltaService";

type BakesFilter =
  | { type: "all" }
  | { type: "recipe"; recipeId: string }
  | { type: "ingredientDelta"; ingredientDeltaId: string }
  | { type: "instructionDelta"; instructionDeltaId: string };

export function BakeListAll() {
  return <BakeList filter={{ type: "all" }} listTitle={"All Bakes"} />;
}

export function BakeListForRecipe({ recipeId } : { recipeId: string }) {
  return <BakeList filter={{ type: "recipe", recipeId: recipeId }} listTitle={"Recipe Bakes"} />;
}

export function BakeListForIngredientDelta({ ingredientDeltaId } : { ingredientDeltaId: string }) {
  return <BakeList filter={{ type: "ingredientDelta", ingredientDeltaId: ingredientDeltaId! }} listTitle={null} />;
}

export function BakeListForInstructionDelta({ instructionDeltaId } : { instructionDeltaId: string }) {
  return <BakeList filter={{ type: "instructionDelta", instructionDeltaId: instructionDeltaId! }} listTitle={null}/>;
}

function BakeList({ filter, listTitle }: { filter: BakesFilter, listTitle: string | null }) {
  function useBakesQuery(filter: BakesFilter) {
    return useQuery({
      queryKey: ["bakes", filter],
      queryFn: async () => {
        switch (filter.type) {
          case "all":
            return bakeService.listBakes();
          case "recipe":
            return bakeService.listBakesForRecipe(filter.recipeId);
          case "ingredientDelta":
            return deltaService.getBakesByIngredientDeltaId(filter.ingredientDeltaId);
          case "instructionDelta":
            return deltaService.getBakesByInstructionDeltaId(filter.instructionDeltaId);
        }
      },
    });
  }

  const { data, isLoading, error } = useBakesQuery(filter);

  return (
    <div>
      { listTitle && <H3 className="mb-4">{listTitle}</H3> }
      {isLoading && <ListLoadingSkeleton />}
      {error !== null ? (
        <ListErrorView />
      ) : (
        data?.map((bake: BakeDetail) => <BakeListItem key={bake.id} bake={bake} />)
      )}
      {!isLoading && !error && data?.length === 0 && <EmptyView />}
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
