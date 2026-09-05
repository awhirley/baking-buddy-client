import { BakingBuddyPage } from "#components/SharedComponents/Header";
import { HeroSection1 } from "#components/SharedComponents/ui/hero-section-1";

export function AboutUsPage() {
  return (
    <BakingBuddyPage>
      <div className="w-full">
        <HeroSection1 />
      </div>
    </BakingBuddyPage>
  );
}