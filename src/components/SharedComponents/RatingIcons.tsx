import type { LucideIcon } from "lucide-react";

interface RatingIconsProps {
  icon: LucideIcon;
  rating: number;
  max: number;
}

const ICON_DIMENSION = "0.875rem"; // Tailwind's 3.5 spacing unit (h-3.5/w-3.5)

export function RatingIcons({ icon: Icon, rating, max }: RatingIconsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Icon
          key={i}
          style={{ width: ICON_DIMENSION, height: ICON_DIMENSION }}
          className={
            i < rating
              ? "fill-primary text-primary"
              : "text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}