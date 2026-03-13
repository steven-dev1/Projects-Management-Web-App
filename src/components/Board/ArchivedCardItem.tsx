import { Card } from "@/store/features/boards/BoardsTypes";
import { Tooltip } from "@heroui/react";
import { ArchiveRestore, Trash2 } from "lucide-react";

export const ArchivedCardItem = ({ card, onRestore, onDelete }: {
  card: Card;
  onRestore: () => void;
  onDelete: () => void;
}) => (
  <div className="flex items-start justify-between gap-2 p-3 rounded-lg border border-zinc-200 bg-zinc-50">
    <div className="min-w-0">
      <p className="text-sm font-medium text-zinc-700 truncate">{card.title}</p>
      {card.description && (
        <p className="text-xs text-zinc-400 mt-0.5 truncate" dangerouslySetInnerHTML={{ __html: card.description }} />
      )}
    </div>
    <div className="flex gap-1 shrink-0">
      <Tooltip content="Restaurar" showArrow>
        <button
          type="button"
          onClick={onRestore}
          className="p-1.5 rounded hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <ArchiveRestore size={14} />
        </button>
      </Tooltip>
      <Tooltip content="Eliminar permanentemente" showArrow color="danger">
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded hover:bg-red-100 text-zinc-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </Tooltip>
    </div>
  </div>
);