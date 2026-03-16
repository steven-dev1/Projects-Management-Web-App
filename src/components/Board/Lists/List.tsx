"use client";
import { BoardList } from "@/store/features/boards/BoardsTypes";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import CreateCardButton from "../Cards/CreateCardButton";
import { Divider } from "@heroui/react";
import { OptionsList } from "./OptionsList";

export default function List({ list, children }: { list: BoardList; children: React.ReactNode; }) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id, data: { type: "column" } });

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: { type: "column" },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: list.background_color,
  };


  return (
    <div
      className={`p-3 flex relative min-w-72 max-w-72 max-h-full flex-col gap-2 rounded-lg transition-colors duration-200 ${
        isOver ? "bg-zinc-200 dark:bg-zinc-700" : "bg-zinc-100 dark:bg-zinc-800"
      }`}
      ref={setSortableRef}
      style={style}
      data-type="column"
    >
      <div className="font-semibold flex items-center justify-between gap-2 my-1">
        <div className="flex items-center flex-1 min-w-0 gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-zinc-300/50 rounded shrink-0"
          >
            <GripVertical size={18} />
          </div>
          <h3 className="truncate">{list.title}</h3>
        </div>
        <div className="shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          <OptionsList listId={list.id} />
        </div>
      </div>
      <div data-list-id={list.id} className="flex flex-col w-full min-h-25 gap-2 overflow-y-auto custom-scrollbar" ref={setNodeRef}>
        <SortableContext items={list.cards.map((c) => c.id as string)} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
        {isOver && list.cards.length === 0 && <div className="h-16 bg-zinc-300/50 rounded " />}
      </div>
      <Divider />
      <div className="rounded-xl">
        <CreateCardButton listId={list.id} boardId={list.board_id} lastPosition={list.cards.length} />
      </div>
    </div>
  );
}
