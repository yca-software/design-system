import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  "aria-label"?: string;
}

function Select({
  value,
  onValueChange,
  options,
  placeholder = "",
  disabled = false,
  className,
  triggerClassName,
  "aria-label": ariaLabel,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label ?? placeholder;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn(
            "flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors",
            "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            !value && "text-muted-foreground",
            triggerClassName,
            className
          )}
        >
          <span className="min-w-0 truncate text-left">{displayValue}</span>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={0}
        className={cn(
          "z-[120] min-w-(--radix-dropdown-menu-trigger-width) max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto"
        )}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => {
              onValueChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChevronDownIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export { Select };
