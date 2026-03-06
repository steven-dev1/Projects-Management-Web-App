"use client";
import { BoardList } from "@/store/features/boards/BoardsTypes";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function List({ list, children }: { list: BoardList; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
  });

  return (
    <div
      className={`p-3 flex w-72 max-h-full flex-col gap-2 rounded-lg transition-colors duration-200 ${
        isOver ? "bg-zinc-200 dark:bg-zinc-700" : "bg-zinc-100 dark:bg-zinc-800"
      }`}
      // style={{ backgroundColor: list.background_color }}
    >
      <h3 className="font-semibold my-1">{list.title}</h3>
      <div className="flex flex-col w-full min-h-25 gap-2" ref={setNodeRef}>
        <SortableContext items={list.cards.map((c) => c.id as string)} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
        {isOver && list.cards.length === 0 && (
          <div className="h-16 bg-zinc-300/50 rounded " />
        )}
      </div>
    </div>
  );
}
