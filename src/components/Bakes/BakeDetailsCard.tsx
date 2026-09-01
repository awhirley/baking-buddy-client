import { Link } from "react-router-dom";
import { SquareArrowOutUpRight } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";

import { CompleteBakeTrigger } from "#components/ActionDialogs/CompleteBakeTrigger";
import { EditBakeDetailsTrigger } from "#components/ActionDialogs/EditBakeDetailsTrigger";
import { NoteEditor } from "#components/SharedComponents/NoteEditor";
import { formatAddedDate } from "#components/RecipeList/utils";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "#components/SharedComponents/ui/tooltip";

import { RatingsSummary } from "./RatingSummary";
import { recipeService } from "../../services/RecipeService";
import type { BakeDetail } from "../../types/BakeTypes";

export function BakeDetailsCard({ id, recipeId, recipeName, startDatetime, endDatetime, elevation, notes, ratings }: BakeDetail) {
  const { data } = useQuery({
      queryKey: ["recipe", recipeId],
      queryFn: async () => {
          const response = await recipeService.getRecipeById(recipeId!);
          return response;
        }
    });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Bake Session: {recipeName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Started {formatAddedDate(startDatetime)}
              {endDatetime && <span>, completed {formatAddedDate(endDatetime)}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link to={`/view/${recipeId}`} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="icon"
                  >
                    <SquareArrowOutUpRight />
                  </Button>
                </Link>
                }
              />
              <TooltipContent>
                <p>Open recipe page in new tab</p>
              </TooltipContent>
            </Tooltip>
            {!endDatetime && <CompleteBakeTrigger bakeId={id} recipeId={recipeId} />}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data?.details.recipeSourceType || data?.details.recipeSource) && (
              <p className="text-sm">
                Recipe from: {data?.details.recipeSourceType} {data?.details.recipeSource}
              </p>
            )}
          <p className="text-sm">{data?.details.description}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Bake details</CardTitle>
            {/* <p className="text-sm text-muted-foreground mt-1"></p> */}
          </div>
          <div className="flex items-center gap-2">
            <EditBakeDetailsTrigger bakeId={id} elevation={elevation} notes={notes} ratings={ratings} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {elevation != null && `Baked at ${elevation} feet`}
          {!elevation && <p className="text-sm text-muted-foreground">No elevation data available.</p>}
          <RatingsSummary ratings={ratings} />
          <NoteEditor
            existingNote={notes}
            editModeOn
            onSaveNote={() => {}}
            isSaving={false}
            subject="Bake"
          />
        </CardContent>
      </Card>
    </>
  );
}
