import type { IconType } from "react-icons";
import { LuBuilding2, LuCalendarDays, LuIdCard } from "react-icons/lu";

const ITEMS: { icon: IconType; text: string }[] = [
  { icon: LuIdCard, text: "Your 10-digit health number, typed without spaces" },
  { icon: LuCalendarDays, text: "The date you were hurt" },
  { icon: LuBuilding2, text: "Your employer's name" },
];

// Experiment "test" variant: a short list of what to have ready before step 1.
export function PrepChecklist() {
  return (
    <aside data-testid="prep-checklist" className="rounded-2xl border border-ink bg-lavender p-5">
      <p className="font-semibold">Before you start, have these ready</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {ITEMS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-[15px]">
            <Icon className="size-5 shrink-0" />
            {text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
