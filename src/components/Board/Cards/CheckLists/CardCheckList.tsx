"use client";
import { useState } from "react";
import { Button, Checkbox, Progress } from "@heroui/react";
import { Trash2, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Checklist } from "@/types";
import {
  addChecklistItem,
  deleteChecklist,
  deleteChecklistItem,
  toggleChecklistItem,
  updateChecklistItem,
} from "@/store/features/boards/ChecklistThunks";
import { ChecklistItemInput } from "./CheckListItemInput";

export const CardChecklist = ({
  checklist,
  cardId,
}: {
  checklist: Checklist;
  cardId: string;
}) => {
  const dispatch = useAppDispatch();
  const [newItemTitle, setNewItemTitle] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const isBoardClosed = useAppSelector((state) => state.boards.currentBoard?.status === "archived");

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
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-400">{checklist.title}</p>
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
          <span className="text-xs dark:text-zinc-400 text-zinc-400 w-8">{progress}%</span>
          <Progress value={progress} size="sm" color={progress === 100 ? "success" : "primary"} className="flex-1" />
        </div>
      )}

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
                className={`text-sm text-zinc-700 dark:text-zinc-400 ${isBoardClosed ? "cursor-default" : "cursor-pointer"}`}
                onClick={() => {
                  if (isBoardClosed) return;
                  setEditingItemId(item.id);
                  setEditingTitle(item.title);
                }}
              >
                {editingItemId === item.id && !isBoardClosed ? (
                  <ChecklistItemInput
                    value={editingTitle}
                    onChange={(val) => setEditingTitle(val)}
                    onConfirm={() => handleUpdateItem(item.id)}
                    onCancel={() => setEditingItemId(null)}
                    confirmLabel="Guardar"
                  />
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
          <ChecklistItemInput
            value={newItemTitle}
            onChange={(val) => setNewItemTitle(val)}
            onConfirm={handleAddItem}
            onCancel={() => setIsAddingItem(false)}
            confirmLabel="Agregar"
          />
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
