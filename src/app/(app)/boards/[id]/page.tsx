"use client";

import CardItem from "@/components/Board/Cards/CardItem";
import List from "@/components/Board/Lists/List";
import { moveCard } from "@/store/features/boards/BoardsSlice";
import { Card } from "@/store/features/boards/BoardsTypes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closestCenter, DragOverlay, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent, DragStartEvent, defaultDropAnimationSideEffects, DragOverEvent, } from "@dnd-kit/core";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function BoardPage() {
  const lists = useAppSelector((state) => state.boards.currentBoard?.lists ?? []);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const dispatch = useAppDispatch();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Encontrar la data de la card que estamos moviendo
    const card = lists.flatMap(l => l.cards).find(c => c.id === active.id);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 1. Encontrar la lista de origen
    const fromList = lists.find((list) => list.cards.some((card) => card.id === activeId));

    // 2. Encontrar la lista de destino
    // Puede ser que 'overId' sea el ID de una tarjeta O el ID de una lista (si está vacía)
    const toList = lists.find((list) => list.id === overId || list.cards.some((card) => card.id === overId));

    if (!fromList || !toList) return;

    // 3. Calcular el nuevo índice
    const isOverACard = toList.cards.some((card) => card.id === overId);
    const newIndex = isOverACard ? toList.cards.findIndex((card) => card.id === overId) : toList.cards.length;

    dispatch(
      moveCard({
        cardId: activeId,
        fromListId: fromList.id,
        toListId: toList.id,
        newIndex,
      }),
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
  const { active, over } = event;
  if (!over) return;

  const activeId = active.id as string;
  const overId = over.id as string;

  // Encontrar listas de origen y destino
  const activeContainer = lists.find(l => l.cards.some(c => c.id === activeId));
  const overContainer = lists.find(l => l.id === overId || l.cards.some(c => c.id === overId));

  if (!activeContainer || !overContainer || activeContainer.id === overContainer.id) return;

  // Disparamos la misma acción de Redux para mover la tarjeta visualmente
  dispatch(moveCard({
    cardId: activeId,
    fromListId: activeContainer.id,
    toListId: overContainer.id,
    newIndex: 0 // O calcula el índice según la posición del 'overId'
  }));
};

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: "0.5" },
        
      },
    }),
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-8 w-full min-h-full overflow-hidden ">
        {lists?.map((list) => (
          <List list={list} key={list.id}>
            {list.cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </List>
        ))}
      </div>
      {/* El Overlay: esto hace que la tarjeta se mueva suavemente */}
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeCard ? (
            <div className="bg-white p-3 rounded shadow-2xl shadow-purple-500/70 border border-morado  w-72 rotate-2 cursor-grabbing">
              <h4 className="font-medium">{activeCard.title}</h4>
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
