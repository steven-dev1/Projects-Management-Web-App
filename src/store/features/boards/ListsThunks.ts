import { createAsyncThunk } from "@reduxjs/toolkit";
import { BoardList, ListPayload, UpdateListPayload } from "./BoardsTypes";
import { listsService } from "@/services/listsService";
import { handleThunkError } from "@/lib/handleThunkError";

export const createList = createAsyncThunk<BoardList, ListPayload, { rejectValue: string }>(
  "boards/createList",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await listsService.create(payload);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al crear la lista"));
    }
  },
);

export const updateListOrderSupabase = createAsyncThunk<
  void,
  { listId: string; newIndex: number; boardId: string },
  { rejectValue: string }
>("boards/updateListOrder", async (payload, { rejectWithValue }) => {
  try {
    const { error } = await listsService.updateOrder(payload.listId, payload.newIndex, payload.boardId);
    if (error) return rejectWithValue(error.message);
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al reordenar listas"));
  }
});

export const archiveList = createAsyncThunk<string, string, { rejectValue: string }>(
  "lists/archiveList",
  async (listId, { rejectWithValue }) => {
    try {
      const { error } = await listsService.archive(listId);
      if (error) return rejectWithValue(error.message);
      return listId;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al archivar la lista"));
    }
  },
);

export const restoreList = createAsyncThunk<BoardList, string, { rejectValue: string }>(
  "lists/restoreList",
  async (listId, { rejectWithValue }) => {
    try {
      const { data, error } = await listsService.restore(listId);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al restaurar la lista"));
    }
  },
);

export const deleteList = createAsyncThunk<string, string, { rejectValue: string }>(
  "lists/deleteList",
  async (listId, { rejectWithValue }) => {
    try {
      const { error } = await listsService.delete(listId);
      if (error) return rejectWithValue(error.message);
      return listId;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al eliminar la lista"));
    }
  },
);

export const updateList = createAsyncThunk<BoardList, UpdateListPayload, { rejectValue: string }>(
  "lists/updateList",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await listsService.update(payload);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al actualizar la lista"));
    }
  },
);
