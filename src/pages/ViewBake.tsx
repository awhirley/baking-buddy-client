import { BakeView } from "#components/Bakes/BakeView";
import { BakingBuddyPage } from "#components/SharedComponents/Header";

export function ViewBake() {
  return (
    <BakingBuddyPage>
      <BakeView />
    </BakingBuddyPage>
  );
}