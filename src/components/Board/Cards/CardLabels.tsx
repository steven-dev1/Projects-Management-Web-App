import { Card } from "@/store/features/boards/BoardsTypes";
import { addLabelToCard, removeLabelFromCard, updateLabel } from "@/store/features/boards/LabelsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Label } from "@/types";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";

export const CardLabels = ({ card, isBoardClosed }: { card: Card; isBoardClosed: boolean }) => {
  const dispatch = useAppDispatch();
  const boardLabels = useAppSelector((state) => state.boards.currentBoard?.labels ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const cardLabelIds = card.labels?.map((l) => l.id) ?? [];

  const handleToggleLabel = (label: Label) => {
    if (isBoardClosed) return;
    if (cardLabelIds.includes(label.id)) {
      dispatch(removeLabelFromCard({ cardId: card.id!, labelId: label.id }));
    } else {
      dispatch(addLabelToCard({ cardId: card.id!, label }));
    }
  };

  const handleSaveLabel = async (label: Label) => {
    await dispatch(updateLabel({ labelId: label.id, name: editingName })).unwrap();
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-300 uppercase tracking-wide">Etiquetas</p>

      <div className="flex flex-wrap gap-2">
        {boardLabels.map((label) => (
          <div key={label.id} className="relative group/label">
            {editingId === label.id ? (
              <div
                className="w-20 h-7 rounded-md flex items-center justify-center px-1"
                style={{ backgroundColor: label.color }}
              >
                <input
                  autoFocus
                  placeholder="Nombre"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleSaveLabel(label)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveLabel(label);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="w-full bg-transparent text-white text-xs text-center outline-none placeholder:text-white/60"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleToggleLabel(label)}
                className="w-18 cursor-pointer h-7 rounded-md flex items-center justify-center px-2 transition-all hover:opacity-80"
                style={{ backgroundColor: label.color }}
              >
                <span className="text-white text-xs font-medium truncate drop-shadow-sm">{label.name ?? ""}</span>
                {cardLabelIds.includes(label.id) && (
                  <Check size={12} className="text-white shrink-0 ml-auto drop-shadow" />
                )}
              </button>
            )}

            {!isBoardClosed && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(label.id);
                  setEditingName(label.name ?? "");
                }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-zinc-200 rounded-full items-center justify-center hidden group-hover/label:flex shadow-sm z-10"
              >
                <Pencil size={8} className="text-zinc-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
