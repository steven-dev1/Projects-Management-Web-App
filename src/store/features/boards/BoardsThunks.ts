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

      if (!response.ok) {
        throw new Error("Error fetching board");
      }

      const data = await response.json();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      return rejectWithValue(message);
    }
  },
);

export const createBoard = createAsyncThunk<BoardResponse, BoardForm, { rejectValue: string }>(
  "boards/createBoard",
  async (boardForm: BoardForm, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const newBoard = (await response.json()) as BoardResponse;
      return newBoard;
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
      const response = await fetch("/api/boards", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      return rejectWithValue(message);
    }
  },
);
