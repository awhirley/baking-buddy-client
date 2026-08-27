// components/Bake/BakeDetailsCard.tsx
import { Button } from "#components/SharedComponents/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#components/SharedComponents/ui/card";
import { formatAddedDate } from "#components/RecipeList/utils";
import type { BakeDetail } from "../../types/BakeTypes";

export function BakeDetailsCard({ createdAt, startDatetime, endDatetime, elevation, notes }: BakeDetail) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Bake Session</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Started {formatAddedDate(startDatetime)}
            {endDatetime && <span>, completed {formatAddedDate(endDatetime)}</span>}
            {elevation != null && <span>, {elevation}ft elevation</span>}
          </p>
        </div>
        <Button onClick={() => {}}>Complete Bake</Button>
      </CardHeader>
      {notes && (
        <CardContent>
          <p className="text-sm">{notes}</p>
        </CardContent>
      )}
    </Card>
  );
}