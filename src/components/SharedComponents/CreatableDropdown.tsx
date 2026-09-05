import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Pencil } from "lucide-react";

import { Button } from "#components/SharedComponents/ui/button";
import { Input } from "#components/SharedComponents/ui/input";
import { Separator } from "#components/SharedComponents/ui/separator";
import { cn } from "#lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "#components/ui/popover";

interface CreatableDropdownProps {
  options: string[];
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  customOptionLabel?: string;
  className?: string;
}

export function CreatableDropdown({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  customOptionLabel = "Type to create your own...",
  className,
}: CreatableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);

  const resetCreateState = () => {
    setIsCreating(false);
    setCustomValue("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) resetCreateState();
    setIsOpen(open);
  };

  const handleSelectOption = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
  };

  const handleSubmitCustomValue = () => {
    const trimmed = customValue.trim();
    if (trimmed.length === 0) return;
    onValueChange(trimmed);
    setIsOpen(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitCustomValue();
    } else if (e.key === "Escape") {
      e.preventDefault();
      resetCreateState();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button variant="outline" className={cn("w-full justify-between font-normal", className)}>
          {value || placeholder}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1" align="start">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelectOption(option)}
            className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Check className={cn("mr-2 h-4 w-4", value === option ? "opacity-100" : "opacity-0")} />
            {option}
          </button>
        ))}

        <Separator className="my-1" />

        {isCreating ? (
          <Input
            ref={inputRef}
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={handleSubmitCustomValue}
            placeholder="Enter a value..."
            className="h-7 text-sm w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm italic text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Pencil className="mr-2 h-4 w-4 opacity-50" />
            {customOptionLabel}
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}