import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ChefHat, BookOpen, Link as LinkIcon, Images as InstagramIcon, PenLine } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { recipeService } from "../../services/RecipeService";
import { useMutation } from "@tanstack/react-query";
import type { CreateRecipePayload } from "../../types/Types";
import { Spinner } from "#components/ui/spinner";
import { useToast } from "../../contexts/ToastContext";

interface Ingredient {
  id: string;
  amount: string | null;
  name: string | null;
}

interface InstructionStep {
  id: string;
  text: string | null;
}

let idCounter = 0;
const nextId = () => `id-${idCounter++}`;

export function RecipeForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sourceType, setSourceType] = useState<"cookbook" | "url"| "instagram" | "other">("cookbook");
  const [source, setSource] = useState<string>("");

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: nextId(), amount: null, name: null },
  ]);

  const [instructions, setInstructions] = useState<InstructionStep[]>([
    { id: nextId(), text: null },
  ]);

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { id: nextId(), amount: null, name: null }]);
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) =>
      prev.length > 1 ? prev.filter((i) => i.id !== id) : prev
    );
  };

  const updateIngredient = (
    id: string,
    field: "amount" | "name",
    value: string
  ) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, [field]: value === "" ? null : value } : i
      )
    );
  };

  const addInstruction = () => {
    setInstructions((prev) => [...prev, { id: nextId(), text: null }]);
  };

  const removeInstruction = (id: string) => {
    setInstructions((prev) =>
      prev.length > 1 ? prev.filter((s) => s.id !== id) : prev
    );
  };

  const updateInstruction = (id: string, value: string) => {
    setInstructions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, text: value === "" ? null : value } : s
      )
    );
  };

  const hasIncompleteIngredient = ingredients.some(
    (i) => i.amount === null || i.name === null
  );
  const hasIncompleteInstruction = instructions.some((s) => s.text === null);
  const disableCreateButton =
    name === "" || hasIncompleteIngredient || hasIncompleteInstruction;

  const { mutate: createRecipe, isPending: isCreating } = useMutation({
    mutationFn: (newRecipe: CreateRecipePayload) =>
      recipeService.createRecipe(newRecipe),
    onSuccess: (data) => {
      addToast('Saved successfully!', { type: 'default' });
      navigate(`/view/${data.id}`)
    },
    onError: (error) => {
      addToast('Failed to save.', { type: 'destructive', duration: 6000 });
    },
  });

  const handleCreate = () => {
    const payload: CreateRecipePayload = {
      name,
      description: description === "" ? null : description,
      recipeSource: source === "" ? null : source,
      tags: [],
      tools: [],
      // Safe to assume non-null here: the create button is disabled
      // whenever any ingredient/instruction field is still null.
      ingredients: ingredients.map(({ amount, name }) => ({
        amount: amount ?? "",
        name: name ?? "",
      })),
      instructions: instructions.map((s) => s.text ?? ""),
    };
    createRecipe(payload);
  };

  
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-2xl">New Recipe</CardTitle>
          </div>
          <CardDescription>
            Fill in the details below to add a recipe to your collection.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Basic info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-name">
                Recipe name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="recipe-name"
                required={true}
                className={name === "" ? "border-destructive/40" : ""}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipe-description">Description</Label>
              <Textarea
                id="recipe-description"
                placeholder="A short description of the dish..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipe-source">Source</Label>
              <div className="flex gap-2">
                <Select
                  value={sourceType}
                  onValueChange={(value: "cookbook" | "url" | "instagram" | "other" | null) => {
                    if (value !== null) {
                      setSourceType(value);
                    } else {
                      setSourceType("other");
                    }
                  }}
                >
                  <SelectTrigger className="w-[140px] shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cookbook">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Cookbook
                      </span>
                    </SelectItem>
                    <SelectItem value="url">
                      <span className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        URL
                      </span>
                    </SelectItem>
                    <SelectItem value="instagram">
                      <span className="flex items-center gap-2">
                        <InstagramIcon className="h-4 w-4" />
                        Instagram
                      </span>
                    </SelectItem>
                    <SelectItem value="other">
                      <span className="flex items-center gap-2">
                        <PenLine className="h-4 w-4" />
                        Add your own
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="recipe-source"
                  placeholder={
                    sourceType === "cookbook"
                      ? "e.g. Salt, Fat, Acid, Heat, p. 214"
                      : sourceType === "other"
                      ? "e.g. Grandma's recipe box"
                      : "https://example.com/recipe"
                  }
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">
                Ingredients <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add ingredient
              </Button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <Input
                    className={`w-28 shrink-0 ${
                      ingredient.amount === null ? "border-destructive/40" : ""
                    }`}
                    placeholder="Amount"
                    value={ingredient.amount ?? ""}
                    onChange={(e) =>
                      updateIngredient(ingredient.id, "amount", e.target.value)
                    }
                  />
                  <Input
                    className={`flex-1 ${
                      ingredient.name === null ? "border-destructive/40" : ""
                    }`}
                    placeholder="Ingredient"
                    value={ingredient.name ?? ""}
                    onChange={(e) =>
                      updateIngredient(ingredient.id, "name", e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeIngredient(ingredient.id)}
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">
                Instructions <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInstruction}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add step
              </Button>
            </div>

            <div className="space-y-2">
              {instructions.map((step, index) => (
                <div key={step.id} className="flex items-start gap-2">
                  <span className="mt-2 w-5 shrink-0 text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <Input
                    className={`flex-1 ${
                      step.text === null ? "border-destructive/40" : ""
                    }`}
                    placeholder={`Step ${index + 1}`}
                    value={step.text ?? ""}
                    onChange={(e) =>
                      updateInstruction(step.id, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeInstruction(step.id)}
                    disabled={instructions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex gap-x-4 justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate("/")} size="lg">
              Cancel
            </Button>
            <Button style={{ width: '150px'}}type="button" onClick={handleCreate} size="lg" disabled={disableCreateButton}>
              { isCreating ? <Spinner /> : "Create recipe" }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}