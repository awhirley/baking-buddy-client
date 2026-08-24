import { RecipeForm } from "#components/CreateRecipe/CreateRecipeForm";
import { BakingBuddyPage } from "#components/SharedComponents/Header";

export function CreateRecipe() {
  return (
    <BakingBuddyPage>
      <RecipeForm />
    </BakingBuddyPage>
  );
}
