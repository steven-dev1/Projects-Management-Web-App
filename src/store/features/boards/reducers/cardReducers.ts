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
import { findCardInState } from "./stateHelpers";


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
      const found = findCardInState(state, action.payload.id);
      if (!found) return;
      found.list.cards[found.cardIndex] = {
        ...found.card,
        title: action.payload.title,
        description: action.payload.description,
        due_date: action.payload.due_date,
      };
    })
    .addCase(deleteCard.fulfilled, (state, action) => {
      const found = findCardInState(state, action.payload);
      if (!found) return;
      found.list.cards.splice(found.cardIndex, 1);
      found.list.cards.forEach((c, i) => {
        c.position = i;
      });
    })
    .addCase(archiveCard.fulfilled, (state, action) => {
      const found = findCardInState(state, action.payload);
      if (!found) return;
      found.list.cards.splice(found.cardIndex, 1);
      found.list.cards.forEach((c, i) => {
        c.position = i;
      });
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
      const found = findCardInState(state, action.payload.cardId);
      if (!found) return;
      found.card.is_completed = action.payload.is_completed;
    })
    .addCase(assignCard.fulfilled, (state, action) => {
      const found = findCardInState(state, action.payload.id);
      if (!found) return;
      found.list.cards[found.cardIndex] = {
        ...found.card,
        assigned_to: action.payload.assigned_to,
      };
    });
};
