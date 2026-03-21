// CardDetailDueDate.tsx
"use client";
import { useState } from "react";
import { Button, DatePicker } from "@heroui/react";
import { parseAbsoluteToLocal, now, getLocalTimeZone, type ZonedDateTime } from "@internationalized/date";
import { CalendarIcon, Pencil } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Card } from "@/store/features/boards/BoardsTypes";
import { updateCard } from "@/store/features/boards/CardsThunks";
import { formatDueDateWithTime, getCardDateStatus } from "@/lib/dateUtils";

export const CardDetailDueDate = ({ card }: { card: Card }) => {
  const dispatch = useAppDispatch();
  const isBoardClosed = useAppSelector((state) => state.boards.currentBoard?.status === "archived");
  const [isEditing, setIsEditing] = useState(false);
  const [dueDate, setDueDate] = useState<ZonedDateTime | null>(
    card.due_date ? parseAbsoluteToLocal(card.due_date) : now(getLocalTimeZone())
  );

  const dateStatus = getCardDateStatus(card.due_date, card.is_completed);
  const isOverdue = dateStatus === "overdue";
  const isDueSoon = dateStatus === "due-soon";

  const handleEdit = () => {
    if (isBoardClosed) return;
    setIsEditing(true);
  };

  const handleSave = async () => {
    await dispatch(updateCard({
      cardId: card.id!,
      title: card.title,
      description: card.description,
      due_date: dueDate?.toDate().toISOString() ?? null,
    }));
    setIsEditing(false);
  };

  if (isEditing && !isBoardClosed) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Fecha límite</p>
        <DatePicker hideTimeZone fullWidth={false} isRequired={false} value={dueDate} onChange={setDueDate} granularity="minute" minValue={now(getLocalTimeZone())} />
        <div className="flex gap-2">
          <Button size="sm" variant="flat" color="primary" onPress={handleSave}>Guardar</Button>
          <Button size="sm" variant="flat" onPress={() => setIsEditing(false)}>Cancelar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-300 uppercase tracking-wide">Fecha límite</p>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-2 py-1 px-2 rounded-lg w-fit ${
          isOverdue ? "bg-red-50 dark:bg-red-900/30 text-red-600" : isDueSoon ? "bg-amber-50 dark:bg-amber-900/40 text-amber-600" : "text-zinc-600 dark:text-zinc-200"
        }`}>
          <CalendarIcon size={14} />
          <span className="text-sm">
            {card.due_date
              ? formatDueDateWithTime(card.due_date)
              : "Sin fecha"}
          </span>
          {isOverdue && <span className="text-xs font-bold">• Vencida</span>}
          {isDueSoon && <span className="text-xs font-bold">• Vence pronto</span>}
        </div>
        {!isBoardClosed && (
          <button onClick={() => handleEdit()} className="text-zinc-400 dark:text-zinc-200 dark:hover:text-zinc-400 cursor-pointer hover:text-zinc-600">
            <Pencil size={13} />
          </button>
        )}
      </div>
    </div>
  );
};