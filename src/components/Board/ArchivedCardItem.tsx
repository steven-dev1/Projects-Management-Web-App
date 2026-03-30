import { Card } from "@/store/features/boards/BoardsTypes";
import { Tooltip } from "@heroui/react";
import { ArchiveRestore  } from "lucide-react";
import {TrashBin, FolderArrowLeft} from '@gravity-ui/icons';
import { useConfirmDelete } from "../Providers/ConfirmDeleteContext";

export const ArchivedCardItem = ({
  card,
  onRestore,
  onDelete,
}: {
  card: Card;
  onRestore: () => void;
  onDelete: () => void;
}) => {
  const { confirm } = useConfirmDelete();
  return (
    <div className="flex items-start justify-between gap-2 p-3 rounded-lg border dark:border-zinc-700 border-zinc-200 bg-zinc-50 dark:bg-zinc-800">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">{card.title}</p>
        {card.description && (
          <p className="text-xs text-zinc-400 mt-0.5 truncate" dangerouslySetInnerHTML={{ __html: card.description }} />
        )}
      </div>
      <div className="flex gap-1 shrink-0">
        <Tooltip size="sm" closeDelay={0} content="Restaurar">
          <button
            type="button"
            onClick={onRestore}
            className="p-1.5 rounded cursor-pointer dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            <FolderArrowLeft />
          </button>
        </Tooltip>
        <Tooltip size="sm" closeDelay={0} content="Eliminar esta tarjeta permanentemente" color="danger">
          <button
            type="button"
            onClick={() => confirm("¿Eliminar tarjeta?","Esta acción no se puede deshacer, perderás todo el contenido de la tarjeta.", onDelete)}
            className="p-1.5 cursor-pointer rounded dark:text-zinc-200 hover:bg-red-100  text-zinc-500 hover:text-red-600 transition-colors"
          >
            <TrashBin />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
