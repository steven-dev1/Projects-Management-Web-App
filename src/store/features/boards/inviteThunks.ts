import { createAsyncThunk } from "@reduxjs/toolkit";

export const inviteMember = createAsyncThunk<
  void,
  { boardId: string; email: string; role?: string },
  { rejectValue: string }
>("boards/inviteMember", async (payload, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/boards/${payload.boardId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.email, role: payload.role ?? "member" }),
    });

    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.error);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al enviar invitación";
    return rejectWithValue(message);
  }
});
