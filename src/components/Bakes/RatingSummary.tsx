// overall: star
// taste: utensils
// texture: waves-horizontal
// appearance: eye
// rise & structure: chevrons-up
// difficulty: sword or swords

import { Rating } from "#components/SharedComponents/ui/rating";
import type { BakeRating } from "../../types/BakeTypes";

export const RATING_FIELDS: { key: keyof Omit<BakeRating, "createdAt">; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "taste", label: "Taste" },
  { key: "texture", label: "Texture" },
  { key: "appearance", label: "Appearance" },
  { key: "riseStructure", label: "Rise / Structure" },
  { key: "difficulty", label: "Difficulty" },
];

export function RatingsSummary({ ratings }: { ratings: BakeRating }) {
  const hasAnyRating = RATING_FIELDS.some(({ key }) => ratings?.[key] != null);

  if (!hasAnyRating) {
    return <p className="text-sm text-muted-foreground">No ratings yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
      {RATING_FIELDS.map(({ key, label }) => {
        const value = ratings?.[key];
        return (
          <div key={key} className="flex flex-col">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value != null ? `${value}/5` : "—"}</span>
            <Rating
              value={value != null ? value : 0}
              max={5}
              disabled
            />
          </div>
        );
      })}
    </div>
  );
}