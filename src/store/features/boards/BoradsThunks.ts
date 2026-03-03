import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@/lib/supabaseClient";
import { Board, BoardForm } from "./BoardsTypes";

const supabase = createClient();

export const fetchBoards = createAsyncThunk("boards/fetchBoards", async (_, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase.from("boards").select("*, lists (*, cards(*))");
    if (error) throw error;
    console.log(data);
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return rejectWithValue(message);
  }
});

export const createBoard = createAsyncThunk<Board, BoardForm, { rejectValue: string }>(
  "boards/createBoard",
  async (boardForm: BoardForm, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.rpc("create_board_with_owner", {
        board_name: boardForm.name,
        board_description: boardForm.description,
      });

      if (error) throw error;

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      return rejectWithValue(message);
    }
  },
);

export const updateBoard = createAsyncThunk<Board[], Board, { rejectValue: string }>(
  "boards/updateBoard",
  async ({ id, name, description }: Board, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("boards")
        .update({ name, description })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      return rejectWithValue(message);
    }
  },
);

export const deleteBoard = createAsyncThunk<string, string, { rejectValue: string }>(
  "boards/deleteBoard",
  async (id, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("boards").delete().eq("id", id).select().single();
      if (error) throw error;
      return id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      return rejectWithValue(message);
    }
  },
);
