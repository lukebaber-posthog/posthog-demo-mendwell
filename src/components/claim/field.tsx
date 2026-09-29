import type { ReactNode } from "react";
import { LuCircleAlert } from "react-icons/lu";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

// Label, optional hint, the control, and an inline error underneath.
export function Field({ id, label, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
      </label>
      {hint && <p className="-mt-1 text-sm text-muted-foreground">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
          <LuCircleAlert className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
