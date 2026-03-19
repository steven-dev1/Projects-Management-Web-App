import { handleThunkError } from "@/lib/handleThunkError";
import { labelsService } from "@/services/labelsService";
import { Label } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addLabelToCard = createAsyncThunk<
  { cardId: string; label: Label },
  { cardId: string; label: Label },
  { rejectValue: string }
>("labels/addLabelToCard", async (payload, { rejectWithValue }) => {
  try {
    const { error } = await labelsService.addToCard(payload.cardId, payload.label);
    if (error) return rejectWithValue(error.message);
    return payload;
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al agregar etiqueta"));
  }
});

export const removeLabelFromCard = createAsyncThunk<
  { cardId: string; labelId: string },
  { cardId: string; labelId: string },
  { rejectValue: string }
>("labels/removeLabelFromCard", async (payload, { rejectWithValue }) => {
  try {
    const { error } = await labelsService.removeFromCard(payload.cardId, payload.labelId);
    if (error) return rejectWithValue(error.message);
    return payload;
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al quitar etiqueta"));
  }
});

export const updateLabel = createAsyncThunk<Label, { labelId: string; name: string }, { rejectValue: string }>(
  "labels/updateLabel",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await labelsService.update(payload.labelId, payload.name);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al actualizar etiqueta"));
    }
  },
);
