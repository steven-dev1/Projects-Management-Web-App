import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  archiveBoard,
  createBoard,
  deleteBoard,
  fetchBoardById,
  fetchBoards,
  restoreBoard,
  updateBoard,
} from "../BoardsThunks";
import { BoardsState } from "../BoardsTypes";

export const BoardReducers = (builder: ActionReducerMapBuilder<BoardsState>) => {
  builder
    .addCase(fetchBoards.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(fetchBoards.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.boards = action.payload;
    })
    .addCase(fetchBoards.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    })
    .addCase(fetchBoardById.pending, (state, action) => {
      state.status = "loading";
      state.currentRequestId = action.meta.requestId;
      state.error = null;
    })
    .addCase(fetchBoardById.fulfilled, (state, action) => {
      if (state.currentRequestId !== action.meta.requestId) return;
      state.status = "succeeded";
      state.currentBoard = action.payload;
      state.currentBoardId = action.meta.arg;
    })
    .addCase(fetchBoardById.rejected, (state, action) => {
      if (state.currentRequestId !== action.meta.requestId) return;
      state.status = "failed";
      state.error = action.payload ?? "Error desconocido";
    })
    .addCase(createBoard.fulfilled, (state, action) => {
      state.boards.unshift(action.payload);
    })
    .addCase(createBoard.rejected, (state, action) => {
      state.error = action.payload as string;
    })
    .addCase(updateBoard.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.boards.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = { ...state.boards[index], ...action.payload };
      }
      if (state.currentBoard?.id === action.payload.id) {
        state.currentBoard = {
          ...state.currentBoard,
          name: action.payload.name,
          description: action.payload.description,
          background_color: action.payload.background_color,
        };
      }
    })
    .addCase(updateBoard.rejected, (state, action) => {
      state.error = action.payload as string;
    })
    .addCase(updateBoard.pending, (state) => {
      state.status = "loading";
    })
    .addCase(archiveBoard.fulfilled, (state, action) => {
      const index = state.boards.findIndex((b) => b.id === action.payload);
      if (index !== -1) state.boards[index].status = "archived";
      if (state.currentBoard?.id === action.payload) {
        state.currentBoard.status = "archived";
      }
    })
    .addCase(restoreBoard.fulfilled, (state, action) => {
      const index = state.boards.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) state.boards[index] = { ...action.payload, status: "active" };
      if (state.currentBoard?.id === action.payload.id) {
        state.currentBoard.status = "active";
      }
    })
    .addCase(deleteBoard.fulfilled, (state, action) => {
      state.boards = state.boards.filter((b) => b.id !== action.payload);
    })
    .addCase(deleteBoard.rejected, (state, action) => {
      state.error = action.payload as string;
    });
};
