import { createClient } from "@/lib/supabaseClient";
import { Label } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
const supabase = createClient();

export const addLabelToCard = createAsyncThunk<
  { cardId: string; label: Label },
  { cardId: string; label: Label },
  { rejectValue: string }
>("labels/addLabelToCard", async (payload, { rejectWithValue }) => {
  try {
    const { error } = await supabase
      .from("card_labels")
      .insert({ card_id: payload.cardId, label_id: payload.label.id });
    if (error) return rejectWithValue(error.message);
    return payload;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al agregar etiqueta";
    return rejectWithValue(message);
  }
});

// Quitar label de card
export const removeLabelFromCard = createAsyncThunk<
  { cardId: string; labelId: string },
  { cardId: string; labelId: string },
  { rejectValue: string }
>("labels/removeLabelFromCard", async (payload, { rejectWithValue }) => {
  try {
    const { error } = await supabase
      .from("card_labels")
      .delete()
      .eq("card_id", payload.cardId)
      .eq("label_id", payload.labelId);
    if (error) return rejectWithValue(error.message);
    return payload;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al quitar etiqueta";
    return rejectWithValue(message);
  }
});

// Actualizar nombre de label
export const updateLabel = createAsyncThunk<Label, { labelId: string; name: string }, { rejectValue: string }>(
  "labels/updateLabel",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("labels")
        .update({ name: payload.name })
        .eq("id", payload.labelId)
        .select()
        .single();
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar etiqueta";
      return rejectWithValue(message);
    }
  },
);
