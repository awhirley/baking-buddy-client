import { useParams } from "react-router-dom";
import { AlertCircle, Info, X } from "lucide-react";
import { skipToken, useQuery } from "@tanstack/react-query";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "#components/SharedComponents/ui/alert";
import { bakeService } from "../../services/BakeService";
import { BakeSkeleton } from "./BakeSkeleton";
import { BakeDetailsCard } from "./BakeDetailsCard";
import { BakeIngredientsSection } from "./BakeIngredientsSection";
import { BakeInstructionsSection } from "./BakeInstructionsSection";
import { Button } from "#components/SharedComponents/ui/button";
import { useState } from "react";
import { CompletedBakeIngredientsSection } from "./CompletedBakeIngredientsSection";
import { CompletedBakeInstructionsSection } from "./CompletedBakeInstructionsSection";

export function BakeView() {
  const { bakeId } = useParams();
  const [alertIsOpen, setAlertIsOpen] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryKey: ["bake", bakeId],
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

      {/* Incomplete Bake */}
      {(data && !data.details.endDatetime) && (
        <div className="flex flex-col gap-6">
          { (!data.details.endDatetime && alertIsOpen) && <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>You're in an active bake session</AlertTitle>
            <AlertDescription>
              This is a working copy of the recipe for this bake. Edits you make to ingredients or
              instructions here only apply to this session until you complete the bake — the original recipe stays unchanged.
            </AlertDescription>
            <AlertAction>
              <Button size="icon" variant="ghost" onClick={() => setAlertIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </AlertAction>
          </Alert>}

          <BakeDetailsCard {...data.details} />

          <BakeIngredientsSection bakeId={bakeId!} ingredients={data.ingredientVersions} />

          <BakeInstructionsSection bakeId={bakeId!} instructions={data.instructionVersions} />
        </div>
      )}

      {/* Complete Bake */}
      {(data && data.details.endDatetime) && (
        <div className="flex flex-col gap-6">
          <BakeDetailsCard {...data.details} />

          <CompletedBakeIngredientsSection ingredients={data.ingredientVersions} />

          <CompletedBakeInstructionsSection instructions={data.instructionVersions} />
        </div>
      )}
    </div>
  );
}