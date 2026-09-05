import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { Field, FieldLabel } from "#components/SharedComponents/ui/field";

import { useToast } from "../../contexts/ToastContext";
import { recipeService } from "../../services/RecipeService";
import { Button } from "#components/SharedComponents/ui/button";
import { Input } from "#components/SharedComponents/ui/input";
import { Textarea } from "#components/SharedComponents/ui/textarea";
import { Checkbox } from "#components/SharedComponents/ui/checkbox";
import { Rating } from "#components/SharedComponents/ui/rating";

import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "#components/SharedComponents/ui/dialog";
import type { UpdateRecipePayload } from "../../types/RecipeTypes";
import { CreatableDropdown } from "#components/SharedComponents/CreatableDropdown";
import { TagInput } from "#components/TagInput";

interface UpdateRecipeDetailsTriggerProps {
  id: string;
  name: string;
  description: string;
  recipeSourceType: string | null | undefined;
  recipeSource: string | null | undefined;
  tags: string[];
  tools: string[];
  difficultyRating: number | null | undefined;
  favorite: boolean | undefined;
}

export function UpdateRecipeDetailsTrigger({ recipe }: { recipe: UpdateRecipeDetailsTriggerProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [formState, setFormState] = useState<UpdateRecipeDetailsTriggerProps>(recipe);

  const resetForm = () => {
    setFormState(recipe);
  };

  const { mutate: updateRecipe, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const payload: UpdateRecipePayload = {
        ...formState,
        name: formState.name.trim(),
        description: formState.description?.trim() || null,
        recipeSourceType: formState.recipeSourceType?.trim() || null,
        recipeSource: formState.recipeSource?.trim() || null,
      };

      return recipeService.updateRecipe(recipe.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipe.id] });
      addToast("Recipe updated", null, { type: "default" });
      setIsOpen(false);
    },
    onError: () => {
      addToast("Failed to update recipe", "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsOpen(open);
  };

  const updateField = <K extends keyof UpdateRecipePayload>(key: K, value: UpdateRecipePayload[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const isNameValid = (formState.name?.trim().length ?? 0) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button variant="outline" onClick={() => handleOpenChange(true)}>
        Edit
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit recipe</DialogTitle>
          <DialogDescription>Update the details for this recipe.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <Field>
            <FieldLabel htmlFor="nameInput">Name</FieldLabel>
            <Input
              id="nameInput"
              value={formState.name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={!isNameValid}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="descriptionInput">Description</FieldLabel>
            <Textarea
              id="descriptionInput"
              value={formState.description ?? ""}
              onChange={(e) => updateField("description", e.target.value || undefined)}
              rows={3}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="recipeSourceTypeInput">Source type</FieldLabel>
              <CreatableDropdown
                options={["Cookbook", "Instagram"]}
                value={formState.recipeSourceType ?? null}
                onValueChange={(value) => updateField("recipeSourceType", value)}
                placeholder="Select a source type"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="recipeSourceInput">Source</FieldLabel>
              <Input
                id="recipeSourceInput"
                value={formState.recipeSource ?? undefined}
                onChange={(e) => updateField("recipeSource", e.target.value || undefined)}
                placeholder="e.g. URL or book title"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="tagsInput">Tags</FieldLabel>
            <TagInput value={formState.tags} onValueChange={(value) => updateField("tags", value ?? undefined)} placeholder="Type a tag and press Enter" />
          </Field>

          <Field>
            <FieldLabel htmlFor="toolsInput">Tools</FieldLabel>
            <TagInput  value={formState.tools} onValueChange={(value) => updateField("tools", value ?? undefined)} placeholder="Type a tool and press Enter" />
          </Field>

          <div className="grid grid-cols-2 gap-4 items-end">
            <Field>
              <FieldLabel htmlFor="difficultyRating">Difficulty</FieldLabel>
              <Rating
                id="difficultyRating"
                value={formState.difficultyRating ? Number(formState.difficultyRating) : undefined}
                onValueChange={(value) => updateField("difficultyRating", value)}
              />
            </Field>

            <Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="favoriteInput"
                  checked={formState.favorite ?? false}
                  onCheckedChange={(checked) => updateField("favorite", checked === true)}
                />
                <FieldLabel htmlFor="favoriteInput">Favorite</FieldLabel>
              </div>
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={isSaving} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <LoadingButton isLoading={isSaving} disabled={!isNameValid} onClick={() => updateRecipe()}>
            Save changes
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}