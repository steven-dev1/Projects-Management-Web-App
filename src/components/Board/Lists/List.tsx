"use client";
import { BoardList } from "@/store/features/boards/BoardsTypes";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical} from "lucide-react";
import CreateCardButton from "../Cards/CreateCardButton";

export default function List({ list, children }: { list: BoardList; children: React.ReactNode }) {
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
  };

  return (
    <div
      className={`p-3 flex min-w-72 max-w-72 max-h-[80vh] flex-col ${list.position} gap-2 rounded-lg transition-colors duration-200 ${
        isOver ? "bg-zinc-200 dark:bg-zinc-700" : "bg-zinc-100 dark:bg-zinc-800"
      }`}
      ref={setSortableRef}
      style={style}
    >
      <h3 className="font-semibold flex items-center gap-2 my-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-zinc-300/50 rounded"
        >
          <GripVertical size={18} />
        </div>
        {list.title}
      </h3>
      <div className="flex flex-col w-full min-h-25 gap-2 overflow-y-auto custom-scrollbar" ref={setNodeRef}>
        <SortableContext items={list.cards.map((c) => c.id as string)} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
        {isOver && list.cards.length === 0 && <div className="h-16 bg-zinc-300/50 rounded " />}
      </div>
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 rounded-b-xl">
        <CreateCardButton listId={list.id} boardId={list.board_id} lastPosition={list.cards.length} />
      </div>
    </div>
  );
}
