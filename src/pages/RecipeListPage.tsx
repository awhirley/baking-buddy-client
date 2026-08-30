import { BakingBuddyPage } from "#components/SharedComponents/Header";
import { RecipeList } from "#components/RecipeList/RecipeList";

export function RecipeListPage() {
  return (
    <BakingBuddyPage>
      <div className="w-full">
        <RecipeList />
      </div>
    </BakingBuddyPage>
  );
}