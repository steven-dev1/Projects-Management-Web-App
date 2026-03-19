import { createAsyncThunk } from "@reduxjs/toolkit";
import { BoardMember } from "@/types";
import { membersService } from "@/services/membersService";
import { handleThunkError } from "@/lib/handleThunkError";

export const removeMember = createAsyncThunk<string, { memberId: string }, { rejectValue: string }>(
  "members/removeMember",
  async ({ memberId }, { rejectWithValue }) => {
    try {
      const { error } = await membersService.remove(memberId);
      if (error) return rejectWithValue(error.message);
      return memberId;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al eliminar miembro"));
    }
  },
);

export const updateMemberRole = createAsyncThunk<
  BoardMember,
  { memberId: string; role: "admin" | "member" },
  { rejectValue: string }
>("members/updateRole", async ({ memberId, role }, { rejectWithValue }) => {
  try {
    const { data, error } = await membersService.updateRole(memberId, role);
    if (error) return rejectWithValue(error.message);
    return data;
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al actualizar rol"));
  }
});
