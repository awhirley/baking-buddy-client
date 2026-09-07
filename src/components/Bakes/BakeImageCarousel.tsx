import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "#components/SharedComponents/ui/carousel";
import { Dialog, DialogContent } from "#components/SharedComponents/ui/dialog";
import { BakeStorageService } from "../../services/BakeStorageService";
import type { BakeImage } from "../../types/BakeStorageTypes";
import { cn } from "cn";

interface BakeImageCarouselProps {
  bakeId: string;
}

export function BakeImageCarousel({ bakeId }: BakeImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const {
    data: images,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bakes", bakeId, "images"],
    queryFn: () => BakeStorageService.listBakeImages(bakeId),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading photos...</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">Couldn't load photos.</p>;
  }

  if (!images || images.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos yet.</p>;
  }

  return (
    <>
      <Carousel className="w-full max-w-sm mx-auto">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id} className="basis-1/2">
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="w-full"
              >
                <img
                  src={image.imageUrl}
                  alt={`Bake photo from ${new Date(image.createdAt).toLocaleDateString()}`}
                  className="aspect-square w-full rounded-md object-cover cursor-pointer"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      <BakeImageLightbox
        images={images}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
        onClose={() => setSelectedIndex(null)}
      />
    </>
  );
}

interface BakeImageLightboxProps {
  images: BakeImage[];
  selectedIndex: number | null;
  onSelectIndex: (index: number) => void;
  onClose: () => void;
}

function BakeImageLightbox({
  images,
  selectedIndex,
  onSelectIndex,
  onClose,
}: BakeImageLightboxProps) {
  const open = selectedIndex !== null;
  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-3xl sm:max-w-3xl">
        {selectedImage && (
          <div className="flex flex-col gap-4">
            <img
              src={selectedImage.imageUrl}
              alt={`Bake photo from ${new Date(selectedImage.createdAt).toLocaleDateString()}`}
              className="max-h-[70vh] w-full rounded-md object-contain"
            />

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => onSelectIndex(index)}
                    className={cn(
                      "h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                      index === selectedIndex
                        ? "border-primary"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                  >
                    <img
                      src={image.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}