import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { BoardsState } from "../BoardsTypes";
import {
  archiveCard,
  assignCard,
  createCard,
  deleteCard,
  restoreCard,
  toggleCardCompletion,
  updateCard,
} from "../CardsThunks";

export const CardReducers = (builder: ActionReducerMapBuilder<BoardsState>) => {
  builder
    .addCase(createCard.fulfilled, (state, action) => {
      const newCard = action.payload;
      if (state.currentBoard) {
        const list = state.currentBoard.lists.find((l) => l.id === newCard.list_id);
        if (list) list.cards.push(newCard);
      }
    })
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
    .addCase(restoreCard.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      const list = state.currentBoard.lists.find((l) => l.id === action.payload.list_id);
      if (list) {
        list.cards.push(action.payload);
        list.cards.sort((a, b) => a.position - b.position);
      }
    })
    .addCase(toggleCardCompletion.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const cardIndex = list.cards.findIndex((c) => c.id === action.payload.cardId);
        if (cardIndex !== -1) {
          list.cards[cardIndex].is_completed = action.payload.is_completed;
          break;
        }
      }
    })
    .addCase(assignCard.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const cardIndex = list.cards.findIndex((c) => c.id === action.payload.id);
        if (cardIndex !== -1) {
          list.cards[cardIndex] = action.payload;
          break;
        }
      }
    });
};
