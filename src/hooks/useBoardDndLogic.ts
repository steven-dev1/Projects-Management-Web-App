import { BoardList } from "@/store/features/boards/BoardsTypes";

export function calculateCardMove(
  lists: BoardList[],
  activeId: string,
  overId: string,
) {
  const fromList = lists.find((l) => l.cards.some((c) => c.id === activeId));
  const toList = lists.find(
    (l) => l.id === overId || l.cards.some((c) => c.id === overId)
  );

  if (!fromList || !toList) return null;

  if (fromList.id === toList.id) {
    const activeIndex = fromList.cards.findIndex((c) => c.id === activeId);
    const overIndex = toList.cards.findIndex((c) => c.id === overId);
    if (activeIndex === overIndex || overIndex === -1) return null;
    const rpcIndex = activeIndex < overIndex ? overIndex - 1 : overIndex;
    return { fromListId: fromList.id, toListId: toList.id, newIndex: overIndex, rpcIndex };
  }

  const overCardIndex = toList.cards.findIndex((c) => c.id === overId);
  const newIndex = overCardIndex === -1 ? toList.cards.length - 1 : overCardIndex;
  return { fromListId: fromList.id, toListId: toList.id, newIndex: Math.max(0, newIndex), rpcIndex: Math.max(0, newIndex) };
}

export function calculateListMove(lists: BoardList[], activeId: string, overId: string) {
  const oldIndex = lists.findIndex((l) => l.id === activeId);
  const newIndex = lists.findIndex((l) => l.id === overId);
  if (oldIndex === -1 || newIndex === -1) return null;
  return { oldIndex, newIndex };
}