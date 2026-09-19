import { useQuery } from "@tanstack/react-query";

import { Badge } from "#components/SharedComponents/ui/badge";
import { BakeStorageService } from "../../services/BakeStorageService";

export function BakeDisplayImages({
  bakeId,
  maxHeightClassName = "max-h-24",
}: {
  bakeId: string;
  maxHeightClassName?: string;
}) {
  const { data: images } = useQuery({
    queryKey: ["bakes", bakeId, "images"],
    queryFn: () => BakeStorageService.listBakeImages(bakeId),
  });

  if (!images || images.length === 0) {
    return null;
  }

  const [hero, ...rest] = images;

  return (
    <div className="relative shrink-0">
      <img
        src={hero.imageUrl}
        alt="Bake photo"
        className={`${maxHeightClassName} w-24 rounded-md object-cover`}
      />
      {rest.length > 0 && (
        <Badge
          variant="secondary"
          className="absolute bottom-1 right-1 px-1.5 py-0 text-[10px] leading-4"
        >
          +{rest.length} more
        </Badge>
      )}
    </div>
  );
}