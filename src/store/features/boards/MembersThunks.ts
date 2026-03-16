// store/features/boards/MembersThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@/lib/supabaseClient";
import { BoardMember } from "@/types";

const supabase = createClient();

export const removeMember = createAsyncThunk<string, { memberId: string }, { rejectValue: string }>(
  "members/removeMember",
  async ({ memberId }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("board_members").delete().eq("id", memberId);

      if (error) return rejectWithValue(error.message);
      return memberId;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al eliminar miembro";
      return rejectWithValue(message);
    }
  },
);

export const updateMemberRole = createAsyncThunk<
  BoardMember,
  { memberId: string; role: "admin" | "member" },
  { rejectValue: string }
>("members/updateRole", async ({ memberId, role }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("board_members")
      .update({ role })
      .eq("id", memberId)
      .select("*, profiles!user_id(full_name, avatar_url)")
      .single();

    if (error) return rejectWithValue(error.message);
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar rol";
    return rejectWithValue(message);
  }
});
