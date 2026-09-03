import { Link } from "react-router-dom";
import { SquareArrowOutUpRight } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";

import { CompleteBakeTrigger } from "#components/ActionDialogs/CompleteBakeTrigger";
import { UpdateBakeRatingsTrigger } from "#components/ActionDialogs/UpdateBakeRatingsTrigger";
import { NoteEditor } from "#components/SharedComponents/NoteEditor";
import { formatAddedDate } from "#components/RecipeList/utils";
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "#components/SharedComponents/ui/tooltip";

import { RatingsSummary } from "./RatingSummary";
import { recipeService } from "../../services/RecipeService";
import type { BakeDetail } from "../../types/BakeTypes";
import { Badge } from "#components/SharedComponents/ui/badge";
import { UpdateElevationTrigger } from "../ActionDialogs/UpdateElevationTrigger";
import { H4 } from "#components/SharedComponents/ui/typography";

export function BakeDetailsCard({ bake }: { bake: BakeDetail }) {
  const bakeIsCompleted = !!bake.endDatetime;

  return (
    <div className="space-y-6">
      <HeaderCard bake={bake} />
      { bakeIsCompleted && <ResultsCard bake={bake} /> }
      <DetailsCard bake={bake} />
    </div>
  );
}

function HeaderCard({ bake } : { bake: BakeDetail }) {
  const { data } = useQuery({
    queryKey: ["recipe", bake.recipeId],
    queryFn: async () => {
        const response = await recipeService.getRecipeById(bake.recipeId!);
        return response;
      }
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">{data?.details.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Started {formatAddedDate(bake.startDatetime)}
            {bake.endDatetime && <span>, completed {formatAddedDate(bake.endDatetime)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {bake.endDatetime && <Badge variant="secondary">
            Completed
          </Badge>}
          <Tooltip>
            <TooltipTrigger
              render={
                <Link to={`/recipe/${bake.recipeId}`} target="_blank" rel="noopener noreferrer">
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
          {!bake.endDatetime && <CompleteBakeTrigger bakeId={bake.id} recipeId={bake.recipeId} />}
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
  );
}

function DetailsCard({ bake } : { bake: BakeDetail }) {
  return (
    <Card className="gap-1">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
      <CardTitle className="text-lg">Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <UpdateElevationTrigger
          triggerType = {bake.elevation != null ? "ICON" : "LINK"}
          bakeId={bake.id}
          elevation={bake.elevation}
        />
        <NoteEditor
          existingNote={bake.notes}
          editModeOn
          onSaveNote={() => {}}
          isSaving={false}
          subject="Bake"
          hideSaveNoteButton
        />
      </CardContent>
    </Card>
  )
}


function ResultsCard({ bake } : { bake: BakeDetail }) {
    return (
    <Card className="gap-1">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">Results</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <UpdateBakeRatingsTrigger bakeId={bake.id} elevation={bake.elevation} notes={bake.notes} ratings={bake.ratings} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RatingsSummary ratings={bake.ratings} />
      </CardContent>
    </Card>
  )
}
