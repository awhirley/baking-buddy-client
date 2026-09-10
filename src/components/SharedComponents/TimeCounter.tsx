import { Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TimeCounterProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label: string;
  step?: number;
}

export function TimeCounter({ value, onChange, label, step = 1 }: TimeCounterProps) {
  const numericValue = value ?? 0;

  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-sm text-muted-foreground">{label}:</span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onChange(numericValue - step)}
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <Input
        type="number"
        className="w-14 shrink-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange(undefined);
            return;
          }
          const parsed = parseInt(raw, 10);
          onChange(Number.isNaN(parsed) ? undefined : parsed);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onChange(numericValue + step)}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function hourValueFromMinutes(timeInMinutes: number | undefined | null) {
  return timeInMinutes ? Math.floor(timeInMinutes / 60) : 0;
}

// eslint-disable-next-line react-refresh/only-export-components
export function minutesValueFromMinutes(timeInMinutes: number | undefined | null) {
  return timeInMinutes ? timeInMinutes % 60 : 0;
}

// eslint-disable-next-line react-refresh/only-export-components
export function clampNonNegative(value: number | undefined) {
  if (value === undefined || value < 0) return 0;
  return value;
};

// eslint-disable-next-line react-refresh/only-export-components
export function clampMinutes(value: number | undefined) {
  if (value === undefined || value < 0) return 0;
  if (value > 59) return 59;
  return value;
}

// eslint-disable-next-line react-refresh/only-export-components
export function timeToTotalMinutes(hours: number | undefined, minutes: number | undefined) {
  const h = hours ?? 0;
  const m = minutes ?? 0;
  return h * 60 + m;
}