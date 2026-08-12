import { Button } from "#components/ui/button";
import { H1 } from "#components/ui/typography";

export function Header() {
  return (
    <div className="flex flex-row gap-x-4 pb-10 flex flex-col justify-between w-200 items-center">
      <H1>Baking Buddy</H1>
      <Button>New Recipe</Button>
    </div>
  );
}