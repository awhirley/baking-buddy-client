import { Header } from "../components/HomePage/Header";

export function ViewRecipe() {
  return (
    <div className="px-30 py-20">
      <div className="grid grid-cols-1 gap-4 justify-items-center">
        <Header />
        View Recipe!
      </div>
    </div>
  );
}