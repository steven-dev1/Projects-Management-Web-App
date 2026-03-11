
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BoardList, ListPayload, UpdateListPayload } from "./BoardsTypes";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

export const createList = createAsyncThunk(
  "boards/createList",
  async (payload: ListPayload, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/boards/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al crear la lista");
      return await response.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear la lista";
      return rejectWithValue(message);
    }
  }
);  

export const updateListOrderSupabase = createAsyncThunk(
  "boards/updateListOrder",
  async (payload: { listId: string; newIndex: number; boardId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/boards/lists/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error("Error al reordenar listas");
      return await response.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar el lista";
      return rejectWithValue(message);
    }
  }
);

export const archiveList = createAsyncThunk<string, string, { rejectValue: string }>(
  "lists/archiveList",
  async (listId, { rejectWithValue }) => {
    try {

      const { error } = await supabase.rpc("archive_list", {
        p_list_id: listId,
      });

      if (error) return rejectWithValue(error.message);
      return listId;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al archivar la lista";
      return rejectWithValue(message);
    }
  }
);

export const updateList = createAsyncThunk<BoardList, UpdateListPayload, { rejectValue: string }>(
  "lists/updateList",
  async (payload, { rejectWithValue }) => {
    try {

      const { data, error } = await supabase.rpc("update_list", {
        p_list_id: payload.listId,
        p_title: payload.title,
        p_background_color: payload.background_color,
      });

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar la lista";
      return rejectWithValue(message);
    }
  }
);