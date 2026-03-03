import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, BoardsState } from "./BoardsTypes";
import { createBoard, deleteBoard, fetchBoards, updateBoard } from "./BoradsThunks";

const initialState: BoardsState = {
  boards: [],
  status: 'idle',
  error: null,
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchBoards.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action: PayloadAction<Board[]>) => {
        state.status = 'succeeded';
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createBoard.fulfilled, (state, action: PayloadAction<Board>) => {
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

export default boardsSlice.reducer;
