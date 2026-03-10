import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, BoardResponse, BoardsState } from "./BoardsTypes";
import { createBoard, deleteBoard, fetchBoardById, fetchBoards, updateBoard } from "./BoardsThunks";
import { arrayMove } from "@dnd-kit/sortable";
import { archiveCard, createCard, deleteCard, toggleCardCompletion, updateCard } from "./CardsThunks";
import { createList } from "./ListsThunks";

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  status: "idle",
  error: null,
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
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
    builder

      // FETCH
      .addCase(fetchBoards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action: PayloadAction<Board[]>) => {
        state.status = "succeeded";
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // FETCH BY ID
      .addCase(fetchBoardById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action: PayloadAction<BoardResponse>) => {
        state.status = "succeeded";
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<BoardResponse>) => {
        state.boards.unshift(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateBoard.fulfilled, (state, action: PayloadAction<Board[]>) => {
        if (action.payload?.length) {
          const updatedBoard = action.payload[0];
          const index = state.boards.findIndex((b) => b.id === updatedBoard.id);
          if (index !== -1) {
            state.boards[index] = updatedBoard;
          }
        }
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteBoard.fulfilled, (state, action: PayloadAction<string>) => {
        state.boards = state.boards.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // CREATE CARD
      .addCase(createCard.fulfilled, (state, action) => {
        const newCard = action.payload;
        const board = state.currentBoard;
        if (board) {
          const list = board.lists.find((l) => l.id === newCard.list_id);
          if (list) {
            list.cards.push(newCard);
          }
        }
      })
      // CREATE LIST
      .addCase(createList.fulfilled, (state, action) => {
        if (state.currentBoard && action.payload.data) {
          const newList = {
            ...action.payload.data,
            cards: [],
          };
          state.currentBoard.lists.push(newList);
        }
      })
      // DELETE CARD
      .addCase(deleteCard.fulfilled, (state, action) => {
        if (!state.currentBoard) return;

        for (const list of state.currentBoard.lists) {
          const cardIndex = list.cards.findIndex((c) => c.id === action.payload);
          if (cardIndex !== -1) {
            list.cards.splice(cardIndex, 1);
            list.cards.forEach((c, i) => {
              c.position = i;
            });
            break;
          }
        }
      })

      // ARCHIVE CARD
      .addCase(archiveCard.fulfilled, (state, action) => {
        if (!state.currentBoard) return;

        for (const list of state.currentBoard.lists) {
          const cardIndex = list.cards.findIndex((c) => c.id === action.payload);
          if (cardIndex !== -1) {
            list.cards.splice(cardIndex, 1);
            list.cards.forEach((c, i) => {
              c.position = i;
            });
            break;
          }
        }
      })

      // UPDATE CARD
      .addCase(updateCard.fulfilled, (state, action) => {
        if (!state.currentBoard) return;

        for (const list of state.currentBoard.lists) {
          const cardIndex = list.cards.findIndex((c) => c.id === action.payload.id);
          if (cardIndex !== -1) {
            list.cards[cardIndex] = action.payload;
            break;
          }
        }
      })

      // TOGGLE CARD COMPLETION
      .addCase(toggleCardCompletion.fulfilled, (state, action) => {
        if (!state.currentBoard) return;
        for (const list of state.currentBoard.lists) {
          const cardIndex = list.cards.findIndex((c) => c.id === action.payload.id);
          if (cardIndex !== -1) {
            list.cards[cardIndex] = action.payload;
            break;
          }
        }
      });
  },
});

export const { moveCard, moveList } = boardsSlice.actions;
export default boardsSlice.reducer;
