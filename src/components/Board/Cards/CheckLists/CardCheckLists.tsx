"use client";
import { useState } from "react";
import { Button, Input, Divider } from "@heroui/react";
import { CheckSquare, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Card } from "@/store/features/boards/BoardsTypes";
import { createChecklist } from "@/store/features/boards/ChecklistThunks";
import { CardChecklist } from "./CardCheckList";

export const CardChecklists = ({ card }: { card: Card }) => {
  const dispatch = useAppDispatch();
  const isBoardClosed = useAppSelector((state) => state.boards.currentBoard?.status === "archived");
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("Checklist");

  const handleCreate = async () => {
    if (!title.trim()) return;
    await dispatch(createChecklist({ card_id: card.id!, title: title.trim() }));
    setTitle("Checklist");
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col gap-1 mt-4">
      {card.checklists && card.checklists.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <CheckSquare size={15} className="text-zinc-500 dark:text-zinc-300" />
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-300 uppercase tracking-wide">Checklists</p>
          </div>
          <div className="overflow-y-auto max-h-72 custom-scrollbar flex flex-col gap-2">
            {card.checklists.map((checklist) => (
              <div key={checklist.id} className="flex flex-col gap-2">
                <CardChecklist checklist={checklist} cardId={card.id!} />
                {!isBoardClosed && <Divider />}
              </div>
            ))}
          </div>
        </>
      )}

      {!isBoardClosed &&
        (isCreating ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Nueva checklist</p>
            <Input
              size="sm"
              autoFocus
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setIsCreating(false);
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="flat" color="primary" onPress={handleCreate}>
                Crear
              </Button>
              <Button size="sm" variant="light" isIconOnly onPress={() => setIsCreating(false)}>
                <X size={14} />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="flat"
            startContent={<Plus size={14} />}
            onPress={() => setIsCreating(true)}
            className="w-fit"
          >
            Agregar checklist
          </Button>
        ))}
    </div>
  );
};
