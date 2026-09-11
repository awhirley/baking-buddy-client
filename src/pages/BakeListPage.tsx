import { BakingBuddyPage } from "#components/SharedComponents/Header";
import { BakeListAll, BakeListForRecipe } from "#components/Bakes/BakeList";
import { useParams } from "react-router-dom";

export function BakeListPage() {
  const { recipeId } = useParams<{ recipeId?: string }>();

  return (
    <BakingBuddyPage>
      <div className="w-full">
        {recipeId ? <BakeListForRecipe recipeId={recipeId} /> : <BakeListAll />}
      </div>
    </BakingBuddyPage>
  );
}