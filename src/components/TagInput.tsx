import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

import { Badge } from "#components/SharedComponents/ui/badge";
import { Input } from "#components/SharedComponents/ui/input";
import { cn } from "#lib/utils";

interface TagInputProps {
  value: string[] | null;
  onValueChange: (value: string[] | null) => void;
  placeholder?: string;
  className?: string;
  variant?: "link" | "default" | "secondary" | "destructive" | "outline" | "ghost" | null | undefined;
}

export function TagInput({ value, onValueChange, placeholder, className, variant }: TagInputProps) {
  const tags = value ?? [];
  const [draftValue, setDraftValue] = useState("");

  const commitDraftValue = () => {
    const trimmed = draftValue.trim();
    if (trimmed.length === 0) return;

    // Avoid duplicate tags (case-insensitive)
    const alreadyExists = tags.some((tag) => tag.toLowerCase() === trimmed.toLowerCase());
    if (!alreadyExists) {
      onValueChange([...tags, trimmed]);
    }
    setDraftValue("");
  };

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove);
    onValueChange(updated.length > 0 ? updated : null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDraftValue();
    } else if (e.key === "Backspace" && draftValue.length === 0 && tags.length > 0) {
      // Backspacing on an empty input removes the last tag, like most tag inputs
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant={variant || "secondary"} className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={draftValue}
        onChange={(e) => setDraftValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraftValue}
        placeholder={placeholder}
      />
    </div>
  );
}