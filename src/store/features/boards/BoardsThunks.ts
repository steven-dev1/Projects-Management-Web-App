import { createAsyncThunk } from "@reduxjs/toolkit";
import { BoardForm, BoardResponse, UpdatedBoardPayload } from "./BoardsTypes";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

export const fetchBoards = createAsyncThunk("boards/fetchBoards", async (_, { rejectWithValue }) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return rejectWithValue("No autenticado");

    const { data, error } = await supabase
      .from("boards")
      .select(
        `
    *,
    board_members!inner(user_id),
    lists(
      id,
      cards(
        id,
        title,
        assigned_to,
        due_date,
        is_completed,
        status
      )
    )
  `,
      )
      .eq("board_members.user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) return rejectWithValue(error.message);
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error obteniendo boards";
    return rejectWithValue(message);
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
      const message = err instanceof Error ? err.message : "Error obteniendo el board";
      return rejectWithValue(message);
    }
  },
);

export const createBoard = createAsyncThunk<BoardResponse, BoardForm, { rejectValue: string }>(
  "boards/createBoard",
  async (boardForm, { rejectWithValue }) => {
    try {
      if (!boardForm.name?.trim()) {
        return rejectWithValue("El nombre del tablero es obligatorio");
      }

      const { data, error } = await supabase.rpc("create_board_with_owner", {
        board_name: boardForm.name,
        board_description: boardForm.description ?? null,
      });

      if (error) return rejectWithValue(error.message || "No se pudo crear el tablero");

      return data as BoardResponse;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear el tablero";
      return rejectWithValue(message);
    }
  },
);

export const updateBoard = createAsyncThunk<BoardResponse, UpdatedBoardPayload, { rejectValue: string }>(
  "boards/updateBoard",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("boards")
        .update({
          name: payload.name,
          description: payload.description,
          background_color: payload.background_color,
        })
        .eq("id", payload.boardId)
        .select()
        .single();

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar el proyecto";
      return rejectWithValue(message);
    }
  },
);

export const deleteBoard = createAsyncThunk<string, string, { rejectValue: string }>(
  "boards/deleteBoard",
  async (id, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from("boards")
        .delete()
        .eq("id", id);

      if (error) return rejectWithValue(error.message);
      return id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al eliminar el tablero";
      return rejectWithValue(message);
    }
  },
);
