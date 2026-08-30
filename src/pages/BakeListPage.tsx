import { BakingBuddyPage } from "#components/SharedComponents/Header";
import { BakeList } from "#components/Bakes/BakesList";

export function BakeListPage() {
  return (
    <BakingBuddyPage>
      <div className="w-full">
        <BakeList />
      </div>
    </BakingBuddyPage>
  );
}