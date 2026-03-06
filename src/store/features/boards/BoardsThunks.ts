import { createAsyncThunk } from "@reduxjs/toolkit";
import { Board, BoardForm, BoardResponse } from "./BoardsTypes";

export const fetchBoards = createAsyncThunk("boards/fetchBoards", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/boards");

    if (!response.ok) {
      throw new Error("Error obteniendo la lista de boards");
    }

    const data = await response.json();
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ha ocurrido un error desconocido";
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

export const updateBoard = createAsyncThunk<Board[], Board, { rejectValue: string }>(
  "boards/updateBoard",
  async ({ id, name, description }: Board, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/boards", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, description }),
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar el tablero";
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

