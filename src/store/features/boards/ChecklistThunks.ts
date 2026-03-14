import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@/lib/supabaseClient";
import { Checklist, ChecklistItem } from "@/types";

const supabase = createClient();

// Crear checklist
export const createChecklist = createAsyncThunk<Checklist, { card_id: string; title: string }, { rejectValue: string }>(
  "checklists/create",
  async ({ card_id, title }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("checklists")
        .insert({ card_id, title, position: 0 })
        .select("*, items:checklist_items(*)")
        .single();

      if (error) return rejectWithValue(error.message);
      return { ...data, items: data.items ?? [] };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear checklist";
      return rejectWithValue(message);
    }
  },
);

// Eliminar checklist
export const deleteChecklist = createAsyncThunk<
  { checklistId: string; cardId: string },
  { checklistId: string; cardId: string },
  { rejectValue: string }
>("checklists/delete", async ({ checklistId, cardId }, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("checklists").delete().eq("id", checklistId);

    if (error) return rejectWithValue(error.message);
    return { checklistId, cardId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al eliminar checklist";
    return rejectWithValue(message);
  }
});

// Agregar item
export const addChecklistItem = createAsyncThunk<
  { item: ChecklistItem; cardId: string },
  { checklist_id: string; title: string; cardId: string },
  { rejectValue: string }
>("checklists/addItem", async ({ checklist_id, title, cardId }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("checklist_items")
      .insert({ checklist_id, title, position: 0 })
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return { item: data, cardId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al agregar item";
    return rejectWithValue(message);
  }
});

// Toggle item
export const toggleChecklistItem = createAsyncThunk<
  { itemId: string; checklistId: string; cardId: string; is_completed: boolean },
  { itemId: string; checklistId: string; cardId: string; is_completed: boolean },
  { rejectValue: string }
>("checklists/toggleItem", async ({ itemId, checklistId, cardId, is_completed }, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("checklist_items").update({ is_completed }).eq("id", itemId);

    if (error) return rejectWithValue(error.message);
    return { itemId, checklistId, cardId, is_completed };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar item";
    return rejectWithValue(message);
  }
});

// Eliminar item
export const deleteChecklistItem = createAsyncThunk<
  { itemId: string; checklistId: string; cardId: string },
  { itemId: string; checklistId: string; cardId: string },
  { rejectValue: string }
>("checklists/deleteItem", async ({ itemId, checklistId, cardId }, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("checklist_items").delete().eq("id", itemId);

    if (error) return rejectWithValue(error.message);
    return { itemId, checklistId, cardId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al eliminar item";
    return rejectWithValue(message);
  }
});

// Actualizar título de item
export const updateChecklistItem = createAsyncThunk<
  { itemId: string; checklistId: string; cardId: string; title: string },
  { itemId: string; checklistId: string; cardId: string; title: string },
  { rejectValue: string }
>("checklists/updateItem", async ({ itemId, checklistId, cardId, title }, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("checklist_items").update({ title }).eq("id", itemId);

    if (error) return rejectWithValue(error.message);
    return { itemId, checklistId, cardId, title };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar item";
    return rejectWithValue(message);
  }
});
