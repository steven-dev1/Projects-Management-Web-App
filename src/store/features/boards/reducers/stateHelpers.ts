import { BoardsState, Card, BoardList } from "../BoardsTypes";

export function findCardInState(
  state: BoardsState,
  cardId: string,
): { card: Card; list: BoardList; cardIndex: number } | null {
  if (!state.currentBoard) return null;
  for (const list of state.currentBoard.lists) {
    const cardIndex = list.cards.findIndex((c) => c.id === cardId);
    if (cardIndex !== -1) {
      return { card: list.cards[cardIndex], list, cardIndex };
    }
  }
  return null;
}

export function findListInState(
  state: BoardsState,
  listId: string,
): { list: BoardList; listIndex: number } | null {
  if (!state.currentBoard) return null;
  const listIndex = state.currentBoard.lists.findIndex((l) => l.id === listId);
  if (listIndex === -1) return null;
  return { list: state.currentBoard.lists[listIndex], listIndex };
}

export function touchBoardInList(state: BoardsState) {
  if (!state.currentBoard) return;
  const index = state.boards.findIndex((b) => b.id === state.currentBoard!.id);
  if (index === -1) return;
  state.boards[index] = {
    ...state.boards[index],
    lists: state.currentBoard.lists,
    name: state.currentBoard.name,
    description: state.currentBoard.description,
    background_color: state.currentBoard.background_color,
    status: state.currentBoard.status,
    updated_at: new Date().toISOString(),
  };
}