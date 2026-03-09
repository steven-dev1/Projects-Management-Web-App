import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card } from "./BoardsTypes";

export const updateCardOrder = createAsyncThunk(
  "boards/updateCardOrder",
  async (
    payload: { cardId: string; newListId: string; newIndex: number; oldListId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/boards/cards/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error al actualizar el card";
        return rejectWithValue(message);
    }
  }
);

export const createCard = createAsyncThunk(
  "cards/createCard",
  async (
    payload: Card,
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/boards/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al crear la tarjeta");
      return await response.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear la tarjeta";
      return rejectWithValue(message);
    }
  }
);