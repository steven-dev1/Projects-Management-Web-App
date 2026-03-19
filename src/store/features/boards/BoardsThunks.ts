import { createAsyncThunk } from "@reduxjs/toolkit";
import { BoardForm, BoardResponse, UpdatedBoardPayload } from "./BoardsTypes";
import { supabase } from "@/lib/supabase";
import { boardsService } from "@/services/boardsService";
import { handleThunkError } from "@/lib/handleThunkError";

export const fetchBoards = createAsyncThunk("boards/fetchBoards", async (_, { rejectWithValue }) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return rejectWithValue("No autenticado");
    const { data, error } = await boardsService.fetchAll(user.id);
    if (error) return rejectWithValue(error.message);
    return data;
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error obteniendo boards"));
  }
});

export const fetchBoardById = createAsyncThunk<BoardResponse, string, { rejectValue: string }>(
  "boards/fetchBoardById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/boards/${id}`);
      const data = await response.json();

      if (!response.ok) return rejectWithValue(data.error || "Error obteniendo el board");

      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error obteniendo el board"));
    }
  },
);

export const createBoard = createAsyncThunk<BoardResponse, BoardForm, { rejectValue: string }>(
  "boards/createBoard",
  async (boardForm, { rejectWithValue }) => {
    try {
      if (!boardForm.name?.trim()) return rejectWithValue("El nombre del tablero es obligatorio");
      const { data, error } = await boardsService.create(boardForm);
      if (error) return rejectWithValue(error.message);
      return data as BoardResponse;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al crear el tablero"));
    }
  },
);

export const updateBoard = createAsyncThunk<BoardResponse, UpdatedBoardPayload, { rejectValue: string }>(
  "boards/updateBoard",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await boardsService.update(payload);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al actualizar el proyecto"));
    }
  },
);

export const archiveBoard = createAsyncThunk<string, string, { rejectValue: string }>(
  "boards/archiveBoard",
  async (boardId, { rejectWithValue }) => {
    try {
      const { error } = await boardsService.archive(boardId);
      if (error) return rejectWithValue(error.message);
      return boardId;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al archivar el tablero"));
    }
  },
);

export const restoreBoard = createAsyncThunk<BoardResponse, string, { rejectValue: string }>(
  "boards/restoreBoard",
  async (boardId, { rejectWithValue }) => {
    try {
      const { data, error } = await boardsService.restore(boardId);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al restaurar el tablero"));
    }
  },
);

export const deleteBoard = createAsyncThunk<string, string, { rejectValue: string }>(
  "boards/deleteBoard",
  async (id, { rejectWithValue }) => {
    try {
      const { error } = await boardsService.delete(id);
      if (error) return rejectWithValue(error.message);
      return id;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al eliminar el tablero"));
    }
  },
);
