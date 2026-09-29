export function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-5xl leading-none tracking-[-0.02em]">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
}
