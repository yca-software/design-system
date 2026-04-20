import * as React from "react";
import { format, parse, type Locale } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const DISPLAY_FORMAT = "LLL dd, y";
/** Format for typing in the input (e.g. 2026/03/01). Display uses DISPLAY_FORMAT. */
const INPUT_FORMAT = "yyyy/MM/dd";
const INPUT_FORMAT_ALT = "yyyy-MM-dd";

/** Preset id used when using default presets (for translation keys). */
export type DefaultPresetId =
  | "today"
  | "yesterday"
  | "last7"
  | "last14"
  | "last30"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth";

/** Labels for action buttons, form fields, and accessibility. Pass translated strings for i18n. */
export interface DateRangePickerTranslations {
  /** Apply/confirm button (e.g. "Apply"). */
  applyButton?: string;
  /** Cancel button (e.g. "Cancel"). */
  cancelButton?: string;
  /** Start date field label (e.g. "Start"). */
  startLabel?: string;
  /** End date field label (e.g. "End"). */
  endLabel?: string;
  /** Placeholder when no range selected (e.g. "Pick a date range"). Shown in trigger and inline inputs. */
  placeholder?: string;
  /** Accessibility label for the date range trigger input (e.g. "Date range"). */
  ariaLabel?: string;
  /** Labels for default presets when presets prop is not provided. Key is DefaultPresetId. */
  presetLabels?: Partial<Record<DefaultPresetId, string>>;
}

/** A selectable preset range. Use for custom or translated presets. */
export interface DateRangePickerPreset {
  id: string;
  label: string;
  getRange: () => DateRange;
}

export interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  /**
   * Minimum selectable date (inclusive). Dates before this will be disabled.
   */
  minDate?: Date;
  /**
   * Maximum selectable date (inclusive). Dates after this will be disabled.
   */
  maxDate?: Date;
  /**
   * Optional placeholder text when no range is selected.
   */
  placeholder?: string;
  /**
   * Show preset range buttons. When true and presets is not provided, default presets are shown (use translations.presetLabels to translate).
   * When presets is provided, that array is used. Default true.
   */
  showPresets?: boolean;
  /**
   * Optional preset ranges. When provided, these are shown instead of default presets; labels are your translated strings.
   */
  presets?: DateRangePickerPreset[];
  /**
   * Translations for action buttons, labels, and default preset names. Pass translated strings for i18n.
   */
  translations?: DateRangePickerTranslations;
  /**
   * Locale for calendar month names and date formatting (e.g. from date-fns/locale).
   */
  locale?: Locale;
  /**
   * Callback when the user applies the selection (clicks Apply). If not set, selection is applied on every calendar change.
   */
  onApply?: (range: DateRange | undefined) => void;
  /**
   * Optional function to disable specific dates.
   * Returning true will mark the date as disabled (in addition to min/max).
   */
  isDateDisabled?: (date: Date) => boolean;
  className?: string;
}

function normalizeDate(d: Date | undefined | null): Date | undefined {
  if (!d) return undefined;
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

const DEFAULT_PRESET_IDS: { id: DefaultPresetId }[] = [
  { id: "today" },
  { id: "yesterday" },
  { id: "last7" },
  { id: "last14" },
  { id: "last30" },
  { id: "thisWeek" },
  { id: "lastWeek" },
  { id: "thisMonth" },
  { id: "lastMonth" },
];

const DEFAULT_PRESET_LABELS: Record<DefaultPresetId, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 days",
  last14: "Last 14 days",
  last30: "Last 30 days",
  thisWeek: "This week",
  lastWeek: "Last week",
  thisMonth: "This month",
  lastMonth: "Last month",
};

function getPresetRange(presetId: DefaultPresetId): DateRange {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const from = new Date(today);
  from.setHours(0, 0, 0, 0);
  const to = new Date(today);

  switch (presetId) {
    case "today":
      return { from, to };
    case "yesterday":
      from.setDate(from.getDate() - 1);
      to.setDate(to.getDate() - 1);
      return { from, to };
    case "last7":
      from.setDate(from.getDate() - 6);
      return { from, to };
    case "last14":
      from.setDate(from.getDate() - 13);
      return { from, to };
    case "last30":
      from.setDate(from.getDate() - 29);
      return { from, to };
    case "thisWeek": {
      const day = from.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      from.setDate(from.getDate() + mondayOffset);
      return { from, to };
    }
    case "lastWeek": {
      const day = from.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const thisMonday = from.getDate() + mondayOffset;
      from.setDate(thisMonday - 7);
      to.setDate(thisMonday - 1);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    case "thisMonth":
      from.setDate(1);
      return { from, to };
    case "lastMonth":
      from.setMonth(from.getMonth() - 1);
      from.setDate(1);
      to.setDate(0);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    default:
      return { from, to };
  }
}

const DEFAULT_TRANSLATIONS: Required<DateRangePickerTranslations> = {
  applyButton: "Apply",
  cancelButton: "Cancel",
  startLabel: "Start",
  endLabel: "End",
  placeholder: "YYYY/MM/DD",
  ariaLabel: "Date range",
  presetLabels: DEFAULT_PRESET_LABELS,
};

export function DateRangePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder,
  showPresets = true,
  presets: customPresets,
  translations,
  locale,
  onApply,
  isDateDisabled,
  className,
}: DateRangePickerProps) {
  const t = { ...DEFAULT_TRANSLATIONS, ...translations };
  const effectivePlaceholder = placeholder ?? t.placeholder;
  const presetList: { id: string; label: string; getRange: () => DateRange }[] =
    React.useMemo(() => {
      if (customPresets?.length) return customPresets;
      if (!showPresets) return [];
      return DEFAULT_PRESET_IDS.map(({ id }) => ({
        id,
        label: translations?.presetLabels?.[id] ?? DEFAULT_PRESET_LABELS[id],
        getRange: () => getPresetRange(id),
      }));
    }, [customPresets, showPresets, translations?.presetLabels]);
  const normalizedMin = normalizeDate(minDate);
  const normalizedMax = normalizeDate(maxDate);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<DateRange | undefined>(value);
  const [displayedMonth, setDisplayedMonth] = React.useState(() => new Date());
  const appliedRef = React.useRef<DateRange | undefined>(value);
  const useApplyFlow = !!onApply;
  const idScope = React.useId();
  const startInputId = `date-range-start-${idScope}`;
  const endInputId = `date-range-end-${idScope}`;

  React.useEffect(() => {
    if (open) {
      appliedRef.current = value;
      setDraft(value);
      setDisplayedMonth(new Date());
    }
  }, [open, value]);

  const formatOpts = React.useMemo(
    () => (locale ? { locale } : undefined),
    [locale],
  );

  const label = React.useMemo(() => {
    const from = value?.from;
    const to = value?.to;

    if (from && to) {
      return `${format(from, DISPLAY_FORMAT, formatOpts)} \u2013 ${format(to, DISPLAY_FORMAT, formatOpts)}`;
    }

    if (from) {
      return format(from, DISPLAY_FORMAT, formatOpts);
    }

    return effectivePlaceholder;
  }, [effectivePlaceholder, value?.from, value?.to, formatOpts]);

  const [inputText, setInputText] = React.useState(label);
  const inputFocusedRef = React.useRef(false);

  React.useEffect(() => {
    if (!inputFocusedRef.current) setInputText(label);
  }, [label]);

  function parseDate(part: string): Date | null {
    const p = part.trim();
    if (!p) return null;
    const ref = new Date();
    for (const fmt of [INPUT_FORMAT, INPUT_FORMAT_ALT, DISPLAY_FORMAT]) {
      try {
        const d = parse(p, fmt, ref);
        if (!Number.isNaN(d.getTime())) return d;
      } catch {
        // try next format
      }
    }
    return null;
  }

  function parseInputToRange(text: string): DateRange | null {
    const trimmed = text.trim();
    if (!trimmed) return { from: undefined, to: undefined };
    const parts = trimmed.split(/\s*[–-]\s*/).map((p) => p.trim());
    try {
      if (parts.length >= 2) {
        const from = parseDate(parts[0]!);
        const to = parseDate(parts[1]!);
        if (from && to) return { from, to };
        if (from) return { from, to: undefined };
      } else if (parts.length === 1 && parts[0]) {
        const from = parseDate(parts[0]);
        if (from) return { from, to: undefined };
      }
    } catch {
      // ignore
    }
    return null;
  }

  const handleInputBlur = () => {
    inputFocusedRef.current = false;
    const next = parseInputToRange(inputText);
    if (next) {
      if (useApplyFlow) {
        setDraft(next);
        setInputText(
          next.from && next.to
            ? `${format(next.from, DISPLAY_FORMAT, formatOpts)} \u2013 ${format(next.to, DISPLAY_FORMAT, formatOpts)}`
            : next.from
              ? format(next.from, DISPLAY_FORMAT, formatOpts)
              : effectivePlaceholder,
        );
      } else {
        onChange(next);
        setInputText(
          next.from && next.to
            ? `${format(next.from, DISPLAY_FORMAT, formatOpts)} \u2013 ${format(next.to, DISPLAY_FORMAT, formatOpts)}`
            : next.from
              ? format(next.from, DISPLAY_FORMAT, formatOpts)
              : effectivePlaceholder,
        );
      }
    } else {
      setInputText(label);
    }
  };

  const disabledMatchers = React.useMemo(() => {
    const toStartOfDay = (d: Date) => {
      const copy = new Date(d);
      copy.setHours(0, 0, 0, 0);
      return copy.getTime();
    };
    const matchers: Array<unknown> = [];
    if (normalizedMin) {
      matchers.push(
        (date: Date) => toStartOfDay(date) < toStartOfDay(normalizedMin!),
      );
    }
    if (normalizedMax) {
      matchers.push(
        (date: Date) => toStartOfDay(date) > toStartOfDay(normalizedMax!),
      );
    }
    if (isDateDisabled) {
      matchers.push((date: Date) => isDateDisabled(date));
    }
    return matchers as unknown as import("react-day-picker").Matcher[];
  }, [normalizedMin, normalizedMax, isDateDisabled]);

  const isEmpty = !value?.from;

  const handlePreset = (getRange: () => DateRange) => {
    const range = getRange();
    setDraft(range);
    if (!useApplyFlow) {
      onChange(range);
    }
  };

  const handleApply = () => {
    onChange(draft);
    onApply?.(draft);
    setOpen(false);
  };

  const handleCancel = () => {
    setDraft(appliedRef.current);
    setOpen(false);
  };

  const handleSelect = (_next: DateRange | undefined, triggerDate: Date) => {
    const day = normalizeDate(triggerDate);
    if (!day) return;

    setDraft((prev) => {
      // If no start yet, or we already have a complete range, start a new one.
      if (!prev?.from || (prev.from && prev.to)) {
        const nextRange = { from: day, to: undefined };
        if (!useApplyFlow) onChange(nextRange);
        return nextRange;
      }

      // We have a start but no end yet.
      if (day < prev.from) {
        // Second click before start: treat as new start.
        const nextRange = { from: day, to: undefined };
        if (!useApplyFlow) onChange(nextRange);
        return nextRange;
      }

      const nextRange = { from: prev.from, to: day };
      if (!useApplyFlow) onChange(nextRange);
      return nextRange;
    });
  };

  const [startInputText, setStartInputText] = React.useState("");
  const [endInputText, setEndInputText] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setStartInputText(draft?.from ? format(draft.from, INPUT_FORMAT) : "");
      setEndInputText(draft?.to ? format(draft.to, INPUT_FORMAT) : "");
    }
  }, [open, draft?.from, draft?.to]);

  const commitStartInput = () => {
    const d = parseDate(startInputText);
    if (d) {
      setDraft((prev) => ({
        from: d,
        to: prev?.to && prev.to >= d ? prev.to : undefined,
      }));
    } else {
      setStartInputText(draft?.from ? format(draft.from, INPUT_FORMAT) : "");
    }
  };

  const commitEndInput = () => {
    const d = parseDate(endInputText);
    if (d) {
      setDraft((prev) => ({
        from: prev?.from && prev.from <= d ? prev.from : d,
        to: d,
      }));
    } else {
      setEndInputText(draft?.to ? format(draft.to, INPUT_FORMAT) : "");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
          className={cn(
            "flex w-full max-w-[260px] cursor-pointer items-center rounded-md border border-input bg-transparent shadow-xs focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            className,
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-l-md border-r border-input text-muted-foreground">
            <CalendarIcon className="size-4" aria-hidden="true" />
          </span>
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => {
              inputFocusedRef.current = true;
            }}
            onBlur={handleInputBlur}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder={effectivePlaceholder}
            data-empty={isEmpty || undefined}
            className={cn(
              "h-9 min-w-0 flex-1 cursor-pointer rounded-l-none border-0 bg-transparent py-2 pl-3 pr-3 text-base shadow-none focus-visible:ring-0 md:text-sm capitalize",
              isEmpty && "text-muted-foreground",
            )}
            aria-label={t.ariaLabel}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          {presetList.length > 0 && (
            <div className="flex flex-row border-b sm:flex-col sm:border-b-0 sm:border-r p-2">
              {presetList.map((preset) => (
                <Button
                  key={preset.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left font-normal shrink-0 sm:w-full"
                  onClick={() => handlePreset(preset.getRange)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex flex-col items-center p-3">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={startInputId}
                  className="text-xs font-medium text-muted-foreground"
                >
                  {t.startLabel}
                </label>
                <Input
                  id={startInputId}
                  type="text"
                  value={startInputText}
                  onChange={(e) => setStartInputText(e.target.value)}
                  onBlur={commitStartInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitStartInput();
                    }
                  }}
                  placeholder={effectivePlaceholder}
                  className="h-8 text-sm font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={endInputId}
                  className="text-xs font-medium text-muted-foreground"
                >
                  {t.endLabel}
                </label>
                <Input
                  id={endInputId}
                  type="text"
                  value={endInputText}
                  onChange={(e) => setEndInputText(e.target.value)}
                  onBlur={commitEndInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitEndInput();
                    }
                  }}
                  placeholder={effectivePlaceholder}
                  className="h-8 text-sm font-mono"
                />
              </div>
            </div>
            <Calendar
              mode="range"
              numberOfMonths={1}
              month={displayedMonth}
              onMonthChange={setDisplayedMonth}
              selected={draft}
              onSelect={handleSelect}
              disabled={disabledMatchers}
              locale={locale}
            />
            {useApplyFlow && (
              <div className="flex w-full items-center justify-end gap-2 border-t pt-3 mt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  {t.cancelButton}
                </Button>
                <Button type="button" size="sm" onClick={handleApply}>
                  {t.applyButton}
                </Button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
