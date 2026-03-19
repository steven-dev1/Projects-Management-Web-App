import { Label } from "@/types";

export default function LabelStats({ labelStats }: { labelStats: { label: Label; count: number }[] }) {
  return (
    labelStats.length > 0 && (
      <div className="col-span-1 bg-content1 rounded-2xl p-5 shadow-small flex flex-col gap-3">
        <p className="text-sm font-semibold">Etiquetas</p>
        <div className="flex flex-wrap gap-2">
          {labelStats.map(({ label, count }) => (
            <div
              key={label.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: label.color ?? "#8b5cf6" }}
            >
              {label.name} <span className="bg-white/25 rounded-full px-1">x{count}</span>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
