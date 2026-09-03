import { Rating } from "#components/SharedComponents/ui/rating";
import type { BakeRating } from "../../types/BakeTypes";
import { RATING_FIELDS } from "../../types/RatingFields";

export function RatingsSummary({ ratings }: { ratings: BakeRating }) {
  const hasAnyRating = RATING_FIELDS.some(({ key }) => ratings?.[key] != null);

  if (!hasAnyRating) {
    return <p className="text-sm text-muted-foreground">No ratings yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 pb-2">
      {RATING_FIELDS.map(({ key, label, icon }) => {
        const value = ratings?.[key];
        if (value != null) {
          return (
            <div key={key} className="flex flex-col">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-sm font-medium">{value != null ? `${value}/5` : "—"}</span>
              <Rating
                value={value != null ? value : 0}
                max={5}
                disabled
                icon={icon}
              />
            </div>
          );
        }
      })}
    </div>
  );
}