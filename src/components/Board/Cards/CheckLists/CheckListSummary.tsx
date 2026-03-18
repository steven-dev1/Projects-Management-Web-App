import { Checklist } from "@/types";
import { CheckSquare } from "lucide-react";

export const ChecklistSummary = ({ checklists }: { checklists: Checklist[] }) => {
  const total = checklists.reduce((acc, cl) => acc + cl.items.length, 0);
  const completed = checklists.reduce((acc, cl) => acc + cl.items.filter((i) => i.is_completed).length, 0);

  if (total === 0) return null;

  return (
    <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded w-fit ${
      completed === total ? "bg-green-100 font-medium text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
    }`}>
      <CheckSquare size={11} strokeWidth="3"/>
      <span>{completed}/{total}</span>
    </div>
  );
};