import { createAsyncThunk } from "@reduxjs/toolkit";
import { BoardList, ListPayload, UpdateListPayload } from "./BoardsTypes";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

export const createList = createAsyncThunk<BoardList, ListPayload, { rejectValue: string }>(
  "boards/createList",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("lists")
        .insert([
          {
            title: payload.title,
            board_id: payload.board_id,
            background_color: payload.background_color,
            position: payload.position,
          },
        ])
        .select()
        .single();

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear la lista";
      return rejectWithValue(message);
    }
  },
);

export const updateListOrderSupabase = createAsyncThunk<
  void,
  { listId: string; newIndex: number; boardId: string },
  { rejectValue: string }
>("boards/updateListOrder", async (payload, { rejectWithValue }) => {
  try {
    const { error } = await supabase.rpc("update_list_positions", {
      p_list_id: payload.listId,
      p_new_position: payload.newIndex,
      p_board_id: payload.boardId,
    });

    if (error) return rejectWithValue(error.message);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al reordenar listas";
    return rejectWithValue(message);
  }
});

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
  },
);

export const restoreList = createAsyncThunk<BoardList, string, { rejectValue: string }>(
  "lists/restoreList",
  async (listId, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("lists").update({ status: "active" }).eq("id", listId);

      if (error) return rejectWithValue(error.message);

      const { data, error: fetchError } = await supabase
        .from("lists")
        .select("*, cards!list_id(*)")
        .eq("id", listId)
        .eq("cards.status", "active")
        .single();

      if (fetchError) return rejectWithValue(fetchError.message);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al restaurar la lista";
      return rejectWithValue(message);
    }
  },
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
  },
);
