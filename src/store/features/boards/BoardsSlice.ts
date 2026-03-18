import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardsState } from "./BoardsTypes";
import { arrayMove } from "@dnd-kit/sortable";
import { BoardReducers } from "./reducers/boardReducers";
import { CardReducers } from "./reducers/cardReducers";
import { ListReducers } from "./reducers/listReducers";
import { LabelsReducers } from "./reducers/labelsReducers";
import { ChecklistsReducers } from "./reducers/checklistsReducers";
import { MembersReducers } from "./reducers/membersReducers";

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  status: "idle",
  error: null,
  searchQuery: "",
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    clearCurrentBoard: (state) => {
      state.currentBoard = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    moveCard: (state, action) => {
      const { cardId, fromListId, toListId, newIndex } = action.payload;
      const board = state.currentBoard;
      if (!board) return;

      const fromList = board.lists.find((l) => l.id === fromListId);
      const toList = board.lists.find((l) => l.id === toListId);

      if (!fromList || !toList) return;

      const cardIdx = fromList.cards.findIndex((c) => c.id === cardId);
      if (cardIdx === -1) return;

      if (fromListId === toListId) {
        fromList.cards = arrayMove(fromList.cards, cardIdx, newIndex);
      } else {
        const [movedCard] = fromList.cards.splice(cardIdx, 1);
        toList.cards.splice(newIndex, 0, movedCard);
      }

      fromList.cards.forEach((c, i) => {
        c.position = i;
      });
      if (fromListId !== toListId) {
        toList.cards.forEach((c, i) => {
          c.position = i;
        });
      }
    },

    moveList: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      if (state.currentBoard) {
        const reorderedLists = arrayMove(state.currentBoard.lists, action.payload.oldIndex, action.payload.newIndex);
        state.currentBoard.lists = reorderedLists.map((list, index) => ({
          ...list,
          position: index,
        }));
      }
    },
  },
  extraReducers: (builder) => {
    BoardReducers(builder);
    CardReducers(builder);
    ListReducers(builder);
    LabelsReducers(builder);
    ChecklistsReducers(builder);
    MembersReducers(builder);
  },
});

export const { moveCard, moveList, clearCurrentBoard, setSearchQuery } = boardsSlice.actions;
export default boardsSlice.reducer;
