import { CheckSquare } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Input } from "./input";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectTranslations {
  triggerLabel?: string;
  searchPlaceholder?: string;
  noOptionsText?: string;
}

interface MultiSelectProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  options: MultiSelectOption[];
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  translations?: MultiSelectTranslations;
}

const DEFAULT_TRANSLATIONS: Required<MultiSelectTranslations> = {
  triggerLabel: "Select options",
  searchPlaceholder: "Search...",
  noOptionsText: "No options",
};

function MultiSelect({
  value,
  onValueChange,
  options,
  disabled = false,
  className,
  "aria-label": ariaLabel,
  translations,
}: MultiSelectProps) {
  const t = { ...DEFAULT_TRANSLATIONS, ...translations };
  const [search, setSearch] = React.useState("");
  const selectedSet = React.useMemo(() => new Set(value), [value]);
  const filteredOptions = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, search]);

  const toggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      onValueChange([...value, optionValue]);
      return;
    }
    onValueChange(value.filter((item) => item !== optionValue));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between", className)}
          aria-label={ariaLabel ?? t.triggerLabel}
          disabled={disabled}
        >
          <span className="inline-flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            {t.triggerLabel}
          </span>
          {value.length > 0 && <Badge variant="secondary">{value.length}</Badge>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-120 w-(--radix-dropdown-menu-trigger-width) min-w-[16rem]"
      >
        <div className="px-1 pb-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
          />
        </div>
        <div className="max-h-56 overflow-auto">
          {filteredOptions.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">{t.noOptionsText}</p>
          ) : (
            filteredOptions.map((option) => {
              const checked = selectedSet.has(option.value);
              return (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={(event) => {
                    event.preventDefault();
                    toggle(option.value, !checked);
                  }}
                >
                  <Checkbox checked={checked} />
                  {option.label}
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { MultiSelect };
