import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { BoardsState } from "../BoardsTypes";
import { archiveList, createList, deleteList, restoreList, updateList } from "../ListsThunks";

export const ListReducers = (builder: ActionReducerMapBuilder<BoardsState>) => {
  builder
    .addCase(createList.fulfilled, (state, action) => {
      if (state.currentBoard && action.payload) {
        state.currentBoard.lists.push({ ...action.payload, cards: [] });
      }
    })
    .addCase(updateList.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      const listIndex = state.currentBoard.lists.findIndex((l) => l.id === action.payload.id);
      if (listIndex !== -1) {
        const existingCards = state.currentBoard.lists[listIndex].cards;
        state.currentBoard.lists[listIndex] = { ...action.payload, cards: existingCards };
      }
    })
    .addCase(archiveList.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      const listIndex = state.currentBoard.lists.findIndex((l) => l.id === action.payload);
      if (listIndex !== -1) {
        state.currentBoard.lists.splice(listIndex, 1);
        state.currentBoard.lists.forEach((l, i) => {
          l.position = i;
        });
      }
    })
    .addCase(deleteList.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      const listIndex = state.currentBoard.lists.findIndex((l) => l.id === action.payload);
      if (listIndex !== -1) {
        state.currentBoard.lists.splice(listIndex, 1);
        state.currentBoard.lists.forEach((l, i) => {
          l.position = i;
        });
      }
    })
    .addCase(restoreList.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      const restoredList = {
        ...action.payload,
        cards: [...(action.payload.cards ?? [])].sort((a, b) => a.position - b.position),
      };

      const insertIndex = state.currentBoard.lists.findIndex((l) => l.position >= restoredList.position);

      if (insertIndex === -1) {
        state.currentBoard.lists.push(restoredList);
      } else {
        state.currentBoard.lists.splice(insertIndex, 0, restoredList);
      }
    });
};
