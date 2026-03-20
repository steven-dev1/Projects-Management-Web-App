import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card, CreateCardPayload, UpdateCardPayload } from "./BoardsTypes";
import { RootState } from "@/store/store";
import { cardsService } from "@/services/cardsService";
import { handleThunkError } from "@/lib/handleThunkError";
import { Label } from "@/types";

export const updateCardOrder = createAsyncThunk(
  "boards/updateCardOrder",
  async (payload: { cardId: string; newListId: string; newIndex: number; oldListId: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await cardsService.updateOrder(
        payload.cardId,
        payload.newListId,
        payload.newIndex,
        payload.oldListId,
      );
      if (error) return rejectWithValue(error.message);
      return { success: true, data };
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al actualizar el card"));
    }
  },
);

export const createCard = createAsyncThunk<Card, CreateCardPayload, { rejectValue: string }>(
  "cards/createCard",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await cardsService.create(payload);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al crear la tarjeta"));
    }
  },
);

export const updateCard = createAsyncThunk<Card, UpdateCardPayload, { rejectValue: string }>(
  "cards/updateCard",
  async (payload, { rejectWithValue }) => {
    try {
      const { data, error } = await cardsService.update(payload);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al actualizar la tarjeta"));
    }
  },
);

export const deleteCard = createAsyncThunk<string, string, { rejectValue: string }>(
  "cards/deleteCard",
  async (cardId, { rejectWithValue }) => {
    try {
      const { error } = await cardsService.delete(cardId);
      if (error) return rejectWithValue(error.message);
      return cardId;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al eliminar la tarjeta"));
    }
  },
);

export const archiveCard = createAsyncThunk<string, string, { rejectValue: string }>(
  "cards/archiveCard",
  async (cardId, { rejectWithValue }) => {
    try {
      const { error } = await cardsService.archive(cardId);
      if (error) return rejectWithValue(error.message);
      return cardId;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al archivar la tarjeta"));
    }
  },
);

export const restoreCard = createAsyncThunk<Card, string, { rejectValue: string }>(
  "cards/restoreCard",
  async (cardId, { rejectWithValue }) => {
    try {
      const { data, error } = await cardsService.restore(cardId);
      if (error) return rejectWithValue(error.message);
      return {
        ...data,
        labels: data.card_labels?.map((cl: { labels: Label }) => cl.labels) ?? [],
      };
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al restaurar la tarjeta"));
    }
  }
);

export const toggleCardCompletion = createAsyncThunk<
  { cardId: string; is_completed: boolean },
  string,
  { rejectValue: string; state: RootState }
>("cards/toggleCardCompletion", async (cardId, { rejectWithValue, getState }) => {
  try {
    const card = getState()
      .boards.currentBoard?.lists.flatMap((l) => l.cards)
      .find((c) => c.id === cardId);

    if (!card) return rejectWithValue("Card no encontrada");

    const { error } = await cardsService.toggleCompletion(cardId, card.is_completed ?? false);
    if (error) return rejectWithValue(error.message);

    return { cardId, is_completed: !card.is_completed };
  } catch (err: unknown) {
    return rejectWithValue(handleThunkError(err, "Error al actualizar la tarjeta"));
  }
});

export const assignCard = createAsyncThunk<Card, { cardId: string; userId: string | null }, { rejectValue: string }>(
  "cards/assignCard",
  async ({ cardId, userId }, { rejectWithValue }) => {
    try {
      const { data, error } = await cardsService.assign(cardId, userId);
      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err: unknown) {
      return rejectWithValue(handleThunkError(err, "Error al asignar la tarjeta"));
    }
  },
);
