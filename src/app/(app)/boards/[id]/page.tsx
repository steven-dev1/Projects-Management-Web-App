"use client";
import CardItem from "@/components/Board/Cards/CardItem";
import CardView from "@/components/Board/Cards/CardView";
import CreateListButton from "@/components/Board/Lists/CreateListButton";
import List from "@/components/Board/Lists/List";
import { moveCard, moveList } from "@/store/features/boards/BoardsSlice";
import { BoardList, Card } from "@/store/features/boards/BoardsTypes";
import { updateCardOrder } from "@/store/features/boards/CardsThunks";
import { updateListOrderSupabase } from "@/store/features/boards/ListsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  DragOverlay,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  // closestCorners,
  closestCenter,
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";

export default function BoardPage() {
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);
  const lists = currentBoard?.lists ?? [];
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<BoardList | null>(null);
  const dispatch = useAppDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Encontrar la data de la card que estamos moviendo
    const card = lists.flatMap((l) => l.cards).find((c) => c.id === active.id);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const isColumn = active.data.current?.type === "column";

    if (!currentBoard) return;

    if (isColumn) {
      if (activeId !== overId) {
        const oldIndex = lists.findIndex((l) => l.id === activeId);
        let newIndex = lists.findIndex((l) => l.id === overId);

        if (newIndex === -1) {
          const parentList = lists.find((l) => l.cards.some((c) => c.id === overId));
          if (parentList) newIndex = lists.findIndex((l) => l.id === parentList.id);
        }

        if (oldIndex !== -1 && newIndex !== -1 && currentBoard.id) {
          dispatch(moveList({ oldIndex, newIndex }));
          dispatch(updateListOrderSupabase({ listId: activeId, newIndex, boardId: currentBoard.id }));
        }
      }
      return;
    }

    const fromList = lists.find((l) => l.cards.some((c) => c.id === activeId));
    const toList = lists.find((l) => l.id === overId || l.cards.some((c) => c.id === overId));

    if (!fromList || !toList) return;

    // ── Misma lista: reordenar ──────────────────────────────────────────
    if (fromList.id === toList.id) {
      const activeIndexInSource = fromList.cards.findIndex((c) => c.id === activeId);
      const overIndexInDest = toList.cards.findIndex((c) => c.id === overId);

      if (activeIndexInSource === overIndexInDest || overIndexInDest === -1) return;

      // Redux usa el índice real
      // RPC ajusta -1 cuando mueve hacia abajo porque excluye la card del OFFSET
      const rpcIndex = activeIndexInSource < overIndexInDest ? overIndexInDest - 1 : overIndexInDest;

      dispatch(
        moveCard({
          cardId: activeId,
          fromListId: fromList.id,
          toListId: toList.id,
          newIndex: overIndexInDest,
        }),
      );

      dispatch(
        updateCardOrder({
          cardId: activeId,
          newListId: toList.id,
          newIndex: rpcIndex,
          oldListId: fromList.id,
        }),
      );
      return;
    }

    // ── Entre listas distintas ──────────────────────────────────────────
    const isOverAList = lists.some((l) => l.id === overId);
    const destinationIndex = isOverAList ? toList.cards.length : toList.cards.findIndex((c) => c.id === overId);

    const newIndex = Math.max(0, destinationIndex);

    dispatch(moveCard({ cardId: activeId, fromListId: fromList.id, toListId: toList.id, newIndex }));
    dispatch(updateCardOrder({ cardId: activeId, newListId: toList.id, newIndex, oldListId: fromList.id }));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Si es columna
    if (active.data.current?.type === "column") return;

    const card = lists.flatMap((l) => l.cards).find((c) => c.id === active.id);
    if (card) setActiveCard(card);
    // Encontrar listas de origen y destino
    const activeContainer = lists.find((l) => l.cards.some((c) => c.id === activeId));
    const overContainer = lists.find((l) => l.id === overId || l.cards.some((c) => c.id === overId));

    if (!activeContainer || !overContainer || activeContainer.id === overContainer.id) return;
  };

  if (!currentBoard) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex gap-4 p-8 items-start overflow-x-auto overflow-y-hidden transition-all duration-300 ease-in-out">
        <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
          {lists?.map((list) => (
            <List list={list} key={list.id}>
              {list.cards.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </List>
          ))}
        </SortableContext>
        <CreateListButton boardId={currentBoard.id} lastPosition={lists.length} />
      </div>
      <DragOverlay dropAnimation={{ duration: 350, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {activeColumn ? (
          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg shadow-2xl border border-zinc-300 w-72 rotate-2 cursor-grabbing opacity-90">
            <h3 className="font-semibold mb-3">{activeColumn.title}</h3>
            <div className="flex flex-col gap-2">
              {activeColumn.cards.map((card) => (
                <CardView key={card.id} card={card} isOverlay />
              ))}
            </div>
          </div>
        ) : activeCard ? (
          <div className="bg-white p-3 rounded-lg shadow-2xl border-2 border-zinc-300 w-72 rotate-2 cursor-grabbing opacity-95">
            <h4 className="font-medium text-sm">{activeCard.title}</h4>
          </div>
        ) : null}
      </DragOverlay>
      ,
    </DndContext>
  );
}
