import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateCardOrder = createAsyncThunk(
  "boards/updateCardOrder",
  async (
    payload: { cardId: string; newListId: string; newIndex: number; oldListId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/boards/cards", {
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