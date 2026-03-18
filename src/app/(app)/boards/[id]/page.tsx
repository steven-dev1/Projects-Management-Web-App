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
  // DragMoveEvent,
  CollisionDetection,
  pointerWithin,
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useRef, useState } from "react";

export default function BoardPage() {
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);
  const lists = currentBoard?.lists ?? [];
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<BoardList | null>(null);
  const dispatch = useAppDispatch();
  const dragSnapshot = useRef<{ lists: BoardList[] } | null>(null);
  const dragStartY = useRef<number>(0);
  const pointerY = useRef<number>(0);
  const lastOverContainer = useRef<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const isClosed = currentBoard?.status === "archived";

  const horizontalClosestCenter: CollisionDetection = (args) => {
    const { droppableRects, droppableContainers, pointerCoordinates } = args;

    if (!pointerCoordinates) return closestCenter(args);

    const centerX = pointerCoordinates.x;

    let closest = null;
    let minDistance = Infinity;

    for (const container of droppableContainers) {
      if (container.data?.current?.type !== "column") continue;

      const rect = droppableRects.get(container.id);
      if (!rect) continue;

      const containerCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(centerX - containerCenterX);

      if (distance < minDistance) {
        minDistance = distance;
        closest = container;
      }
    }

    return closest ? [{ id: closest.id }] : closestCenter(args);
  };

  const collisionDetection: CollisionDetection = (args) => {
    const isColumn = args.active?.data?.current?.type === "column";

    if (isColumn) {
      return horizontalClosestCenter(args);
    }

    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    return closestCenter(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activatorEvent = event.activatorEvent as PointerEvent | MouseEvent;
    lastOverContainer.current = null;
    dragStartY.current = activatorEvent.clientY ?? 0;
    pointerY.current = dragStartY.current;

    if (event.active.data.current?.type === "column") {
      const column = lists.find((l) => l.id === event.active.id);
      if (column) setActiveColumn(column);
      return;
    }
    const card = lists.flatMap((l) => l.cards).find((c) => c.id === event.active.id);
    if (card) {
      setActiveCard(card);
      dragSnapshot.current = { lists: JSON.parse(JSON.stringify(lists)) };
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveCard(null);

    const { active, over } = event;
    if (!over || !currentBoard) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const isColumn = active.data.current?.type === "column";

    // ── Mover lista ──────────────────────────────────────────────────
    if (isColumn) {
      const oldIndex = lists.findIndex((l) => l.id === activeId);
      const newIndex = lists.findIndex((l) => l.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(moveList({ oldIndex, newIndex }));
        dispatch(updateListOrderSupabase({ listId: activeId, newIndex, boardId: currentBoard.id }));
      }
      dragSnapshot.current = null;
      return;
    }

    // Usar el snapshot para calcular índices originales para el RPC
    const snapshotLists = dragSnapshot.current?.lists ?? lists;
    const fromList = snapshotLists.find((l) => l.cards.some((c) => c.id === activeId));
    const toList = lists.find((l) => l.id === overId || l.cards.some((c) => c.id === overId));

    if (!fromList || !toList) {
      dragSnapshot.current = null;
      return;
    }

    // ── Misma lista ──────────────────────────────────────────────────
    if (fromList.id === toList.id) {
      const activeIndexInSource = fromList.cards.findIndex((c) => c.id === activeId);
      const overIndexInDest = toList.cards.findIndex((c) => c.id === overId);

      if (activeIndexInSource === overIndexInDest || overIndexInDest === -1) {
        dragSnapshot.current = null;
        return;
      }

      const rpcIndex = activeIndexInSource < overIndexInDest ? overIndexInDest - 1 : overIndexInDest;

      dispatch(moveCard({ cardId: activeId, fromListId: fromList.id, toListId: toList.id, newIndex: overIndexInDest }));
      dispatch(updateCardOrder({ cardId: activeId, newListId: toList.id, newIndex: rpcIndex, oldListId: fromList.id }));
      dragSnapshot.current = null;
      return;
    }

    // ── Entre listas distintas ────────────────────────────────────────
    // handleDragOver ya movió en Redux, solo calculamos índice para RPC
    // usando el estado ACTUAL (ya movido) para saber dónde quedó
    const currentToList = lists.find((l) => l.id === toList.id);
    if (!currentToList) {
      dragSnapshot.current = null;
      return;
    }

    const overCardIndex = currentToList.cards.findIndex((c) => c.id === overId);
    const newIndex = overCardIndex === -1 ? currentToList.cards.length - 1 : overCardIndex;

    dispatch(
      moveCard({
        cardId: activeId,
        fromListId: toList.id, // ya está en toList gracias al dragOver
        toListId: toList.id,
        newIndex,
      }),
    );

    dispatch(
      updateCardOrder({
        cardId: activeId,
        newListId: toList.id,
        newIndex: Math.max(0, newIndex),
        oldListId: fromList.id,
      }),
    );

    dragSnapshot.current = null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (active.data.current?.type === "column") return;

    const activeContainer = lists.find((l) => l.cards.some((c) => c.id === activeId));
    const overContainer = lists.find((l) => l.id === overId || l.cards.some((c) => c.id === overId));

    if (!activeContainer || !overContainer || activeContainer.id === overContainer.id) return;

    // 👇 si ya la movimos a esta lista antes, no volver a mover
    if (lastOverContainer.current === overContainer.id) return;
    lastOverContainer.current = overContainer.id;

    const overListElement = document.querySelector(`[data-list-id="${overContainer.id}"]`);
    if (!overListElement) return;

    const cardElements = Array.from(overListElement.querySelectorAll('[data-type="card"]'));
    const activatorEvent = event.activatorEvent as PointerEvent;
    const currentY = activatorEvent.clientY + event.delta.y;

    let destinationIndex = overContainer.cards.length;

    for (let i = 0; i < cardElements.length; i++) {
      const cardRect = cardElements[i].getBoundingClientRect();
      const cardMiddleY = cardRect.top + cardRect.height / 2;
      if (currentY < cardMiddleY) {
        destinationIndex = i;
        break;
      }
    }

    dispatch(
      moveCard({
        cardId: activeId,
        fromListId: activeContainer.id,
        toListId: overContainer.id,
        newIndex: destinationIndex,
      }),
    );
  };

  if (!currentBoard) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      // onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex gap-4 p-8 items-start overflow-x-auto overflow-y-hidden transition-all duration-300 ease-in-out">
        <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
          {lists?.map((list) => (
            <List list={list} key={list.id} isClosed={isClosed}>
              {list.cards.map((card, index) => (
                <CardItem key={card.id} card={card} index={index} isClosed={isClosed} />
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
                <CardView isClosed={isClosed} key={card.id} card={card} isOverlay />
              ))}
            </div>
          </div>
        ) : activeCard ? (
          <CardView isClosed={isClosed} card={activeCard} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
