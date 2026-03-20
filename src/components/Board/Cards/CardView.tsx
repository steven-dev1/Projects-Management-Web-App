import { Card } from "@/store/features/boards/BoardsTypes";
import { OptionsCard } from "./OptionsCard";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { CalendarIcon, TextInitial } from "lucide-react";
import { Checkbox, Tooltip, useDisclosure } from "@heroui/react";
import { useAppDispatch } from "@/store/hooks";
import { toggleCardCompletion } from "@/store/features/boards/CardsThunks";
import { CardDetailModal } from "./CardDetailModal";
import { getCardDateStatus } from "@/lib/utils";
import { ChecklistSummary } from "./CheckLists/CheckListSummary";
import { formatDueDateShort } from "@/lib/dateUtils";

interface CardViewProps {
  card: Card;
  isOverlay?: boolean;
  dragListeners?: SyntheticListenerMap;
  dragAttributes?: DraggableAttributes;
  isClosed: boolean;
}

export default function CardView({ card, isOverlay, dragListeners, dragAttributes, isClosed }: CardViewProps) {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dateStatus = getCardDateStatus(card.due_date, card.is_completed);
  const isOverdue = dateStatus === "overdue";
  const isDueSoon = dateStatus === "due-soon";

  const dragListenersOn = !isClosed ? dragListeners : undefined;
  const dragAttributesOn = !isClosed ? dragAttributes : undefined;

  if (!card) return null;
  return (
    <>
      <div
        onClick={onOpen}
        {...dragAttributesOn}
        {...dragListenersOn}
        className={`
        group relative cursor-pointer flex items-center dark:hover:border-zinc-800 border border-transparent hover:border-zinc-200 justify-start w-full rounded-lg py-3 px-1 select-none
        ${isOverlay ? "border-2 border-zinc-300 dark:border-zinc-800 shadow-2xl dark:shadow-zinc-950" : " dark:bg-zinc-950"} 
    `}
      >
        <div className="pl-2 min-w-0 flex gap-2 items-center pr-6">
          {!isClosed && (
            <div onPointerDown={(e) => e.stopPropagation()} className="shrink-0">
              <Checkbox
                classNames={{
                  base: "m-0 p-0",
                  wrapper: "m-0",
                }}
                radius="full"
                color="success"
                size="sm"
                isSelected={card.is_completed}
                onValueChange={() => dispatch(toggleCardCompletion(card.id!))}
              />
            </div>
          )}
          <div className={`w-full`}>
            {card.labels && card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {card.labels.slice(0, 3).map((label) => (
                  <Tooltip
                    closeDelay={0}
                    size="sm"
                    key={label.id}
                    content={label.name ?? "Etiqueta sin nombre"}
                    showArrow
                    placement="top"
                  >
                    <div className="h-1.5 w-4 rounded-full" style={{ backgroundColor: label.color }} />
                  </Tooltip>
                ))}
                {card.labels.length > 3 && <span className="text-xs text-zinc-400">+{card.labels.length - 3}</span>}
              </div>
            )}
            <h4
              className={`font-medium my-1 text-sm truncate  ${card.is_completed ? "text-zinc-500 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-100"}`}
            >
              {card.title}
            </h4>
            <div className="flex items-center gap-2">
              {card.description && (
                <Tooltip closeDelay={0} size="sm" placement="bottom" content="Esta tarjeta tiene una descripción">
                  <TextInitial size={14} className="text-zinc-500 dark:text-zinc-300" />
                </Tooltip>
              )}
              {card.due_date && (
                <Tooltip
                  closeDelay={0}
                  size="sm"
                  showArrow
                  placement="bottom"
                  content={
                    isOverdue
                      ? "Tarea vencida"
                      : isDueSoon
                        ? "Vence pronto"
                        : `Fecha límite: ${formatDueDateShort(card.due_date)}`
                  }
                >
                  <div
                    className={`flex items-center gap-1 rounded-full text-xs font-medium ${
                      isOverdue ? "text-red-600" : isDueSoon ? "text-amber-600" : "text-zinc-500 dark:text-zinc-300"
                    }`}
                  >
                    <CalendarIcon size={14} />
                  </div>
                </Tooltip>
              )}
              {card.checklists && card.checklists.length > 0 && <ChecklistSummary checklists={card.checklists} />}
            </div>
          </div>
        </div>

        {!isClosed && (
          <div
            className="absolute top-2 right-2 opacity-0 flex items-center gap-1 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <OptionsCard cardId={card.id} onOpenDetail={onOpen} />
          </div>
        )}
      </div>
      {!isOverlay && <CardDetailModal isBoardClosed={isClosed} cardId={card.id!} isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
