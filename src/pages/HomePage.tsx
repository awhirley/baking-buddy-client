import { BakingBuddyPage } from "#components/SharedComponents/Header";
import { RecipeList } from "#components/RecipeList/RecipeList";
import { HeroSection1 } from "#components/SharedComponents/ui/hero-section-1";
import { BakeList } from "#components/Bakes/BakeList";

export function HomePage() {
  return (
    <BakingBuddyPage>
      <HeroSection1 />
      <div className="w-full">
        <RecipeList />
        <BakeList />
      </div>
    </BakingBuddyPage>
  );
}