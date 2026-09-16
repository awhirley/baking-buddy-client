import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { LoadingButton } from "#components/SharedComponents/LoadingButton";
import { Button } from "#components/SharedComponents/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
} from "#components/SharedComponents/ui/dialog";

import { useToast } from "../../contexts/ToastContext";
import { recipeService } from "../../services/RecipeService";
import { TagInput } from "#components/TagInput";
import type { UpdateRecipePayload } from "../../types/RecipeTypes";

const CHIP_FIELD_CONFIG = {
  tags: {
    dialogTitle: "Edit tags",
    inputPlaceholder: "Type a tag and press Enter",
    ariaLabel: "Add tag",
  },
  tools: {
    dialogTitle: "Edit tools",
    inputPlaceholder: "Type a tool and press Enter",
    ariaLabel: "Add tool",
  },
} as const;

type ChipField = keyof typeof CHIP_FIELD_CONFIG;

function capitalizeFirstLetter(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function normalizeChips(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const rawValue of values) {
    const normalized = capitalizeFirstLetter(rawValue);
    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (seen.has(key)) continue; // dedupe "cake" vs "Cake"

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

export function UpdateChipsTrigger({
  field,
  recipeId,
  values,
}: {
  field: ChipField;
  recipeId: string;
  values: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [chipsInput, setChipsInput] = useState<string[]>(values);
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const config = CHIP_FIELD_CONFIG[field];

  const resetForm = () => {
    setChipsInput(values);
  };

  const { mutate: updateChips, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const payload: UpdateRecipePayload = {
        name: undefined,
        description: undefined,
        recipeSourceType: undefined,
        recipeSource: undefined,
        favorite: undefined,
        difficultyRating: undefined,
        prepTime: undefined,
        bakeTime: undefined,
        tags: field === "tags" ? chipsInput : undefined,
        tools: field === "tools" ? chipsInput : undefined,
      };

      return recipeService.updateRecipe(recipeId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
      addToast(`${field === "tags" ? "Tags" : "Tools"} updated`, null, { type: "default" });
      setIsOpen(false);
    },
    onError: () => {
      addToast(`Failed to update ${field}`, "Please try again.", { type: "destructive", duration: 6000 });
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button
        onClick={() => handleOpenChange(true)}
        variant="outline"
        size="icon"
        aria-label={config.ariaLabel}
        className="h-6 w-6 rounded-full p-0"
      >
        <Plus className="h-3 w-3" />
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.dialogTitle}</DialogTitle>
        </DialogHeader>

        <TagInput
          value={chipsInput}
          onValueChange={(value) => setChipsInput(normalizeChips(value ?? []))}
          placeholder={config.inputPlaceholder}
        />

        <DialogFooter>
          <Button variant="outline" disabled={isSaving} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <LoadingButton isLoading={isSaving} onClick={() => updateChips()}>
            Save changes
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}