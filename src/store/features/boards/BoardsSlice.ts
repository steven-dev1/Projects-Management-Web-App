import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, BoardResponse, BoardsState } from "./BoardsTypes";
import { createBoard, deleteBoard, fetchBoardById, fetchBoards, updateBoard } from "./BoardsThunks";

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
    moveCard: (
      state,
      action: PayloadAction<{ cardId: string; fromListId: string; toListId: string; newIndex: number }>,
    ) => {
      const { cardId, fromListId, toListId, newIndex } = action.payload;

      const fromList = state.currentBoard?.lists.find((l) => l.id === fromListId);
      const toList = state.currentBoard?.lists.find((l) => l.id === toListId);

      if (!fromList || !toList) return;

      const cardIndex = fromList.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return;

      // Extraer la card
      const [movedCard] = fromList.cards.splice(cardIndex, 1);

      // Actualizar el list_id de la card
      movedCard.list_id = toListId;

      // Insertar en la nueva posición
      toList.cards.splice(newIndex, 0, movedCard);

      // Opcional: Re-calcular 'position' numérico de todas las cards en la lista destino
      toList.cards.forEach((card, index) => {
        card.position = index;
      });
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
      });
  },
});

export const { moveCard } = boardsSlice.actions;
export default boardsSlice.reducer;
