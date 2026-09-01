import { useParams } from "react-router-dom";
import { AlertCircle, Info } from "lucide-react";
import { skipToken, useQuery } from "@tanstack/react-query";

import { Alert, AlertDescription, AlertTitle } from "#components/SharedComponents/ui/alert";
import { bakeService } from "../../services/BakeService";
import { BakeSkeleton } from "./BakeSkeleton";
import { BakeDetailsCard } from "./BakeDetailsCard";
import { BakeIngredientsSection } from "./BakeIngredientsSection";
import { BakeInstructionsSection } from "./BakeInstructionsSection";

export function BakeView() {
  const { bakeId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bake", "new", bakeId],
    queryFn: bakeId
      ? async () => {
          const response = await bakeService.getBake(bakeId!);
          return response;
        }
      : skipToken,
  });

  return (
    <div className="w-full max-w-3xl">
      {isLoading && <BakeSkeleton />}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Couldn't start this bake</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Something went wrong. Try refreshing the page."}
          </AlertDescription>
        </Alert>
      )}

      {data && (
        <div className="flex flex-col gap-6">
          { !data.details.endDatetime && <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>You're in an active bake session</AlertTitle>
            <AlertDescription>
              This is a working copy of the recipe for this bake. Edits you make to ingredients or
              instructions here only apply to this session — the original recipe stays unchanged.
            </AlertDescription>
          </Alert>}

          <BakeDetailsCard {...data.details} />

          <BakeIngredientsSection ingredients={data.ingredientVersions} />

          <BakeInstructionsSection instructions={data.instructionVersions} />
        </div>
      )}
    </div>
  );
}