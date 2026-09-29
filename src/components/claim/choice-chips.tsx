"use client";

import type { Option } from "@/lib/claim/options";
import { cn } from "@/lib/utils";

type ChoiceChipsProps = {
  name: string;
  label: string;
  options: Option[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

// Single-select pills. They are buttons, not inputs, so their labels stay
// visible in replays: categories are fine to see, personal details are not.
export function ChoiceChips({ name, label, options, value, error, onChange }: ChoiceChipsProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-[15px] font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={selected}
              data-testid={`chip-${name}-${o.value}`}
              onClick={() => onChange(o.value)}
              className={cn(
                "h-10 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors",
                selected ? "border-ink bg-ink text-cream" : "border-input bg-paper hover:border-ink",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
