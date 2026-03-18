"use client";
import { BoardList } from "@/store/features/boards/BoardsTypes";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import CreateCardButton from "../Cards/CreateCardButton";
import { Divider } from "@heroui/react";
import { OptionsList } from "./OptionsList";
import { useTheme } from "next-themes";
import { resolveListColor } from "@/lib/utils";

export default function List({
  list,
  children,
  isClosed,
}: {
  list: BoardList;
  children: React.ReactNode;
  isClosed: boolean;
}) {
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

  const combinedRef = (node: HTMLDivElement | null) => {
    setSortableRef(node);
    setNodeRef(node);
  };

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const bgColor = resolveListColor(list.background_color, isDark);
  const bgColor2 = resolveListColor(list.background_color, isDark, true);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      className="flex relative min-w-72 max-w-78 max-h-full flex-col gap-2 rounded-lg duration-200"
      ref={combinedRef}
      data-type="column"
      style={style}
    >
      {/* Header sin fondo */}
      <div className="font-semibold flex items-center justify-between gap-2 my-1">
        <div className="flex items-center flex-1 min-w-0 gap-2">
          {!isClosed && (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 rounded shrink-0 text-zinc-500 dark:text-zinc-400"
            >
              <GripVertical size={18} color={bgColor2 ? bgColor2 : ""} />
            </div>
          )}
          <h3 className="truncate text-zinc-800 dark:text-zinc-100">{list.title}</h3>
        </div>
        {!isClosed && (
          <div className="shrink-0" onPointerDown={(e) => e.stopPropagation()}>
            <OptionsList listId={list.id} />
          </div>
        )}
      </div>

      {/* Cards */}
      <div
        className="p-1 rounded-lg overflow-y-auto custom-scrollbar"
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        <div data-list-id={list.id} className="flex flex-col w-full min-h-25">
          <SortableContext items={list.cards.map((c) => c.id as string)} strategy={verticalListSortingStrategy}>
            {children}
          </SortableContext>
          {list.cards.length === 0 && (
            <div className="h-24 rounded-lg border-2 border-dashed border-zinc-300/50 dark:border-zinc-600/50" />
          )}
          {isOver && list.cards.length === 0 && <div className="h-24 bg-zinc-300/50 dark:bg-zinc-600/30 rounded" />}
        </div>

        {!isClosed && (
          <>
            <Divider className="my-2" />
            <div className="rounded-xl">
              <CreateCardButton listId={list.id} boardId={list.board_id} lastPosition={list.cards.length} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
