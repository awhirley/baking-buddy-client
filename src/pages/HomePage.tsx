import { BakingBuddyPage } from "#components/SharedComponents/Header";
import { RecipeList } from "#components/RecipeList/RecipeList";
import { BakeList } from "#components/Bakes/BakeList";

export function HomePage() {
  return (
    <BakingBuddyPage>
      <div className="w-full">
        <RecipeList />
        <BakeList />
      </div>
    </BakingBuddyPage>
  );
}