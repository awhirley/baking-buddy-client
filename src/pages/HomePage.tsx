import { BakingBuddyPage } from "#components/SharedComponents/Header";
import { RecipeList } from "#components/RecipeList/RecipeList";
import { HeroSection1 } from "#components/SharedComponents/ui/hero-section-1";

export function HomePage() {
  return (
    <BakingBuddyPage>
      <HeroSection1 />
      <div className="w-300">
        <RecipeList />
      </div>
    </BakingBuddyPage>
  );
}