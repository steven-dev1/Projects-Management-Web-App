import { BoardList } from "@/store/features/boards/BoardsTypes";
import { Tooltip } from "@heroui/react";
import { ArchiveRestore } from "lucide-react";

export const ArchivedListItem = ({ list, onRestore }: {
  list: BoardList;
  onRestore: () => void;
}) => (
  <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-zinc-200 bg-zinc-50">
    <p className="text-sm font-medium text-zinc-700 truncate">{list.title}</p>
    <Tooltip content="Restaurar" showArrow>
      <button
        type="button"
        onClick={onRestore}
        className="p-1.5 rounded hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700 transition-colors shrink-0"
      >
        <ArchiveRestore size={14} />
      </button>
    </Tooltip>
  </div>
);