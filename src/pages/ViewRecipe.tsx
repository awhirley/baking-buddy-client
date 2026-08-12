import { Header } from "#components/HomePage/Header";
import { Recipe } from "#components/ViewRecipe/Recipe";

export function ViewRecipe() {
  return (
    <div className="px-30 py-20">
      <div className="grid grid-cols-1 gap-6 justify-items-center">
        <Header />
        <Recipe />
      </div>
    </div>
  );
}