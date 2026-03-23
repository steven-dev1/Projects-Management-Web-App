import { BoardList } from "@/store/features/boards/BoardsTypes";
import { Tooltip } from "@heroui/react";
import { ArchiveRestore, Trash2 } from "lucide-react";
import { useConfirmDelete } from "../Providers/ConfirmDeleteContext";

export const ArchivedListItem = ({
  list,
  onRestore,
  isAdmin,
  onDelete,
}: {
  list: BoardList;
  onRestore: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}) => {
  const { confirm } = useConfirmDelete();
  return (
    <div className="flex items-center justify-between gap-2 p-3 rounded-lg border dark:border-zinc-700 dark:bg-zinc-800 border-zinc-200 bg-zinc-50">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">{list.title}</p>
      <div>
        <Tooltip delay={0} closeDelay={0} content="Restaurar" showArrow>
          <button
            type="button"
            onClick={onRestore}
            className="p-1.5 cursor-pointer rounded dark:hover:bg-zinc-700 dark:hover:text-zinc-100 hover:bg-zinc-200 text-zinc-500 dark:text-zinc-200 hover:text-zinc-700 transition-colors shrink-0"
          >
            <ArchiveRestore size={14} />
          </button>
        </Tooltip>
        {isAdmin && (
          <Tooltip delay={0} closeDelay={0} content="Eliminar" showArrow>
            <button
              type="button"
              onClick={() =>
                confirm("¿Eliminar lista?","Todo el contenido de la lista incluyendo las tarjetas serán eliminados y no se podrá recuperar.", onDelete)
              }
              className="p-1.5 cursor-pointer rounded dark:text-zinc-200 hover:bg-red-100 text-zinc-500 hover:text-red-700 transition-colors shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
