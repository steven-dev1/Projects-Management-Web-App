import { useRef, useState } from "react";
import { moveCard, moveList } from "@/store/features/boards/BoardsSlice";
import { updateCardOrder } from "@/store/features/boards/CardsThunks";
import { updateListOrderSupabase } from "@/store/features/boards/ListsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { calculateCardMove, calculateListMove } from "./useBoardDndLogic";
import { BoardList, Card } from "@/store/features/boards/BoardsTypes";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  CollisionDetection,
  closestCenter,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

export function useBoardDnd() {
  const dispatch = useAppDispatch();
  const lists = useAppSelector((s) => s.boards.currentBoard?.lists ?? []);
  const currentBoard = useAppSelector((s) => s.boards.currentBoard);

  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<BoardList | null>(null);
  const dragSnapshot = useRef<{ lists: BoardList[] } | null>(null);
  const lastOverContainer = useRef<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const horizontalClosestCenter: CollisionDetection = (args) => {
    const { droppableRects, droppableContainers, pointerCoordinates } = args;
    if (!pointerCoordinates) return closestCenter(args);

    let closest = null;
    let minDistance = Infinity;

    for (const container of droppableContainers) {
      if (container.data?.current?.type !== "column") continue;
      const rect = droppableRects.get(container.id);
      if (!rect) continue;
      const distance = Math.abs(pointerCoordinates.x - (rect.left + rect.width / 2));
      if (distance < minDistance) {
        minDistance = distance;
        closest = container;
      }
    }
    return closest ? [{ id: closest.id }] : closestCenter(args);
  };

  const collisionDetection: CollisionDetection = (args) => {
    if (args.active?.data?.current?.type === "column") {
      return horizontalClosestCenter(args);
    }
    const pointerCollisions = pointerWithin(args);
    return pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    lastOverContainer.current = null;

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

    if (isColumn) {
      const move = calculateListMove(lists, activeId, overId);
      if (move) {
        dispatch(moveList(move));
        dispatch(updateListOrderSupabase({ listId: activeId, newIndex: move.newIndex, boardId: currentBoard.id }));
      }
      return;
    }

    const snapshotLists = dragSnapshot.current?.lists ?? lists;
    const move = calculateCardMove(snapshotLists, activeId, overId);
    if (move) {
      dispatch(
        moveCard({ cardId: activeId, fromListId: move.fromListId, toListId: move.toListId, newIndex: move.newIndex }),
      );
      dispatch(
        updateCardOrder({
          cardId: activeId,
          newListId: move.toListId,
          newIndex: move.rpcIndex,
          oldListId: move.fromListId,
        }),
      );
    }
    dragSnapshot.current = null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type === "column") return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeContainer = lists.find((l) => l.cards.some((c) => c.id === activeId));
    const overContainer = lists.find((l) => l.id === overId || l.cards.some((c) => c.id === overId));

    if (!activeContainer || !overContainer || activeContainer.id === overContainer.id) return;
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
      if (currentY < cardRect.top + cardRect.height / 2) {
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

  return { activeCard, activeColumn, sensors, collisionDetection, handleDragStart, handleDragEnd, handleDragOver };
}
