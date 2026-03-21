"use client";
import BoardAccessDenied from "@/components/Board/BoardAccessDenied";
import CardItem from "@/components/Board/Cards/CardItem";
import CardView from "@/components/Board/Cards/CardView";
import CreateListButton from "@/components/Board/Lists/CreateListButton";
import List from "@/components/Board/Lists/List";
import { useBoardDnd } from "@/hooks/useBoardDnd";
import { useAppSelector } from "@/store/hooks";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

export default function BoardPage() {
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);
  const lists = currentBoard?.lists ?? [];
  const status = useAppSelector((state) => state.boards.status);
  const isFailed = status === "failed";
  const isSucceeded = status === "succeeded";

  const isClosed = currentBoard?.status === "archived";

  const { activeCard, activeColumn, sensors, collisionDetection, handleDragStart, handleDragEnd, handleDragOver } =
    useBoardDnd();

  if (isFailed || (!currentBoard && isSucceeded)) {
    return <BoardAccessDenied />;
  }

  if (!currentBoard) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex gap-4 p-8 items-start overflow-x-auto overflow-y-hidden transition-all duration-300 ease-in-out">
        <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
          {lists?.map((list) => (
            <List list={list} key={list.id}>
              {list.cards.map((card, index) => (
                <CardItem key={card.id} card={card} index={index} />
              ))}
            </List>
          ))}
        </SortableContext>
        {!isClosed && <CreateListButton boardId={currentBoard.id} lastPosition={lists.length} />}
      </div>
      <DragOverlay
        dropAnimation={{ duration: 150, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}
        className="absolute top-0 left-0 right-0 bottom-0"
      >
        {activeColumn ? (
          <div className="bg-zinc-100 dark:bg-zinc-950 p-3 rounded-lg shadow-2xl border border-zinc-300 dark:border-zinc-800 w-72 rotate-1 cursor-grabbing opacity-10">
            <h3 className="font-semibold mb-3">{activeColumn.title}</h3>
            <div className="flex flex-col gap-2">
              {activeColumn.cards.map((card) => (
                <CardView key={card.id} card={card} isOverlay />
              ))}
            </div>
          </div>
        ) : activeCard ? (
          <CardView card={activeCard} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
