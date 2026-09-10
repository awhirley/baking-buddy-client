import { useQuery } from "@tanstack/react-query";
import { Input } from "#components/SharedComponents/ui/input";
import { Button } from "#components/SharedComponents/ui/button";
import { Checkbox } from "#components/SharedComponents/ui/checkbox";
import { Label } from "#components/SharedComponents/ui/label";
import { Search } from "lucide-react";
import {
  EMPTY_FILTERS,
  type NumberRange,
  type RecipeFilterBounds,
  type RecipeFilters,
} from "./useRecipeFilters";
import { Slider } from "#components/ui/slider";
import { filterService } from "../../services/FilterService";
import { ScrollArea } from "#components/ui/scroll-area";

interface RecipeFilterSidebarProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  bounds: RecipeFilterBounds;
  activeFilterCount: number;
}

export function RecipeFilterSidebar({
  filters,
  onFiltersChange,
  bounds,
  activeFilterCount,
}: RecipeFilterSidebarProps) {
  const { data: tagOptions } = useQuery({
    queryKey: ["recipeTags"],
    queryFn: () => filterService.listTags(),
  });

  const { data: toolOptions } = useQuery({
    queryKey: ["recipeTools"],
    queryFn: () => filterService.listTools(),
  });

  function toggleValue(list: string[], value: string) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function clearAll() {
    onFiltersChange({ ...EMPTY_FILTERS, search: filters.search });
  }

  return (
    <aside className="w-64 shrink-0 pr-6 border-r">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-medium my-2 bold">Filters</h4>
        {activeFilterCount > 0 && (
          <Button variant="link" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search name or description"
          className="pl-8"
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Checkbox
          id="favorite-filter"
          checked={filters.favorite}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, favorite: checked === true })}
        />
        <Label htmlFor="favorite-filter" className="flex items-center gap-1 text-sm font-normal">
          Favorites only
        </Label>
      </div>

      <div className="flex flex-col gap-6">
        <CheckboxGroup
          label="Tags"
          options={tagOptions ?? []}
          selected={filters.tags}
          onToggle={(value) => onFiltersChange({ ...filters, tags: toggleValue(filters.tags, value) })}
        />

        <CheckboxGroup
          label="Tools"
          options={toolOptions ?? []}
          selected={filters.tools}
          onToggle={(value) => onFiltersChange({ ...filters, tools: toggleValue(filters.tools, value) })}
        />

        <RangeFilter
          label="Difficulty"
          bounds={bounds.difficulty}
          value={filters.difficultyRange}
          onChange={(range) => onFiltersChange({ ...filters, difficultyRange: range })}
        />

        {/* Hidden entirely if no recipe has a prep/bake time set yet */}
        {bounds.prepTime && (
          <RangeFilter
            label="Prep time"
            unitLabel=" min"
            bounds={bounds.prepTime}
            value={filters.prepTimeRange}
            onChange={(range) => onFiltersChange({ ...filters, prepTimeRange: range })}
          />
        )}

        {bounds.bakeTime && (
          <RangeFilter
            label="Bake time"
            unitLabel=" min"
            bounds={bounds.bakeTime}
            value={filters.bakeTimeRange}
            onChange={(range) => onFiltersChange({ ...filters, bakeTimeRange: range })}
          />
        )}
      </div>
    </aside>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <ScrollArea className="mt-2 flex max-h-40 flex-col gap-2 overflow-y-auto">
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <Checkbox
              id={`${label}-${option}`}
              checked={selected.includes(option)}
              onCheckedChange={() => onToggle(option)}
            />
            <Label htmlFor={`${label}-${option}`} className="text-sm font-normal">
              {option}
            </Label>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

function RangeFilter({
  label,
  unitLabel = "",
  bounds,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  unitLabel?: string;
  bounds: NumberRange;
  value: NumberRange | null;
  onChange: (value: NumberRange | null) => void;
  step?: number;
}) {
  const [boundsMin, boundsMax] = bounds;
  const current = value ?? bounds;
  const isActive = value !== null;
  const isDegenerate = boundsMin === boundsMax;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs text-muted-foreground">
          {current[0]}
          {unitLabel} – {current[1]}
          {unitLabel}
        </span>
      </div>
      <Slider
        className="mt-2"
        min={boundsMin}
        max={boundsMax}
        step={step}
        value={current}
        disabled={isDegenerate}
        onValueChange={(next) => onChange(next as NumberRange)}
      />
      {isActive && (
        <button
          type="button"
          className="mt-1 text-xs text-muted-foreground underline underline-offset-2"
          onClick={() => onChange(null)}
        >
          Reset
        </button>
      )}
    </div>
  );
}