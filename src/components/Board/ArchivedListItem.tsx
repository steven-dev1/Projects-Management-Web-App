import { BoardList } from "@/store/features/boards/BoardsTypes";
import { Tooltip } from "@heroui/react";
import { ArchiveRestore, Trash2 } from "lucide-react";

export const ArchivedListItem = ({
  list,
  onRestore,
  onDelete,
  isAdmin,
}: {
  list: BoardList;
  onRestore: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}) => (
  <div className="flex items-center justify-between gap-2 p-3 rounded-lg border border-zinc-200 bg-zinc-50">
    <p className="text-sm font-medium text-zinc-700 truncate">{list.title}</p>
    <div>
      <Tooltip delay={0} closeDelay={0} content="Restaurar" showArrow>
        <button
          type="button"
          onClick={onRestore}
          className="p-1.5 cursor-pointer rounded hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700 transition-colors shrink-0"
        >
          <ArchiveRestore size={14} />
        </button>
      </Tooltip>
      {isAdmin && <Tooltip delay={0} closeDelay={0} content="Eliminar" showArrow>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 cursor-pointer rounded hover:bg-red-100 text-zinc-500 hover:text-red-700 transition-colors shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </Tooltip>}
    </div>
  </div>
);
