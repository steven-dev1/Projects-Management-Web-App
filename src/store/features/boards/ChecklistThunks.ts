import { createAsyncThunk } from "@reduxjs/toolkit";
import { Checklist, ChecklistItem } from "@/types";
import { checklistsService } from "@/services/checklistsService";
import { handleThunkError } from "@/lib/handleThunkError";

export const createChecklist = createAsyncThunk<Checklist, { card_id: string; title: string }, { rejectValue: string }>(
  "checklists/create",
  async ({ card_id, title }, { rejectWithValue }) => {
    try {
      const { data, error } = await checklistsService.create(card_id, title);
      if (error) return rejectWithValue(error.message);
      return { ...data, items: data.items ?? [] };
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al crear checklist"));
    }
  },
);

export const deleteChecklist = createAsyncThunk<
  { checklistId: string; cardId: string },
  { checklistId: string; cardId: string },
  { rejectValue: string }
>("checklists/delete", async ({ checklistId, cardId }, { rejectWithValue }) => {
  try {
    const { error } = await checklistsService.delete(checklistId);
    if (error) return rejectWithValue(error.message);
    return { checklistId, cardId };
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al eliminar checklist"));
  }
});

export const addChecklistItem = createAsyncThunk<
  { item: ChecklistItem; cardId: string },
  { checklist_id: string; title: string; cardId: string },
  { rejectValue: string }
>("checklists/addItem", async ({ checklist_id, title, cardId }, { rejectWithValue }) => {
  try {
    const { data, error } = await checklistsService.addItem(checklist_id, title);
    if (error) return rejectWithValue(error.message);
    return { item: data, cardId };
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al agregar item"));
  }
});

export const toggleChecklistItem = createAsyncThunk<
  { itemId: string; checklistId: string; cardId: string; is_completed: boolean },
  { itemId: string; checklistId: string; cardId: string; is_completed: boolean },
  { rejectValue: string }
>("checklists/toggleItem", async ({ itemId, checklistId, cardId, is_completed }, { rejectWithValue }) => {
  try {
    const { error } = await checklistsService.toggleItem(itemId, is_completed);
    if (error) return rejectWithValue(error.message);
    return { itemId, checklistId, cardId, is_completed };
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al actualizar item"));
  }
});

export const deleteChecklistItem = createAsyncThunk<
  { itemId: string; checklistId: string; cardId: string },
  { itemId: string; checklistId: string; cardId: string },
  { rejectValue: string }
>("checklists/deleteItem", async ({ itemId, checklistId, cardId }, { rejectWithValue }) => {
  try {
    const { error } = await checklistsService.deleteItem(itemId);
    if (error) return rejectWithValue(error.message);
    return { itemId, checklistId, cardId };
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al eliminar item"));
  }
});

export const updateChecklistItem = createAsyncThunk<
  { itemId: string; checklistId: string; cardId: string; title: string },
  { itemId: string; checklistId: string; cardId: string; title: string },
  { rejectValue: string }
>("checklists/updateItem", async ({ itemId, checklistId, cardId, title }, { rejectWithValue }) => {
  try {
    const { error } = await checklistsService.updateItem(itemId, title);
    if (error) return rejectWithValue(error.message);
    return { itemId, checklistId, cardId, title };
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al actualizar item"));
  }
});
