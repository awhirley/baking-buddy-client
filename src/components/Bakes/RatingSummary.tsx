import { RatingIcons } from "#components/SharedComponents/RatingIcons";
import type { BakeRating } from "../../types/BakeTypes";
import { RATING_FIELDS } from "../../types/RatingFields";

export function RatingsSummary({ ratings }: { ratings: BakeRating }) {
  const hasAnyRating = RATING_FIELDS.some(({ key }) => ratings?.[key] != null);

  if (!hasAnyRating) {
    return <p className="text-sm text-muted-foreground">No ratings yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 pb-2">
      {RATING_FIELDS.map(({ key, label, iconType }) => {
        const value = ratings?.[key];
        if (value != null) {
          return (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{label}:</span>
              <RatingIcons icon={iconType} max={5} rating={value != null ? value : 0} />
            </div>
            
          );
        }
      })}
    </div>
  );
}