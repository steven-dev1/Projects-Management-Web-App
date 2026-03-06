"use client";

import CardItem from "@/components/Board/Cards/CardItem";
import CardView from "@/components/Board/Cards/CardView";
import List from "@/components/Board/Lists/List";
import { moveCard, moveList } from "@/store/features/boards/BoardsSlice";
import { BoardList, Card } from "@/store/features/boards/BoardsTypes";
import { updateCardOrder } from "@/store/features/boards/CardsThunks";
import { updateListOrderSupabase } from "@/store/features/boards/ListsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closestCenter,
  DragOverlay,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragStartEvent,
  defaultDropAnimationSideEffects,
  DragOverEvent,
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function BoardPage() {
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);
  const lists = currentBoard?.lists ?? [];
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<BoardList | null>(null);
  const dispatch = useAppDispatch();
  const sensors = useSensors(useSensor(PointerSensor));

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

    if (!currentBoard) return console.log("No se puede mover el card, no hay el board actual");

    if (isColumn) {
      if (activeId !== overId && currentBoard.id) {
        const oldIndex = lists.findIndex((l) => l.id === activeId);
        let newIndex = lists.findIndex((l) => l.id === overId);

        if (newIndex === -1) {
          const parentList = lists.find((l) => l.cards.some((c) => c.id === overId));
          if (parentList) {
            newIndex = lists.findIndex((l) => l.id === parentList.id);
          }
        }

        if (oldIndex !== -1 && newIndex !== -1) {
          dispatch(moveList({ oldIndex, newIndex }));
          dispatch(
            updateListOrderSupabase({
              listId: activeId,
              newIndex,
              boardId: currentBoard.id,
            }),
          );
        }
      }
      return;
    }

    const fromList = lists.find((list) => list.cards.some((card) => card.id === activeId));

    const toList = lists.find((list) => list.id === overId || list.cards.some((card) => card.id === overId));

    if (!fromList || !toList) return;

    const isOverACard = toList.cards.some((card) => card.id === overId);
    let newIndex = isOverACard ? toList.cards.findIndex((card) => card.id === overId) : toList.cards.length;
    newIndex = Math.max(0, newIndex)

    dispatch(
      moveCard({
        cardId: activeId,
        fromListId: fromList.id,
        toListId: toList.id,
        newIndex,
      }),
    );

    dispatch(
      updateCardOrder({
        cardId: activeId,
        newListId: toList.id,
        newIndex: newIndex,
        oldListId: fromList.id,
      }),
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Si es columna
    if (active.data.current?.type === "column") {
      const column = lists.find((l) => l.id === active.id);
      if (column) setActiveColumn(column);
      return;
    }
    const card = lists.flatMap((l) => l.cards).find((c) => c.id === active.id);
    if (card) setActiveCard(card);
    // Encontrar listas de origen y destino
    const activeContainer = lists.find((l) => l.cards.some((c) => c.id === activeId));
    const overContainer = lists.find((l) => l.id === overId || l.cards.some((c) => c.id === overId));

    if (!activeContainer || !overContainer || activeContainer.id === overContainer.id) return;

    // Disparamos la misma acción de Redux para mover la tarjeta visualmente
    dispatch(
      moveCard({
        cardId: activeId,
        fromListId: activeContainer.id,
        toListId: overContainer.id,
        newIndex: 0, // O calcula el índice según la posición del 'overId'
      }),
    );
  };

  // const dropAnimation = {
  //   sideEffects: defaultDropAnimationSideEffects({
  //     styles: {
  //       active: { opacity: "0.5" },
  //     },
  //   }),
  // };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-8 items-start overflow-x-auto transition-all duration-300 ease-in-out">
        <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
          {lists?.map((list) => (
            <List list={list} key={list.id}>
              {list.cards.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </List>
          ))}
        </SortableContext>
      </div>

      {createPortal(
        <DragOverlay dropAnimation={{ duration: 350, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
          {activeColumn ? (
            // Representación estática de la columna
            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg shadow-2xl border border-zinc-300 w-72 rotate-2 cursor-grabbing opacity-90">
              <h3 className="font-semibold mb-3">{activeColumn.title}</h3>
              <div className="flex flex-col gap-2">
                {activeColumn.cards.map((card) => (
                  // Usamos un div simple o un componente estático, NO el CardItem que tiene useSortable
                  <CardView key={card.id} card={card} isOverlay />
                ))}
              </div>
            </div>
          ) : activeCard ? (
            // Representación estática de la card
            <div className="bg-white p-3 rounded shadow-2xl border-2 border-purple-500 w-72 rotate-2 cursor-grabbing opacity-95">
              <h4 className="font-medium">{activeCard.title}</h4>
              <p className="text-sm text-zinc-500">{activeCard.description}</p>
            </div>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
