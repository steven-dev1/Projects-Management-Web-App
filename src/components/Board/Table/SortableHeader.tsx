import { SortDir, SortKey } from "@/types/app";

export const SortableHeader = ({
  label,
  sortKeyValue,
  sortKey,
  sortDir,
  setSortKey,
  setSortDir,
  className,
}: {
  label: string;
  sortKeyValue: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
  setSortKey: (key: SortKey) => void;
  setSortDir: (dir: SortDir) => void;
  className?: string;
}) => {
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  return (
    <th
      className={`text-left px-4 py-3 font-medium cursor-pointer select-none hover:text-zinc-700 dark:hover:text-zinc-400 group ${className}`}
      onClick={() => handleSort(sortKeyValue)}
    >
      <div className="flex items-center gap-1">
        {label}
        <span className="text-zinc-300 group-hover:text-zinc-500">
          {sortKey === sortKeyValue ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </div>
    </th>
  );
};
