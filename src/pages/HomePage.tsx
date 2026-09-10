import { BakingBuddySummary } from "#components/BakingBuddySummary";
import { BakingBuddyPage } from "#components/SharedComponents/Header";

export function HomePage() {
  return (
    <BakingBuddyPage>
      <div className="w-full">
        <BakingBuddySummary />
      </div>
    </BakingBuddyPage>
  );
}