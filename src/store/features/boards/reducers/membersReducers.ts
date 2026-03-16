import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { BoardsState } from "../BoardsTypes";
import { removeMember, updateMemberRole } from "../MembersThunks";

export const MembersReducers = (builder: ActionReducerMapBuilder<BoardsState>) => {
  builder
    .addCase(removeMember.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      state.currentBoard.board_members = state.currentBoard.board_members.filter((m) => m.id !== action.payload);
    })
    .addCase(updateMemberRole.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      const index = state.currentBoard.board_members.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.currentBoard.board_members[index] = action.payload;
      }
    });
};
