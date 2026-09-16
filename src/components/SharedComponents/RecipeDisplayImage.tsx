import { useState } from "react";

interface RecipeDisplayImageProps {
  imageUrl: string | null;
  recipeName: string;
  maxHeightClassName?: string;
}

export function RecipeDisplayImage({
  imageUrl,
  recipeName,
  maxHeightClassName = "max-h-64",
}: RecipeDisplayImageProps) {
  const [errored, setErrored] = useState(false);

  if (!imageUrl || errored) return null;

  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-xl border bg-muted/30 p-2">
        <img
          src={imageUrl}
          alt={recipeName}
          onError={() => setErrored(true)}
          className={`${maxHeightClassName} w-auto object-contain rounded-lg`}
        />
      </div>
    </div>
  );
}