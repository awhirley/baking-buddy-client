import { useNavigate } from "react-router-dom";

import { type RecipeDetail } from '../../types/Types';
import { Button } from '#components/ui/button';
import { ButtonGroup } from "#components/ui/button-group"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '#components/ui/card';
import { DeleteRecipeTrigger } from "#components/ActionDialogs/DeleteRecipeTrigger";
import { useState } from "react";

export function Recipe({ recipe }: { recipe: RecipeDetail }) {
  return (
    <Card className="mb-4 outline-1">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <CardDescription>{recipe.description}</CardDescription>
         <CardAction className="flex flex-row gap-x-4">
          <ActionMenu recipeId={recipe.id}/>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function ActionMenu({ recipeId }: { recipeId: string }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ButtonGroup>
      <ButtonGroup className="hidden sm:flex">
        <DeleteRecipeTrigger isOpen={isOpen} setIsOpen={setIsOpen} recipeId={recipeId} />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" onClick={() => console.log("New!")}>New Bake</Button>
        <Button variant="outline" onClick={() => navigate(`/view/${recipeId}`)}>View Recipe</Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}