import { useEffect, useState } from "react";

type Recipe = {
  id: string;
  name: string;
  description: string;
  createdAt: string | null;
};

export function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function loadRecipes() {
      const response = await fetch(
        "http://localhost:8080/api/recipes"
      );

      const data = await response.json();

      console.log("Fetched data:", data);

      setRecipes(data);
    }

    loadRecipes();
  }, []);

  return (
    <div>
        <h2>Recipes</h2>
            {recipes.map((recipe) => (
                <div key={recipe.id}>
                <h2>{recipe.name}</h2>
                <p>{recipe.description}</p>
                </div>
            ))}
    </div>
  );
}