import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card, CreateCardPayload, UpdateCardPayload } from "./BoardsTypes";
import { createClient } from "@/lib/supabaseClient";
import { RootState } from "@/store/store";

const supabase = createClient();

export const updateCardOrder = createAsyncThunk(
  "boards/updateCardOrder",
  async (payload: { cardId: string; newListId: string; newIndex: number; oldListId: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.rpc("update_card_positions", {
        p_card_id: payload.cardId,
        p_new_list_id: payload.newListId,
        p_new_position: payload.newIndex,
        p_old_list_id: payload.oldListId,
      });

      if (error) return rejectWithValue(error.message || "No se pudo actualizar el card");

      return { success: true, data };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar el card";
      return rejectWithValue(message);
    }
  },
);

export const createCard = createAsyncThunk<Card, CreateCardPayload, { rejectValue: string }>(
  "cards/createCard",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .insert([
          {
            title: payload.title,
            list_id: payload.list_id,
            due_date: payload.due_date ?? null,
            description: payload.description ?? null,
            position: payload.position,
          },
        ])
        .select()
        .single();

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear la tarjeta";
      return rejectWithValue(message);
    }
  },
);

export const updateCard = createAsyncThunk<Card, UpdateCardPayload, { rejectValue: string }>(
  "cards/updateCard",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .update({
          title: payload.title,
          description: payload.description,
          due_date: payload.due_date,
        })
        .eq("id", payload.cardId)
        .select()
        .single();

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar la tarjeta";
      return rejectWithValue(message);
    }
  },
);

export const deleteCard = createAsyncThunk<string, string, { rejectValue: string }>(
  "cards/deleteCard",
  async (cardId, { rejectWithValue }) => {
    try {
      const { error } = await supabase.from("cards").delete().eq("id", cardId);

      if (error) return rejectWithValue(error.message);
      return cardId;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al eliminar la tarjeta";
      return rejectWithValue(message);
    }
  },
);

export const archiveCard = createAsyncThunk<string, string, { rejectValue: string }>(
  "cards/archiveCard",
  async (cardId, { rejectWithValue }) => {
    try {
      const { error } = await supabase.rpc("archive_card", {
        p_card_id: cardId,
      });

      if (error) return rejectWithValue(error.message);

      return cardId;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al archivar la tarjeta";
      return rejectWithValue(message);
    }
  },
);

export const restoreCard = createAsyncThunk<Card, string, { rejectValue: string }>(
  "cards/restoreCard",
  async (cardId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .update({ status: "active" })
        .eq("id", cardId)
        .select("*, card_labels(*, labels(*))")
        .single();

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al restaurar la tarjeta";
      return rejectWithValue(message);
    }
  },
);

export const toggleCardCompletion = createAsyncThunk<
  { cardId: string; is_completed: boolean },
  string,
  { rejectValue: string }
>("cards/toggleCardCompletion", async (cardId, { rejectWithValue, getState }) => {
  try {
    const state = getState() as RootState;
    const card = state.boards.currentBoard?.lists.flatMap((l) => l.cards).find((c) => c.id === cardId);
    if (!card) return rejectWithValue("Card no encontrada");

    const { error } = await supabase.from("cards").update({ is_completed: !card.is_completed }).eq("id", cardId);

    if (error) return rejectWithValue(error.message);
    return { cardId, is_completed: !card.is_completed };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar la tarjeta";
    return rejectWithValue(message);
  }
});

export const assignCard = createAsyncThunk<
  Card,
  { cardId: string; userId: string | null; boardId?: string; boardName?: string; cardTitle?: string },
  { rejectValue: string }
>("cards/assignCard", async ({ cardId, userId }, { rejectWithValue }) => {
  try {
    const { data, error } = await supabase
      .from("cards")
      .update({ assigned_to: userId })
      .eq("id", cardId)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);

    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al asignar la tarjeta";
    return rejectWithValue(message);
  }
});
