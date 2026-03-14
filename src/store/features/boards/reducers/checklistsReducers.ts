import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { BoardsState } from "../BoardsTypes";
import {
  addChecklistItem,
  createChecklist,
  deleteChecklist,
  deleteChecklistItem,
  toggleChecklistItem,
  updateChecklistItem,
} from "../ChecklistThunks";

export const ChecklistsReducers = (builder: ActionReducerMapBuilder<BoardsState>) => {
  builder
    .addCase(createChecklist.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const card = list.cards.find((c) => c.id === action.payload.card_id);
        if (card) {
          if (!card.checklists) card.checklists = [];
          card.checklists.push(action.payload);
          break;
        }
      }
    })

    .addCase(deleteChecklist.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const card = list.cards.find((c) => c.id === action.payload.cardId);
        if (card?.checklists) {
          card.checklists = card.checklists.filter((cl) => cl.id !== action.payload.checklistId);
          break;
        }
      }
    })

    .addCase(addChecklistItem.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const card = list.cards.find((c) => c.id === action.payload.cardId);
        if (card?.checklists) {
          const checklist = card.checklists.find((cl) => cl.id === action.payload.item.checklist_id);
          if (checklist) {
            checklist.items.push(action.payload.item);
            break;
          }
        }
      }
    })

    .addCase(toggleChecklistItem.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const card = list.cards.find((c) => c.id === action.payload.cardId);
        if (card?.checklists) {
          const checklist = card.checklists.find((cl) => cl.id === action.payload.checklistId);
          if (checklist) {
            const item = checklist.items.find((i) => i.id === action.payload.itemId);
            if (item) item.is_completed = action.payload.is_completed;
            break;
          }
        }
      }
    })

    .addCase(deleteChecklistItem.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const card = list.cards.find((c) => c.id === action.payload.cardId);
        if (card?.checklists) {
          const checklist = card.checklists.find((cl) => cl.id === action.payload.checklistId);
          if (checklist) {
            checklist.items = checklist.items.filter((i) => i.id !== action.payload.itemId);
            break;
          }
        }
      }
    })

    .addCase(updateChecklistItem.fulfilled, (state, action) => {
      if (!state.currentBoard) return;
      for (const list of state.currentBoard.lists) {
        const card = list.cards.find((c) => c.id === action.payload.cardId);
        if (card?.checklists) {
          const checklist = card.checklists.find((cl) => cl.id === action.payload.checklistId);
          if (checklist) {
            const item = checklist.items.find((i) => i.id === action.payload.itemId);
            if (item) item.title = action.payload.title;
            break;
          }
        }
      }
    });
};
