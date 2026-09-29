import type { ReactNode } from "react";

export function StepHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl leading-none tracking-[-0.02em]">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
