"use client";
import { useState } from "react";
import { Button, Checkbox, Input, Progress } from "@heroui/react";
import { Trash2, Plus, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { Checklist } from "@/types";
import {
  addChecklistItem,
  deleteChecklist,
  deleteChecklistItem,
  toggleChecklistItem,
  updateChecklistItem,
} from "@/store/features/boards/ChecklistThunks";

export const CardChecklist = ({
  checklist,
  cardId,
  isBoardClosed,
}: {
  checklist: Checklist;
  cardId: string;
  isBoardClosed: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const completed = checklist.items.filter((i) => i.is_completed).length;
  const total = checklist.items.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) return;
    await dispatch(
      addChecklistItem({
        checklist_id: checklist.id,
        title: newItemTitle.trim(),
        cardId,
      }),
    );
    setNewItemTitle("");
    setIsAddingItem(false);
  };

  const handleUpdateItem = async (itemId: string) => {
    if (!editingTitle.trim()) return;
    await dispatch(
      updateChecklistItem({
        itemId,
        checklistId: checklist.id,
        cardId,
        title: editingTitle.trim(),
      }),
    );
    setEditingItemId(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-700">{checklist.title}</p>
        {!isBoardClosed && (
          <Button
            size="sm"
            variant="light"
            color="danger"
            isIconOnly
            onPress={() => dispatch(deleteChecklist({ checklistId: checklist.id, cardId }))}
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 w-8">{progress}%</span>
          <Progress value={progress} size="sm" color={progress === 100 ? "success" : "primary"} className="flex-1" />
        </div>
      )}

      {/* Items */}
      {/* Items */}
      <div className="flex flex-col gap-1">
        {checklist.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group py-1">
            <Checkbox
              size="sm"
              isSelected={item.is_completed}
              isDisabled={isBoardClosed}
              onValueChange={(val) =>
                !isBoardClosed &&
                dispatch(
                  toggleChecklistItem({
                    itemId: item.id,
                    checklistId: checklist.id,
                    cardId,
                    is_completed: val,
                  }),
                )
              }
            />
            <div className="flex items-center justify-between flex-1">
              <span
                className={`text-sm ${isBoardClosed ? "cursor-default" : "cursor-pointer"} ${
                  item.is_completed ? "line-through text-zinc-400" : "text-zinc-700"
                }`}
                onClick={() => {
                  if (isBoardClosed) return;
                  setEditingItemId(item.id);
                  setEditingTitle(item.title);
                }}
              >
                {editingItemId === item.id && !isBoardClosed ? (
                  <div className="flex items-center gap-1 flex-1">
                    <Input
                      size="sm"
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateItem(item.id);
                        if (e.key === "Escape") setEditingItemId(null);
                      }}
                    />
                    <Button size="sm" variant="flat" color="primary" onPress={() => handleUpdateItem(item.id)}>
                      Guardar
                    </Button>
                    <Button size="sm" variant="light" isIconOnly onPress={() => setEditingItemId(null)}>
                      <X size={14} />
                    </Button>
                  </div>
                ) : (
                  item.title
                )}
              </span>
              {!isBoardClosed && (
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  className="opacity-0 group-hover:opacity-100"
                  onPress={() =>
                    dispatch(
                      deleteChecklistItem({
                        itemId: item.id,
                        checklistId: checklist.id,
                        cardId,
                      }),
                    )
                  }
                >
                  <X size={12} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Agregar item */}
      {!isBoardClosed &&
        (isAddingItem ? (
          <div className="flex flex-col gap-2">
            <Input
              size="sm"
              autoFocus
              placeholder="Escribe un item..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddItem();
                if (e.key === "Escape") setIsAddingItem(false);
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="flat" color="primary" onPress={handleAddItem}>
                Agregar
              </Button>
              <Button size="sm" variant="light" onPress={() => setIsAddingItem(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="flat"
            startContent={<Plus size={14} />}
            onPress={() => setIsAddingItem(true)}
            className="w-fit"
          >
            Agregar item
          </Button>
        ))}
    </div>
  );
};
