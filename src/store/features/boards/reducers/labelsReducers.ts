import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { addLabelToCard, removeLabelFromCard, updateLabel } from "../LabelsThunks";
import { BoardsState } from "../BoardsTypes";

export const LabelsReducers = (builder: ActionReducerMapBuilder<BoardsState>) => {
  builder
    .addCase(addLabelToCard.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const card = list.cards.find((c) => c.id === action.payload.cardId);
        if (card) {
          if (!card.labels) card.labels = [];
          card.labels.push(action.payload.label);
          break;
        }
      }
    })

    .addCase(removeLabelFromCard.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const card = list.cards.find((c) => c.id === action.payload.cardId);
        if (card) {
          card.labels = card.labels?.filter((l) => l.id !== action.payload.labelId) ?? [];
          break;
        }
      }
    })

    .addCase(updateLabel.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      const labelIndex = state.currentBoard.labels?.findIndex((l) => l.id === action.payload.id);
      if (labelIndex !== undefined && labelIndex !== -1) {
        state.currentBoard.labels![labelIndex] = action.payload;
      }
      for (const list of state.currentBoard.lists) {
        for (const card of list.cards) {
          const cardLabelIndex = card.labels?.findIndex((l) => l.id === action.payload.id);
          if (cardLabelIndex !== undefined && cardLabelIndex !== -1) {
            card.labels![cardLabelIndex] = action.payload;
          }
        }
      }
    });
};
