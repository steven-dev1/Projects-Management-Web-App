import { createAsyncThunk } from "@reduxjs/toolkit";

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