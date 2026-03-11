import { Card } from "@/store/features/boards/BoardsTypes";
import { OptionsCard } from "./OptionsCard";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { CalendarIcon, GripVertical, TextInitial } from "lucide-react";
import { Checkbox, Tooltip, useDisclosure } from "@heroui/react";
import { useAppDispatch } from "@/store/hooks";
import { toggleCardCompletion } from "@/store/features/boards/CardsThunks";
import { CardDetailModal } from "./CardDetailModal";

interface CardViewProps {
  card: Card;
  isOverlay?: boolean;
  dragListeners?: SyntheticListenerMap;
  dragAttributes?: DraggableAttributes;
}

export default function CardView({ card, isOverlay, dragListeners, dragAttributes }: CardViewProps) {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!card) return null;
  return (
    <>
      <div
        onClick={onOpen}
        className={`
        group relative cursor-pointer flex items-center justify-start w-full rounded-lg p-2 pl-0 select-none
        ${isOverlay ? "border-2 border-purple-400 shadow-2xl rotate-2" : " dark:bg-zinc-900"}
    `}
      >
        {dragListeners && (
          <div
            {...dragAttributes}
            {...dragListeners}
            className="cursor-grab active:cursor-grabbing  hover:text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical size={14} />
          </div>
        )}
        <div className="pl-2 min-w-0 flex gap-2 items-center pr-6">
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
          <div className="w-full">
            <h4
              className={`font-medium text-sm truncate dark:text-zinc-100 transition-all ${card.is_completed ? "line-through text-zinc-500 italic" : "text-zinc-800"}`}
            >
              {card.title}
            </h4>
            <div className="flex items-center gap-2">
              {card.description && (
                <Tooltip
                  classNames={{
                    base: "font-medium",
                  }}
                  size="sm"
                  placement="bottom"
                  content="Esta tarjeta tiene una descripción"
                >
                  <TextInitial size={14} className="text-zinc-500" />
                </Tooltip>
              )}
              {card.due_date && (
                <Tooltip
                  classNames={{
                    base: "font-medium",
                  }}
                  size="sm"
                  placement="bottom"
                  content={`Fecha límite: ${new Date(card.due_date).toLocaleDateString()}`}
                >
                  <CalendarIcon size={14} className="text-zinc-500" />
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        <div
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <OptionsCard cardId={card.id} />
        </div>
      </div>
      {!isOverlay && <CardDetailModal cardId={card.id!} isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
