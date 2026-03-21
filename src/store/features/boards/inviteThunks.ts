import { handleThunkError } from "@/lib/handleThunkError";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const inviteMember = createAsyncThunk<
  void,
  { boardId: string; email: string; role: "admin" | "member" },
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
    return rejectWithValue(handleThunkError(err, "Error al invitar a un miembro"));
  }
});
